import { createEmptyComponent } from "../const";
import { BundleComponentForm, ProductFormState } from "../types";

interface Props {
    componentIndex: number,
    field: keyof BundleComponentForm,
    value: string
    setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
}
export function updateComponent({ componentIndex, field, setForm, value }: Props) {
    setForm((current) => {
        const components = [...current.components];

        components[componentIndex] = {
            ...components[componentIndex],
            [field]: value,
        };

        return {
            ...current,
            components,
        };
    });
}

export function addComponent({ setForm }: Pick<Props, "setForm">) {
    setForm((current) => ({
        ...current,
        components: [...current.components, createEmptyComponent()],
    }));
}

export function removeComponent({ setForm, componentIndex }: Pick<Props, "setForm" | "componentIndex">) {
    setForm((current) => {
        if (current.components.length === 1) {
            return current;
        }

        return {
            ...current,
            components: current.components.filter(
                (_, index) => index !== componentIndex
            ),
        };
    });
}