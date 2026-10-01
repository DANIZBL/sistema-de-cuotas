import { ProductFormState } from "../types";

export function validateSimple(form: ProductFormState): string {
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

    return "";
}

export function validateVariable(form: ProductFormState): string {
    if (!form.name.trim()) {
        return "El nombre del producto es obligatorio.";
    }

    if (!form.variants.length) {
        return "El producto debe tener al menos una variante.";
    }

    for (
        let variantIndex = 0;
        variantIndex < form.variants.length;
        variantIndex++
    ) {
        const variant = form.variants[variantIndex];

        if (!variant.attributes.length) {
            return `La variante ${variantIndex + 1
                } necesita al menos una característica.`;
        }

        for (
            let attributeIndex = 0;
            attributeIndex < variant.attributes.length;
            attributeIndex++
        ) {
            const attribute = variant.attributes[attributeIndex];

            if (!attribute.name.trim()) {
                return `Completá el nombre de la característica de la variante ${variantIndex + 1
                    }.`;
            }

            if (!attribute.value.trim()) {
                return `Completá el valor de la característica de la variante ${variantIndex + 1
                    }.`;
            }
        }

        if (variant.price === "") {
            return `El precio de la variante ${variantIndex + 1} es obligatorio.`;
        }

        if (variant.stock === "") {
            return `El stock de la variante ${variantIndex + 1} es obligatorio.`;
        }

        if (Number(variant.price) < 0) {
            return `El precio de la variante ${variantIndex + 1
                } no puede ser negativo.`;
        }

        if (Number(variant.stock) < 0) {
            return `El stock de la variante ${variantIndex + 1
                } no puede ser negativo.`;
        }

        if (
            variant.discountedPrice !== "" &&
            Number(variant.discountedPrice) < 0
        ) {
            return `El precio promocional de la variante ${variantIndex + 1
                } no puede ser negativo.`;
        }
    }

    return "";
}

export function validateBundle(form: ProductFormState): string {
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

    for (let index = 0; index < form.components.length; index++) {
        const component = form.components[index];

        if (!component.skuId) {
            return `Seleccioná un SKU para el componente ${index + 1}.`;
        }

        if (component.quantity === "" || Number(component.quantity) <= 0) {
            return `La cantidad del componente ${index + 1} debe ser mayor a 0.`;
        }
    }

    return "";
}