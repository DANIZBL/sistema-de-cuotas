import { getOrderStatus } from "../../components/installments/OrderInfo";
import { Order } from "../../types/order";
import "./Cuotas.css";

interface Props {
    orders: Order[];
    handleSelectOrder(order: Order): void;
    selectedOrder: Order | null
}

export default function TableOrders({ orders, handleSelectOrder, selectedOrder }: Props) {
    return (
        <div className="orders-table-wrapper">
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>N° de orden</th>

                        <th>Cliente</th>

                        <th>Estado</th>

                        <th>Productos</th>

                        <th>Cuotas</th>

                        <th aria-hidden="true" />
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => {
                        const status = getOrderStatus(order);
                        const installmentsCount = order.installments?.length ?? 0;

                        return (
                            <tr
                                key={order.id}
                                className={`orders-table-row ${selectedOrder?.id === order.id ? "active" : ""
                                    }`}
                                tabIndex={0}
                                onClick={() => handleSelectOrder(order)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        handleSelectOrder(order);
                                    }
                                }}
                            >
                                <td className="orders-table-number">
                                    #{order.orderNumber || order.id.slice(0, 8)}
                                </td>

                                <td>
                                    <strong>
                                        {order.client_name} {order.client_surname}
                                    </strong>

                                    {order.mail && <small>{order.mail}</small>}
                                </td>

                                <td>
                                    <span className={`order-status order-status-${status.key}`}>
                                        {status.label}
                                    </span>
                                </td>

                                <td>
                                    <ul className="orders-table-products">
                                        {order.items.map((item) => (
                                            <li key={item.id}>
                                                {item.sku?.product?.name || "Producto"}

                                                {item.quantity > 1 && <small> x{item.quantity}</small>}
                                            </li>
                                        ))}
                                    </ul>
                                </td>

                                <td>
                                    {installmentsCount > 0 ? (
                                        <span className="orders-table-installments">
                                            {installmentsCount}{" "}
                                            {installmentsCount === 1 ? "cuota" : "cuotas"}
                                        </span>
                                    ) : (
                                        <span className="orders-table-no-installments">
                                            Sin cuotas
                                        </span>
                                    )}
                                </td>

                                <td className="orders-table-arrow" aria-hidden="true">
                                    ›
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}