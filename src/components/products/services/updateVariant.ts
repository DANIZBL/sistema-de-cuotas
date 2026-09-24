import { createEmptyVariant } from "../const";
import { ProductFormState, VariableForm } from "../types";

interface Props {
    setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
    variantIndex: number,
    field: keyof VariableForm,
    value: string,
    index: number,
}

export function updateVariant({ field, setForm, value, variantIndex }: Omit<Props, "index">) {
    setForm((current) => {
        const variants = [...current.variants];

        variants[variantIndex] = {
            ...variants[variantIndex],
            [field]: value,
        };

        return {
            ...current,
            variants,
        };
    });
}

export function addVariant({ setForm }: Pick<Props, "setForm">) {
    setForm((current) => ({
        ...current,
        variants: [...current.variants, createEmptyVariant()],
    }));
}

export function removeVariant({ setForm, index }: Pick<Props, "setForm" | "index">) {
    setForm((current) => {
        if (current.variants.length === 1) {
            return current;
        }

        return {
            ...current,
            variants: current.variants.filter(
                (_, variantIndex) => variantIndex !== index
            ),
        };
    });
}