import { ProductFormState } from "../types";
import { CreateBundleComponent, CreateBundleProduct, CreateSimpleProduct, CreateVariableProduct } from "../types";

// "" (sin dato) -> null
function toBattery(battery: string): number | null {
    return battery === "" ? null : Number(battery);
}

export function buildSimplePayload(imageUrls: string[], form: ProductFormState): CreateSimpleProduct {
    const productData: CreateSimpleProduct = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        battery: toBattery(form.battery),
        condition: form.condition || null,
        isPublished: form.isPublished,
        categoryIds: form.categories.map(cat => cat.id).filter(Boolean),
        images: imageUrls,
    };

    if (form.discountedPrice !== "") {
        productData.discountedPrice = Number(form.discountedPrice);
    }

    return productData;
}
export function buildVariablePayload(form: ProductFormState): CreateVariableProduct {
    return {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.variants[0].price) || 0,
        stock: 0,
        isPublished: form.isPublished,
        categoryIds: form.categories.map(cat => cat.id).filter(Boolean),
        variants: form.variants.map((variant) => {
            const payloadVariant = {
                variant: variant.attributes.map((attribute) => ({
                    name: attribute.name.trim(),
                    value: attribute.value.trim(),
                })),
                stock: Number(variant.stock),
                battery: toBattery(variant.battery),
                condition: variant.condition || null,
            };

            if (variant.price !== "") {
                return {
                    ...payloadVariant,
                    price: Number(variant.price),
                    ...(variant.discountedPrice !== ""
                        ? {
                            discountedPrice: Number(variant.discountedPrice),
                        }
                        : {}),
                };
            }

            return payloadVariant;
        }),
    };
}

export function buildBundlePayload(imageUrls: string[], form: ProductFormState): CreateBundleProduct {
    const components: CreateBundleComponent[] = form.components.map(
        (component) => ({
            skuId: component.skuId,
            quantity: Number(component.quantity),
        })
    );

    return {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        isPublished: form.isPublished,
        categoryIds: form.categories.map(cat => cat.id).filter(Boolean),
        images: imageUrls,
        components,
    };
}