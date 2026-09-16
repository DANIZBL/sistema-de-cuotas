import { Product, SKU } from "../types";

export function getProductForSku(skuId: string, products: Product[]): Product | undefined {
    return products.find((product) =>
        product.skus.some((sku) => sku.id === skuId)
    );
}

export function getSkusForProduct(productId: string, products: Product[]): SKU[] {
    return products.find((product) => product.id === productId)?.skus || [];
}

export function getComponentProductId(skuId: string, products: Product[]): string {
    return getProductForSku(skuId, products)?.id || "";
}

export function getSkuLabel(sku: SKU): string {
    if (!sku.variantValues || sku.variantValues.length === 0) {
        return sku.code;
    }

    const variants = sku.variantValues
        .map(
            (variantValue) =>
                `${variantValue.variant.name}: ${variantValue.variant.value}`
        )
        .join(" / ");

    return `${sku.code} — ${variants}`;
}