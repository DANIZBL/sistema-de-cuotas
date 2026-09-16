import type {
    CreateBundleComponent,
    CreateBundleProduct,
    CreateProductPayload,
    CreateSimpleProduct,
    CreateVariableProduct,
    ProductFormState,
} from "./types";

/** Los productos variables no llevan imágenes propias: las imágenes viven en cada SKU. */
export function formNeedsImageUpload(form: ProductFormState): boolean {
    return form.type !== "variable";
}

export function buildProductPayload(
    form: ProductFormState,
    imageUrls: string[]
): CreateProductPayload {
    switch (form.type) {
        case "simple":
            return buildSimplePayload(form, imageUrls);
        case "variable":
            return buildVariablePayload(form);
        case "bundle":
            return buildBundlePayload(form, imageUrls);
    }
}

function buildSimplePayload(
    form: ProductFormState,
    imageUrls: string[]
): CreateSimpleProduct {
    const payload: CreateSimpleProduct = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        isPublished: form.isPublished,
        images: imageUrls,
    };

    if (form.discountedPrice !== "") {
        payload.discountedPrice = Number(form.discountedPrice);
    }

    return payload;
}

function buildVariablePayload(form: ProductFormState): CreateVariableProduct {
    return {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.variants[0]?.price) || 0,
        stock: 0,
        isPublished: form.isPublished,
        variants: form.variants.map((variant) => ({
            variant: variant.attributes.map((attribute) => ({
                name: attribute.name.trim(),
                value: attribute.value.trim(),
            })),
            stock: Number(variant.stock),
            ...(variant.price !== "" ? { price: Number(variant.price) } : {}),
            ...(variant.price !== "" && variant.discountedPrice !== ""
                ? { discountedPrice: Number(variant.discountedPrice) }
                : {}),
        })),
    };
}

function buildBundlePayload(
    form: ProductFormState,
    imageUrls: string[]
): CreateBundleProduct {
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
        images: imageUrls,
        components,
    };
}
