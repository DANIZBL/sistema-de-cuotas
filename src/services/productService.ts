import api from "../lib/axios.config";
import type {
  CreateBundleProduct,
  CreateSimpleProduct,
  CreateVariableProduct,
  Product,
} from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await api.get(`/products`);

  if (!response.data) {
    if (response.status === 401) {
      throw new Error("La sesión expiró. Volvé a iniciar sesión.");
    }

    throw new Error(`Error al obtener productos: ${response.status}`);
  }

  return response.data as Promise<Product[]>;
}

export async function createProduct(
  productData: CreateSimpleProduct | CreateVariableProduct | CreateBundleProduct
): Promise<Product> {
  const response = await api.post(`/products`, productData);

  if (!response.data) {
    let errorMessage = `Error al crear producto: ${response.status}`;

    try {
      const errorData = await response.data;

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

  return response.data as Promise<Product>;
}
