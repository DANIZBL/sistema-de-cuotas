import type { ProductFormState } from "./types";

/** Devuelve el primer error encontrado, o `null` si el formulario es válido. */
export function validateProductForm(form: ProductFormState): string | null {
    switch (form.type) {
        case "simple":
            return validateSimple(form);
        case "variable":
            return validateVariable(form);
        case "bundle":
            return validateBundle(form);
    }
}

function validateSimple(form: ProductFormState): string | null {
    if (!form.name.trim()) {
        return "El nombre del producto es obligatorio.";
    }

    if (form.price === "") {
        return "El precio es obligatorio.";
    }

    if (form.stock === "") {
        return "El stock es obligatorio.";
    }

    if (Number(form.price) < 0) {
        return "El precio no puede ser negativo.";
    }

    if (Number(form.stock) < 0) {
        return "El stock no puede ser negativo.";
    }

    if (form.discountedPrice !== "" && Number(form.discountedPrice) < 0) {
        return "El precio promocional no puede ser negativo.";
    }

    return null;
}

function validateVariable(form: ProductFormState): string | null {
    if (!form.name.trim()) {
        return "El nombre del producto es obligatorio.";
    }

    if (!form.variants.length) {
        return "El producto debe tener al menos una variante.";
    }

    for (const [index, variant] of form.variants.entries()) {
        const position = index + 1;

        if (!variant.attributes.length) {
            return `La variante ${position} necesita al menos una característica.`;
        }

        for (const attribute of variant.attributes) {
            if (!attribute.name.trim()) {
                return `Completá el nombre de la característica de la variante ${position}.`;
            }

            if (!attribute.value.trim()) {
                return `Completá el valor de la característica de la variante ${position}.`;
            }
        }

        if (variant.price === "") {
            return `El precio de la variante ${position} es obligatorio.`;
        }

        if (variant.stock === "") {
            return `El stock de la variante ${position} es obligatorio.`;
        }

        if (Number(variant.price) < 0) {
            return `El precio de la variante ${position} no puede ser negativo.`;
        }

        if (Number(variant.stock) < 0) {
            return `El stock de la variante ${position} no puede ser negativo.`;
        }

        if (variant.discountedPrice !== "" && Number(variant.discountedPrice) < 0) {
            return `El precio promocional de la variante ${position} no puede ser negativo.`;
        }
    }

    return null;
}

function validateBundle(form: ProductFormState): string | null {
    if (!form.name.trim()) {
        return "El nombre del combo es obligatorio.";
    }

    if (form.price === "") {
        return "El precio del combo es obligatorio.";
    }

    if (Number(form.price) < 0) {
        return "El precio no puede ser negativo.";
    }

    if (!form.components.length) {
        return "El combo debe tener al menos un componente.";
    }

    for (const [index, component] of form.components.entries()) {
        const position = index + 1;

        if (!component.productId) {
            return `Seleccioná un producto para el componente ${position}.`;
        }

        if (!component.skuId) {
            return `Seleccioná un SKU para el componente ${position}.`;
        }

        if (component.quantity === "" || Number(component.quantity) <= 0) {
            return `La cantidad del componente ${position} debe ser mayor a 0.`;
        }
    }

    return null;
}
