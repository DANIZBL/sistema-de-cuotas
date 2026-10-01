import { useEffect, useState } from "react";

import { getOrders } from "../../services/orderService";

import type {
  Currency,
  Installment,
  Order,
  PaymentMethod,
} from "../../types/order";

import "./Cuotas.css";

interface PaymentMovement {
  id: string;
  installmentId: string;
  installmentNumber: number;
  period: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  date: string;
}

interface LocalInstallment extends Installment {
  localAmountReceived: number;
}

export default function Cuotas() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [localInstallments, setLocalInstallments] = useState<
    LocalInstallment[]
  >([]);

  const [movements, setMovements] = useState<PaymentMovement[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        setOrders(data);

        if (data.length > 0) {
          setSelectedOrder(data[0]);
          initializeInstallments(data[0]);
        }
      } catch (error) {
        console.error("Error al cargar órdenes:", error);

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las órdenes."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  function initializeInstallments(order: Order) {
    const installments: LocalInstallment[] = [...(order.installments ?? [])]
      .sort((a, b) => a.installment_number - b.installment_number)
      .map((installment) => ({
        ...installment,
        localAmountReceived: Number(installment.amount_received ?? 0),
      }));

    setLocalInstallments(installments);
    setMovements([]);
  }

  function handleSelectOrder(order: Order) {
    setSelectedOrder(order);
    initializeInstallments(order);
  }

  /**
   * El saldo anterior de una cuota es solamente
   * el saldo pendiente de la cuota inmediatamente anterior.
   *
   * Ejemplo:
   *
   * Cuota 1 = $150
   * Pago = $70
   * Pendiente = $80
   *
   * Cuota 2:
   * Base = $150
   * Saldo anterior = $80
   * A pagar = $230
   */
  function calculatePreviousBalance(
    installments: LocalInstallment[],
    index: number
  ): number {
    if (index === 0) {
      return 0;
    }

    const previousInstallment = installments[index - 1];

    const previousAmountDue =
      Number(previousInstallment.base_amount || 0) +
      calculatePreviousBalance(installments, index - 1);

    const previousAmountReceived = Number(
      previousInstallment.localAmountReceived || 0
    );

    return Math.max(previousAmountDue - previousAmountReceived, 0);
  }

  function getAmountDue(installment: LocalInstallment, index: number): number {
    const previousBalance = calculatePreviousBalance(localInstallments, index);

    return Number(installment.base_amount || 0) + previousBalance;
  }

  function getPendingAmount(
    installment: LocalInstallment,
    index: number
  ): number {
    const amountDue = getAmountDue(installment, index);

    const amountReceived = Number(installment.localAmountReceived || 0);

    return Math.max(amountDue - amountReceived, 0);
  }

  /**
   * Registra un pago.
   *
   * El pago comienza en la cuota seleccionada.
   * Si sobra dinero después de cubrir esa cuota,
   * continúa aplicándose a las siguientes.
   */
  function registerPayment(
    installmentId: string,
    amount: number,
    currency: Currency,
    paymentMethod: PaymentMethod
  ) {
    if (!selectedOrder || amount <= 0) {
      return;
    }

    const selectedInstallment = localInstallments.find(
      (installment) => installment.id === installmentId
    );

    if (!selectedInstallment) {
      return;
    }

    const movement: PaymentMovement = {
      id: crypto.randomUUID(),
      installmentId,
      installmentNumber: selectedInstallment.installment_number,
      period: selectedInstallment.period,
      amount,
      currency,
      paymentMethod,
      date: new Date().toISOString(),
    };

    setMovements((current) => [...current, movement]);

    setLocalInstallments((currentInstallments) => {
      const installments = currentInstallments.map((installment) => ({
        ...installment,
      }));

      const selectedIndex = installments.findIndex(
        (installment) => installment.id === installmentId
      );

      if (selectedIndex === -1) {
        return currentInstallments;
      }

      let remainingPayment = amount;

      for (
        let index = selectedIndex;
        index < installments.length && remainingPayment > 0;
        index++
      ) {
        const installment = installments[index];

        const previousBalance = calculatePreviousBalance(installments, index);

        const amountDue =
          Number(installment.base_amount || 0) + previousBalance;

        const alreadyReceived = Number(installment.localAmountReceived || 0);

        const pendingAmount = Math.max(amountDue - alreadyReceived, 0);

        if (pendingAmount <= 0) {
          continue;
        }

        const paymentForThisInstallment = Math.min(
          remainingPayment,
          pendingAmount
        );

        installment.localAmountReceived =
          alreadyReceived + paymentForThisInstallment;

        installment.amount_received = installment.localAmountReceived;

        installment.currency_received = currency;
        installment.payment_method = paymentMethod;

        installment.status =
          installment.localAmountReceived >= amountDue
            ? "entregado"
            : "pendiente";

        if (installment.status === "entregado") {
          installment.paid_at = new Date().toISOString();
        } else {
          installment.paid_at = null;
        }

        remainingPayment -= paymentForThisInstallment;
      }

      return installments;
    });
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("es-AR").format(Number(value || 0));
  }

  function formatPeriod(period: string) {
    if (!period) {
      return "-";
    }

    const [year, month] = period.split("-");

    if (!year || !month) {
      return period;
    }

    const date = new Date(Number(year), Number(month) - 1, 1);

    return new Intl.DateTimeFormat("es-AR", {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  const totalDelivered = localInstallments.reduce(
    (total, installment) =>
      total + Number(installment.localAmountReceived || 0),
    0
  );

  const totalPending = localInstallments.reduce(
    (total, installment, index) => total + getPendingAmount(installment, index),
    0
  );

  if (loading) {
    return (
      <div className="cuotas-page">
        <h1>Cuotas</h1>

        <div className="cuotas-loading">Cargando órdenes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cuotas-page">
        <h1>Cuotas</h1>

        <div className="cuotas-error">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="cuotas-page">
        <h1>Cuotas</h1>

        <div className="cuotas-empty">No hay órdenes registradas.</div>
      </div>
    );
  }

  return (
    <div className="cuotas-page">
      <div className="cuotas-header">
        <div>
          <h1>Cuotas</h1>

          <p>Gestión de órdenes y cuotas de clientes.</p>
        </div>
      </div>

      <div className="orders-selector">
        {orders.map((order) => (
          <button
            key={order.id}
            type="button"
            className={
              selectedOrder?.id === order.id
                ? "order-selector active"
                : "order-selector"
            }
            onClick={() => handleSelectOrder(order)}
          >
            <span>Orden</span>

            <strong>#{order.id.slice(0, 8)}</strong>

            <small>
              {order.client_name} {order.client_surname}
            </small>
          </button>
        ))}
      </div>

      {selectedOrder && (
        <>
          <section className="order-summary">
            <div className="order-customer">
              <span>Número de orden</span>

              <strong>#{selectedOrder.id.slice(0, 8)}</strong>
            </div>

            <div className="order-field">
              <label>Nombre</label>

              <div>{selectedOrder.client_name}</div>
            </div>

            <div className="order-field">
              <label>Apellido</label>

              <div>{selectedOrder.client_surname}</div>
            </div>

            <div className="order-field">
              <label>Email</label>

              <div>{selectedOrder.mail || "-"}</div>
            </div>

            <div className="order-field">
              <label>Teléfono</label>

              <div>{selectedOrder.phone || "-"}</div>
            </div>

            <div className="order-field">
              <label>Moneda</label>

              <div>{selectedOrder.currency}</div>
            </div>

            <div className="order-field">
              <label>Precio total</label>

              <div>{formatPrice(selectedOrder.total_amount)}</div>
            </div>

            <div className="order-field">
              <label>Cantidad de cuotas</label>

              <div>{localInstallments.length}</div>
            </div>
          </section>

          <section className="order-product">
            <div className="product-info">
              <div>
                <span>Producto</span>

                <h2>
                  {selectedOrder.items[0]?.sku?.product?.name || "Producto"}
                </h2>
              </div>

              <div>
                <span>Precio</span>

                <strong>
                  {formatPrice(selectedOrder.items[0]?.unit_price || 0)}
                </strong>
              </div>

              <div>
                <span>Cantidad</span>

                <strong>{selectedOrder.items[0]?.quantity || 0}</strong>
              </div>
            </div>
          </section>

          <section className="installments-section">
            <div className="installments-header">
              <div>
                <h2>Cuotas</h2>

                <p>
                  Los cambios se están simulando localmente hasta que el backend
                  permita guardarlos.
                </p>
              </div>
            </div>

            <div className="installments-scroll">
              <div className="installments-table">
                <div className="installments-row installments-row-header">
                  <div>Cuota</div>

                  <div>Período</div>

                  <div>Estado</div>

                  <div>Monto cuota</div>

                  <div>Saldo anterior</div>

                  <div>Monto entregado</div>

                  <div>A pagar</div>

                  <div>Moneda</div>

                  <div>Método</div>

                  <div>Cotización</div>
                </div>

                {localInstallments.map((installment, index) => (
                  <InstallmentRow
                    key={installment.id}
                    installment={installment}
                    index={index}
                    totalInstallments={localInstallments.length}
                    amountDue={getAmountDue(installment, index)}
                    pendingAmount={getPendingAmount(installment, index)}
                    onRegisterPayment={registerPayment}
                  />
                ))}
              </div>
            </div>

            <div className="installments-footer">
              <div className="total-delivered">
                <span>Monto total entregado</span>

                <strong>{formatPrice(totalDelivered)}</strong>
              </div>

              <div className="total-delivered">
                <span>Saldo total pendiente</span>

                <strong>{formatPrice(totalPending)}</strong>
              </div>

              <button
                type="button"
                className="save-installments-button"
                disabled
                title="El backend todavía no permite guardar cambios."
              >
                Guardar cambios
              </button>
            </div>
          </section>

          {movements.length > 0 && (
            <section className="movements-section">
              <div className="installments-header">
                <div>
                  <h2>Historial de movimientos</h2>

                  <p>
                    Registro local de los pagos realizados durante esta sesión.
                  </p>
                </div>
              </div>

              <div className="movements-list">
                {movements
                  .slice()
                  .reverse()
                  .map((movement) => (
                    <div className="movement-item" key={movement.id}>
                      <div>
                        <strong>Cuota {movement.installmentNumber}</strong>

                        <span>{formatPeriod(movement.period)}</span>
                      </div>

                      <div>
                        <strong>{formatPrice(movement.amount)}</strong>

                        <span>{movement.currency}</span>
                      </div>

                      <div>
                        <span>{movement.paymentMethod}</span>

                        <small>{formatDate(movement.date)}</small>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR").format(Number(value || 0));
}

interface InstallmentRowProps {
  installment: LocalInstallment;
  index: number;
  totalInstallments: number;
  amountDue: number;
  pendingAmount: number;
  onRegisterPayment: (
    installmentId: string,
    amount: number,
    currency: Currency,
    paymentMethod: PaymentMethod
  ) => void;
}

function InstallmentRow({
  installment,
  index,
  totalInstallments,
  amountDue,
  pendingAmount,
  onRegisterPayment,
}: InstallmentRowProps) {
  const [paymentAmount, setPaymentAmount] = useState("");

  const [currency, setCurrency] = useState<Currency>(
    installment.currency_received || "pesos"
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    installment.payment_method || "efectivo"
  );

  function handlePayment() {
    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      return;
    }

    onRegisterPayment(installment.id, amount, currency, paymentMethod);

    setPaymentAmount("");
  }

  const status =
    installment.localAmountReceived >= amountDue ? "entregado" : "pendiente";

  const previousBalance = Math.max(
    amountDue - Number(installment.base_amount || 0),
    0
  );

  return (
    <div className="installments-row">
      <div className="installment-number">
        {installment.installment_number} / {totalInstallments}
      </div>

      <div>
        <strong>{formatPeriodLabel(installment.period)}</strong>

        <small>{installment.period}</small>
      </div>

      <div>
        {" "}
        <span
          className={`installment-status ${
            status === "entregado"
              ? "installment-status-paid"
              : "installment-status-pending"
          }`}
        >
          {" "}
          {status === "entregado" ? "Entregado" : "Pendiente"}{" "}
        </span>{" "}
      </div>

      <div>
        <input type="number" value={installment.base_amount} readOnly />
      </div>

      <div>
        <input type="number" value={previousBalance} readOnly />
      </div>

      <div>
        <input
          type="number"
          value={paymentAmount}
          min="0"
          placeholder={String(installment.localAmountReceived || 0)}
          onChange={(event) => setPaymentAmount(event.target.value)}
        />

        <small>
          Total recibido: {formatPrice(installment.localAmountReceived)}
        </small>
      </div>

      <div>
        <strong>{formatPrice(amountDue)}</strong>

        <small>Pendiente: {formatPrice(pendingAmount)}</small>
      </div>

      <div>
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as Currency)}
        >
          <option value="pesos">Pesos</option>

          <option value="dolares">Dólares</option>
        </select>
      </div>

      <div>
        <select
          value={paymentMethod}
          onChange={(event) =>
            setPaymentMethod(event.target.value as PaymentMethod)
          }
        >
          <option value="efectivo">Efectivo</option>

          <option value="transferencia">Transferencia</option>
        </select>

        <button
          type="button"
          onClick={handlePayment}
          disabled={!paymentAmount || Number(paymentAmount) <= 0}
        >
          Registrar pago
        </button>
      </div>

      <div>
        <input
          type="number"
          value={installment.exchange_rate ?? ""}
          placeholder="Cotización"
          readOnly
        />
      </div>
    </div>
  );
}

function formatPeriodLabel(period: string) {
  if (!period) {
    return "-";
  }

  const [year, month] = period.split("-");

  if (!year || !month) {
    return period;
  }

  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(date);
}
