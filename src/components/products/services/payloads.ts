import { ProductFormState } from "../types";
import { CreateBundleComponent, CreateBundleProduct, CreateSimpleProduct, CreateVariableProduct } from "../types";

export function buildSimplePayload(imageUrls: string[], form: ProductFormState): CreateSimpleProduct {
    const productData: CreateSimpleProduct = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        isPublished: form.isPublished,
        categoryIds: form.categories.map(cat => cat.id),
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
        categoryIds: form.categories.map(cat => cat.id),
        variants: form.variants.map((variant) => {
            const payloadVariant = {
                variant: variant.attributes.map((attribute) => ({
                    name: attribute.name.trim(),
                    value: attribute.value.trim(),
                })),
                stock: Number(variant.stock),
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
        categoryIds: form.categories.map(cat => cat.id),
        images: imageUrls,
        components,
    };
}