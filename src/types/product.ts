export type ProductType = "simple" | "variable" | "bundle";

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

export interface Component {
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
  components: Component[];
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
