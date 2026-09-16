import { Product } from "../types";
import { ProductFormState } from "../types";
import { getSkusForProduct } from "./getProducts";

interface Props {
    componentIndex: number,
    productId: string
    setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
    products: Product[]
}

export function handleComponentProductChange({ componentIndex, productId, setForm, products }: Props) {
    const skus = getSkusForProduct(productId, products);

    setForm((current) => {
        const components = [...current.components];

        components[componentIndex] = {
            ...components[componentIndex],
            skuId: skus[0]?.id || "",
        };

        return {
            ...current,
            components,
        };
    });
}