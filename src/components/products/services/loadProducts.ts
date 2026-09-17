import { Product } from "../types";
import { getProducts } from "./productService";


interface Props {
    setLoadingProducts: React.Dispatch<React.SetStateAction<boolean>>
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}
export async function loadProducts({ setLoadingProducts, setProducts }: Props) {
    try {
        setLoadingProducts(true);

        const data = await getProducts();

        setProducts(data);
    } catch (error) {
    } finally {
        setLoadingProducts(false);
    }
}