import {
    createEmptyAttribute,
    createEmptyComponent,
    createEmptyVariant,
    createImageFile,
} from "./factories";
import { getSkusForProduct } from "./selectors";
import type {
    AttributeForm,
    BundleComponentForm,
    Product,
    ProductFormState,
    ProductTextField,
    ProductType,
    VariantForm,
} from "./types";

/* =========================================================
   Transiciones puras del formulario: (estado, datos) => estado.
   Sin React, sin `setForm`, sin efectos. Se testean solas.
   ========================================================= */

export function setTextField(
    state: ProductFormState,
    field: ProductTextField,
    value: string
): ProductFormState {
    return { ...state, [field]: value };
}

export function setType(
    state: ProductFormState,
    type: ProductType
): ProductFormState {
    return { ...state, type };
}

export function setPublished(
    state: ProductFormState,
    isPublished: boolean
): ProductFormState {
    return { ...state, isPublished };
}

/* ---------- Imágenes ---------- */

export function addImages(
    state: ProductFormState,
    files: File[]
): ProductFormState {
    return {
        ...state,
        imageFiles: [...state.imageFiles, ...files.map(createImageFile)],
    };
}

export function removeImage(
    state: ProductFormState,
    imageId: string
): ProductFormState {
    return {
        ...state,
        imageFiles: state.imageFiles.filter((image) => image.id !== imageId),
    };
}

/* ---------- Variantes ---------- */

export function addVariant(state: ProductFormState): ProductFormState {
    return { ...state, variants: [...state.variants, createEmptyVariant()] };
}

export function removeVariant(
    state: ProductFormState,
    variantId: string
): ProductFormState {
    if (state.variants.length === 1) {
        return state;
    }

    return {
        ...state,
        variants: state.variants.filter((variant) => variant.id !== variantId),
    };
}

export function updateVariant(
    state: ProductFormState,
    variantId: string,
    field: "price" | "discountedPrice" | "stock",
    value: string
): ProductFormState {
    return mapVariant(state, variantId, (variant) => ({ ...variant, [field]: value }));
}

/* ---------- Características de una variante ---------- */

export function addAttribute(
    state: ProductFormState,
    variantId: string
): ProductFormState {
    return mapVariant(state, variantId, (variant) => ({
        ...variant,
        attributes: [...variant.attributes, createEmptyAttribute()],
    }));
}

export function removeAttribute(
    state: ProductFormState,
    variantId: string,
    attributeId: string
): ProductFormState {
    return mapVariant(state, variantId, (variant) => {
        if (variant.attributes.length === 1) {
            return variant;
        }

        return {
            ...variant,
            attributes: variant.attributes.filter(
                (attribute) => attribute.id !== attributeId
            ),
        };
    });
}

export function updateAttribute(
    state: ProductFormState,
    variantId: string,
    attributeId: string,
    field: keyof Omit<AttributeForm, "id">,
    value: string
): ProductFormState {
    return mapVariant(state, variantId, (variant) => ({
        ...variant,
        attributes: variant.attributes.map((attribute) =>
            attribute.id === attributeId ? { ...attribute, [field]: value } : attribute
        ),
    }));
}

/* ---------- Componentes de un combo ---------- */

export function addComponent(state: ProductFormState): ProductFormState {
    return { ...state, components: [...state.components, createEmptyComponent()] };
}

export function removeComponent(
    state: ProductFormState,
    componentId: string
): ProductFormState {
    if (state.components.length === 1) {
        return state;
    }

    return {
        ...state,
        components: state.components.filter(
            (component) => component.id !== componentId
        ),
    };
}

export function updateComponent(
    state: ProductFormState,
    componentId: string,
    field: keyof Omit<BundleComponentForm, "id" | "productId">,
    value: string
): ProductFormState {
    return mapComponent(state, componentId, (component) => ({
        ...component,
        [field]: value,
    }));
}

/**
 * Al cambiar el producto se resetea el SKU, salvo que el producto tenga uno solo
 * (en ese caso no hay nada que elegir). Si el producto no tiene SKUs, queda
 * seleccionado igual y la validación avisa — antes el formulario se reseteaba
 * solo sin explicar nada.
 */
export function selectComponentProduct(
    state: ProductFormState,
    componentId: string,
    productId: string,
    products: Product[]
): ProductFormState {
    const skus = getSkusForProduct(productId, products);

    return mapComponent(state, componentId, (component) => ({
        ...component,
        productId,
        skuId: skus.length === 1 ? skus[0].id : "",
    }));
}

/* ---------- Helpers internos ---------- */

function mapVariant(
    state: ProductFormState,
    variantId: string,
    update: (variant: VariantForm) => VariantForm
): ProductFormState {
    return {
        ...state,
        variants: state.variants.map((variant) =>
            variant.id === variantId ? update(variant) : variant
        ),
    };
}

function mapComponent(
    state: ProductFormState,
    componentId: string,
    update: (component: BundleComponentForm) => BundleComponentForm
): ProductFormState {
    return {
        ...state,
        components: state.components.map((component) =>
            component.id === componentId ? update(component) : component
        ),
    };
}
