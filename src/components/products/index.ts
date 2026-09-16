/* Superficie pública de la feature: el resto de la app importa sólo desde acá. */

export { default as ProductForm } from "./ui/ProductForm";
export { default as ProductTable } from "./ui/ProductTable";
export { useProductList } from "./hooks/useProductList";
export type { Product, ProductType } from "./model/types";
