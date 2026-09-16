/* =========================================================
   Tipos de la feature Productos.

   Tres capas bien separadas, no mezclar:
     1. Entidades  → lo que devuelve la API
     2. Payloads   → lo que se le envía a la API
     3. Formulario → estado local mientras el usuario edita
   ========================================================= */

export type ProductType = "simple" | "variable" | "bundle";

/* ---------- 1. Entidades de la API ---------- */

export interface Variant {
    name: string;
    value: string;
}

export interface VariantValue {
    id: string;
    variantId: string;
    variant: Variant;
}

export interface ProductImage {
    id: string;
    url: string;
    position: number;
}

export interface SKUImage {
    id: string;
    url: string;
    position: number;
}

export interface BundleComponent {
    skuId: string;
    quantity: number;
}

export interface SKU {
    id: string;
    productId: string;
    code: string;
    price: number;
    discountedPrice: number;
    stock: number;
    variantValues: VariantValue[];
    images: SKUImage[];
    components: BundleComponent[];
    partOf: unknown[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    type: ProductType;
    isPublished: boolean;
    skus: SKU[];
    images: ProductImage[];
}

/* ---------- 2. Payloads de creación ---------- */

export interface CreateSimpleProduct {
    name: string;
    description: string;
    price: number;
    discountedPrice?: number;
    stock: number;
    isPublished: boolean;
    images: string[];
}

export interface CreateVariant {
    variant: Variant[];
    stock: number;
    price?: number;
    discountedPrice?: number;
}

export interface CreateVariableProduct {
    name: string;
    description: string;
    price: number;
    stock: 0;
    isPublished: boolean;
    variants: CreateVariant[];
}

export interface CreateBundleComponent {
    skuId: string;
    quantity: number;
}

export interface CreateBundleProduct {
    name: string;
    description: string;
    price: number;
    isPublished: boolean;
    images: string[];
    components: CreateBundleComponent[];
}

export type CreateProductPayload =
    | CreateSimpleProduct
    | CreateVariableProduct
    | CreateBundleProduct;

/* ---------- 3. Estado del formulario ---------- */

/**
 * Todas las entidades editables llevan `id` propio generado en el cliente.
 * Sirve como `key` estable en React: con `key={index}` React reusa el DOM
 * equivocado al eliminar un item del medio y los valores tipeados se corren.
 */

export interface AttributeForm {
    id: string;
    name: string;
    value: string;
}

export interface VariantForm {
    id: string;
    attributes: AttributeForm[];
    price: string;
    discountedPrice: string;
    stock: string;
}

export interface BundleComponentForm {
    id: string;
    /** Se guarda explícitamente: no se puede derivar del `skuId` cuando todavía no hay SKU elegido. */
    productId: string;
    skuId: string;
    quantity: string;
}

export interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

export interface ProductFormState {
    type: ProductType;
    name: string;
    description: string;
    price: string;
    discountedPrice: string;
    stock: string;
    isPublished: boolean;
    imageFiles: ImageFile[];
    variants: VariantForm[];
    components: BundleComponentForm[];
}

/** Campos de texto de primer nivel, editables con un `<input name="...">`. */
export type ProductTextField =
    | "name"
    | "description"
    | "price"
    | "discountedPrice"
    | "stock";
