import { useEffect, useMemo, useState } from "react";

import { getOrders } from "../../services/orderService";

import Modal from "../../components/ui/Modal";
import OrderInfo, {
  getOrderStatus,
} from "../../components/installments/OrderInfo";
import InstallmentTable from "../../components/installments/InstallmentTable";

import type {
  Order,
} from "../../types/order";

import "./Cuotas.css";
import SubHeaderComponent from "../../components/SearchAndNewButton";
import BaseTable from "../../components/BaseTable";
import { LoadersTexts } from "../../types/enums";
import loadElements from "../../components/categories/services/loadCategories";
import TableOrders from "./TableOrders";

export default function Ordenes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(LoadersTexts.ORDERS);
        setError("");

        const data = await getOrders();

        setOrders(data);

      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar las órdenes."
        );
      } finally {
        setLoading("");
      }
    })();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.orderNumber == search
      return matchesSearch;
    });
  }, [orders, search]);


  function handleSelectOrder(order: Order) {
    setSelectedOrder(order);
  }

  function handleCloseModal() {
    setSelectedOrder(null);
  }

  return (
    <div className="cuotas-page">
      <SubHeaderComponent
        placeholder="Buscar orden..."
        search={search}
        setSearch={setSearch}
        setShowCreateModal={setShowCreateModal}
      />

      <BaseTable
        error={error}
        loading={loading}
        filteredElement={filteredOrders}
        elementText="Órdenes"
        loadElements={() => loadElements({
          setElement: setOrders,
          getElements: getOrders,
          loadersTexts: LoadersTexts.ORDERS,
          setError,
          setLoader: setLoading
        })}
        TableComponent={<TableOrders orders={orders} handleSelectOrder={handleSelectOrder} selectedOrder={selectedOrder} />}
      />

      {showCreateModal && (
        <Modal
          title={`Crear orden`}
          onClose={handleCloseModal}
          className="order-detail-modal"
        >
          <form>

          </form>
        </Modal>
      )}

      {selectedOrder && (
        <Modal
          title={`Orden #${selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}`}
          onClose={handleCloseModal}
          className="order-detail-modal"
        >
          <OrderInfo order={selectedOrder} />

          <section className="order-detail-installments">
            <h3>Cuotas</h3>

            <InstallmentTable
              orderCurrency={selectedOrder.currency}
              installments={selectedOrder.installments ?? []}
              setSelectedOrder={setSelectedOrder}
            />
          </section>
        </Modal>
      )}
    </div>
  );
}

