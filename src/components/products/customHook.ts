import { useEffect, useState } from "react";
import { Product } from "./types";
import { createEmptyComponent, createEmptyVariant } from "./const";
import { ProductFormState } from "./types";
import { loadProducts } from "./services/loadProducts";


export default function useProducts() {
    const [form, setForm] = useState<ProductFormState>({
        type: "simple",
        name: "",
        description: "",
        price: "",
        discountedPrice: "",
        stock: "",
        isPublished: true,
        imageFiles: [],
        variants: [createEmptyVariant()],
        components: [createEmptyComponent()],
    });

    const [products, setProducts] = useState<Product[]>([]);

    const [loadingProducts, setLoadingProducts] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProducts({ setLoadingProducts, setProducts });
    }, []);

    return {
        form, setForm,
        products, setProducts,
        loadingProducts, setLoadingProducts,
        loading, setLoading,
        error, setError
    }
}