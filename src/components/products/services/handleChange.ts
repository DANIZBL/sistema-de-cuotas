import { ProductFormState } from "../types";

interface Props {
    setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
}

export function handleChange({ event, setForm }: Props) {
    const { name, value } = event.target;
    setForm((current) => ({
        ...current,
        [name]: value,
    }));
}