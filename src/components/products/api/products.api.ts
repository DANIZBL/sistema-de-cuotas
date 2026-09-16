import api from "../../../lib/axios.config";
import { toApiErrorMessage } from "../../../lib/apiError";
import type { CreateProductPayload, Product } from "../model/types";

/* Única capa de la feature que sabe de HTTP. */

export async function getProducts(): Promise<Product[]> {
    try {
        const { data } = await api.get<Product[]>("/products");

        // Normalizamos en el borde: así la UI puede confiar en los tipos y no
        // necesita `?.` defensivo en cada acceso a `skus` / `images`.
        return (data ?? []).map((product) => ({
            ...product,
            skus: product.skus ?? [],
            images: product.images ?? [],
        }));
    } catch (error) {
        throw new Error(
            toApiErrorMessage(error, "No se pudieron cargar los productos.")
        );
    }
}

export async function createProduct(
    payload: CreateProductPayload
): Promise<Product> {
    try {
        const { data } = await api.post<Product>("/products", payload);

        return data;
    } catch (error) {
        throw new Error(toApiErrorMessage(error, "No se pudo crear el producto."));
    }
}
