import { useState } from "react";
import { formatDate, formatPeriod, formatPrice } from "../../lib/format";

import { Currency, InstallmentStatus, PaymentMethod } from "../../types/order";
import type { Installment, Order } from "../../types/order";

import "./InstallmentTable.css";
import "./installmentPaymentForm.css";
import Modal from "../ui/Modal";
import api from "../../lib/axios.config";
import { AxiosError } from "axios";

const INSTALLMENT_STATUS_DISPLAY: Record<
  InstallmentStatus,
  { key: string; label: string }
> = {
  [InstallmentStatus.PENDIENTE]: { key: "pending", label: "Pendiente" },
  [InstallmentStatus.PARCIAL]: { key: "partial", label: "Parcial" },
  [InstallmentStatus.PAGADA]: { key: "paid", label: "Pagada" },
};

interface InstallmentTableProps {
  installments: Installment[];
  orderCurrency: Currency;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>
}

export default function InstallmentTable({
  installments,
  orderCurrency,
  setSelectedOrder
}: InstallmentTableProps) {

  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  if (installments.length === 0) {
    return (
      <div className="installment-table-empty">
        Esta orden no tiene cuotas.
      </div>
    );
  }

  const sorted = [...installments].sort(
    (a, b) => a.installment_number - b.installment_number
  );

  const paidCount = sorted.filter(
    (installment) => installment.status === InstallmentStatus.PAGADA
  ).length;

  const totalReceived = sorted.reduce(
    (total, installment) => total + Number(installment.amount_received ?? 0),
    0
  );

  return (
    <div className="installment-table">
      <div className="installment-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Cuota</th>

              <th>Período</th>

              <th>Estado</th>

              <th>Monto cuota</th>

              <th>Saldo anterior</th>

              <th>A pagar</th>

              <th>Recibido</th>

              <th>Moneda recibida</th>

              <th>Método</th>

              <th>Cotización</th>

              <th>Fecha de pago</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((installment) => {
              const status = INSTALLMENT_STATUS_DISPLAY[installment.status] ?? {
                key: "pending",
                label: installment.status,
              };

              return (
                <tr key={installment.id} onClick={() => setSelectedInstallment(installment)}>
                  <td className="installment-table-number">
                    {installment.installment_number} / {sorted.length}
                  </td>

                  <td className="installment-table-period">
                    {formatPeriod(installment.period)}
                  </td>

                  <td>
                    <span
                      className={`installment-badge installment-badge-${status.key}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td>{formatPrice(installment.base_amount)}</td>

                  <td>{formatPrice(installment.previous_balance)}</td>

                  <td>
                    <strong>{formatPrice(installment.amount_due)}</strong>
                  </td>

                  <td>
                    {installment.amount_received
                      ? formatPrice(installment.amount_received)
                      : "-"}
                  </td>

                  <td>
                    {installment.currency_received === Currency.US
                      ? "Dólares"
                      : installment.currency_received === Currency.ARS
                        ? "Pesos"
                        : "-"}
                  </td>

                  <td>
                    {installment.payment_method === PaymentMethod.TRANSFERENCIA
                      ? "Transferencia"
                      : installment.payment_method === PaymentMethod.EFECTIVO
                        ? "Efectivo"
                        : "-"}
                  </td>

                  <td>
                    {installment.exchange_rate
                      ? formatPrice(installment.exchange_rate)
                      : "-"}
                  </td>

                  <td>{formatDate(installment.paid_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="installment-table-footer">
        <div>
          <span>Cuotas pagadas</span>

          <strong>
            {paidCount} de {sorted.length}
          </strong>
        </div>

        <div>
          <span>Total recibido</span>

          <strong>{formatPrice(totalReceived)}</strong>
        </div>
      </div>

      {selectedInstallment && (
        <Modal
          onClose={() => {
            setSelectedInstallment(null)
            setPaymentError("")
          }}
          title={`Cuota ${selectedInstallment.installment_number}`}
          className="installment-payment-modal"
        >
          <form
            className="installment-payment-form"
            onSubmit={async (event) => {
              event.preventDefault()
              const form = event.currentTarget
              try {
                setSavingPayment(true)
                setPaymentError("")
                const response = await api.put("/installment", {
                  id: selectedInstallment.id,
                  dto: {
                    amount_received: Number(form.amount_received.value),
                    currency_received: form.currency_received.value,
                    converted_amount: Number(form.exchange_rate.value),
                    payment_method: form.payment_method.value
                  }
                })
                setSelectedOrder(response.data)
                setSelectedInstallment(null)
              } catch (error) {
                setPaymentError(error instanceof AxiosError ? error.response?.data?.message : "Error al registrar el pago")
              } finally {
                setSavingPayment(false)
              }
            }}
          >
            <label>
              Método de pago:
              <select
                name="payment_method"
                defaultValue={selectedInstallment.payment_method ?? ""}
                disabled={savingPayment}
              >
                <option value={PaymentMethod.EFECTIVO}>{PaymentMethod.EFECTIVO}</option>
                <option value={PaymentMethod.TRANSFERENCIA}>{PaymentMethod.TRANSFERENCIA}</option>
              </select>
            </label>
            <label>
              Moneda recibida:
              <select
                name="currency_received"
                defaultValue={selectedInstallment.currency_received ?? orderCurrency}
                disabled={savingPayment}
              >
                <option value={Currency.ARS}>{Currency.ARS}</option>
                <option value={Currency.US}>{Currency.US}</option>
              </select>
            </label>
            <label>
              Monto recibido:
              <input
                name="amount_received"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={selectedInstallment.amount_received ?? ""}
                disabled={savingPayment}
              ></input>
            </label>
            <label>
              Cotización:
              <input
                name="exchange_rate"
                type="number"
                min="0"
                placeholder="Ej: 1200"
                defaultValue={selectedInstallment.converted_amount ?? ""}
                disabled={savingPayment}
              ></input>
            </label>

            {paymentError && (
              <div className="installment-payment-error">{paymentError}</div>
            )}

            <button type="submit" disabled={savingPayment}>
              {savingPayment && (
                <span className="installment-payment-spinner" aria-hidden="true" />
              )}
              {savingPayment ? "Registrando pago..." : "Registrar pago"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
