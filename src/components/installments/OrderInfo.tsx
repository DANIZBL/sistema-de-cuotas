import { formatDate, formatPrice } from "../../lib/format";

import { DeliveryMethod, OrderStatus } from "../../types/order";
import type { Order } from "../../types/order";

import "./OrderInfo.css";

const ORDER_STATUS_DISPLAY: Record<OrderStatus, { key: string; label: string }> = {
  [OrderStatus.PENDIENTE]: { key: "pending", label: "Pendiente" },
  [OrderStatus.EN_CURSO]: { key: "partial", label: "En curso" },
  [OrderStatus.PAGADO]: { key: "paid", label: "Pagada" },
};

export function getOrderStatus(order: Order) {
  return (
    ORDER_STATUS_DISPLAY[order.status] ?? {
      key: "none",
      label: order.status || "Sin estado",
    }
  );
}

interface OrderInfoProps {
  order: Order;
}

export default function OrderInfo({ order }: OrderInfoProps) {
  const status = getOrderStatus(order);

  return (
    <div className="order-info">
      <section className="order-info-grid">
        <div className="order-info-field">
          <span>Cliente</span>

          <strong>
            {order.client_name} {order.client_surname}
          </strong>
        </div>

        <div className="order-info-field">
          <span>Estado</span>

          <strong>
            <span className={`order-status order-status-${status.key}`}>
              {status.label}
            </span>
          </strong>
        </div>

        <div className="order-info-field">
          <span>Email</span>

          <strong>{order.mail || "-"}</strong>
        </div>

        <div className="order-info-field">
          <span>Teléfono</span>

          <strong>{order.phone || "-"}</strong>
        </div>

        <div className="order-info-field">
          <span>Total</span>

          <strong>
            {formatPrice(order.total_amount)} {order.currency}
          </strong>
        </div>

        <div className="order-info-field">
          <span>Entrega</span>

          <strong>
            {order.delivered_method === DeliveryMethod.ENVIO
              ? "Envío"
              : "Retiro en local"}
          </strong>
        </div>

        <div className="order-info-field">
          <span>Fecha de creación</span>

          <strong>{formatDate(order.createdAt)}</strong>
        </div>
      </section>

      <section>
        <h3 className="order-info-title">Productos</h3>

        <ul className="order-info-products">
          {order?.items?.map((item) => {
            const image =
              item.sku?.images?.[0]?.url ?? item.sku?.product?.images?.[0]?.url;

            const variants = item.sku?.variantValues
              ?.map((value) => `${value.variant.name}: ${value.variant.value}`)
              .join(" · ");

            const unitPrice = item.discounted_price ?? item.unit_price;

            return (
              <li key={item.id} className="order-info-product">
                {image ? (
                  <img src={image} alt={item.sku?.product?.name} />
                ) : (
                  <div className="order-info-product-placeholder" />
                )}

                <div className="order-info-product-name">
                  <strong>{item.sku?.product?.name || "Producto"}</strong>

                  {variants && <small>{variants}</small>}
                </div>

                <div className="order-info-product-numbers">
                  <small>
                    {item.quantity} x {formatPrice(unitPrice)}
                  </small>

                  <strong>{formatPrice(unitPrice * item.quantity)}</strong>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
