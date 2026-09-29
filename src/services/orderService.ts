import type { Order } from "../types/order";

const API_URL = "https://smart-store-production-e7e1.up.railway.app";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No hay una sesión activa.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("La sesión expiró. Volvé a iniciar sesión.");
    }

    throw new Error(`Error al obtener órdenes: ${response.status}`);
  }

  const data = await response.json();

  console.log("Respuesta real de /orders:", JSON.stringify(data, null, 2));

  return data as Order[];
}

export async function getOrderById(orderId: string): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/one/${orderId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("La sesión expiró. Volvé a iniciar sesión.");
    }

    throw new Error(`Error al obtener la orden: ${response.status}`);
  }

  const data = await response.json();

  console.log("Orden individual:", JSON.stringify(data, null, 2));

  return data as Order;
}
