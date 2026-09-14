import type {
  CreateBundleProduct,
  CreateSimpleProduct,
  CreateVariableProduct,
  Product,
} from "../types/product";

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

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("La sesión expiró. Volvé a iniciar sesión.");
    }

    throw new Error(`Error al obtener productos: ${response.status}`);
  }

  return response.json() as Promise<Product[]>;
}

export async function createProduct(
  productData: CreateSimpleProduct | CreateVariableProduct | CreateBundleProduct
): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    let errorMessage = `Error al crear producto: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // La respuesta no contiene JSON.
    }

    if (response.status === 401) {
      errorMessage = "La sesión expiró. Volvé a iniciar sesión.";
    }

    if (response.status === 403) {
      errorMessage = "No tenés permisos para crear productos.";
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<Product>;
}
