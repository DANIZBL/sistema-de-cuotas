import { ProductFormState, ProductFormType } from "../types";

interface Props {
    event: React.ChangeEvent<HTMLSelectElement>,
    setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
    setError: React.Dispatch<React.SetStateAction<string>>
}

export function handleTypeChange({ event, setError, setForm }: Props) {
    const type = event.target.value as ProductFormType;

    setForm((current) => ({
        ...current,
        type,
    }));

    setError("");
}