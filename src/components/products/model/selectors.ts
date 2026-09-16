import type { Product, SKU } from "./types";

export function getSkusForProduct(productId: string, products: Product[]): SKU[] {
    if (!productId) {
        return [];
    }

    return products.find((product) => product.id === productId)?.skus ?? [];
}

export function getSkuLabel(sku: SKU): string {
    if (!sku.variantValues?.length) {
        return sku.code;
    }

    const variants = sku.variantValues
        .map(({ variant }) => `${variant.name}: ${variant.value}`)
        .join(" / ");

    return `${sku.code} — ${variants}`;
}
