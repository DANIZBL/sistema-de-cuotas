import { useEffect, useState } from "react";
import { Product } from "./types";
import { createEmptyComponent, createEmptyVariant } from "./const";
import { ProductFormState } from "./types";
import { loadProducts } from "./services/loadProducts";
import { Category } from "../categories/api/types";
import { getCategories } from "../categories/api/api.services";


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
        categories: [{ id: crypto.randomUUID() }]
    });

    const [products, setProducts] = useState<Product[]>([]);

    const [loadingProducts, setLoadingProducts] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        (async () => {
            loadProducts({ setLoadingProducts, setProducts });
            const categories = await getCategories()
            setCategories(categories)
        })()
    }, []);

    useEffect(() => console.log(form), [form])

    return {
        form, setForm,
        products, setProducts,
        loadingProducts, setLoadingProducts,
        loading, setLoading,
        error, setError,
        categories
    }
}