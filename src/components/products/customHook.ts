import { useEffect, useState } from "react";
import { BundleComponentForm, Product, ProductFormType, VariableForm } from "./types";
import { createEmptyComponent, createEmptyVariant } from "./const";
import { ProductFormState } from "./types";
import { loadProducts } from "./services/loadProducts";
import { Category } from "../categories/api/types";
import { getCategories } from "../categories/api/api.services";
import getOneProduct from "./services/getOneProducts";


export default function useProducts(editId?: string) {
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
        categories: [{ id: "" }]
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

            if (editId) {
                const product = await getOneProduct(editId)
                if (product) {
                    const variants: VariableForm[] = []
                    const components: BundleComponentForm[] = []
                    if (product.skus.length) {
                        for (const sku of product.skus) {
                            if (sku.variantValues.length)
                                variants.push({
                                    attributes: sku.variantValues?.map(variant => ({
                                        name: variant.variant.name,
                                        value: variant.variant.value
                                    })),
                                    price: String(sku.price),
                                    discountedPrice: String(sku.discountedPrice),
                                    stock: String(sku.stock)
                                })
                            for (const { componentSku } of sku.components) {
                                components.push({ skuId: componentSku.id, quantity: String(sku.stock) })
                            }
                        }
                    }
                    setForm({
                        categories: product.categories,
                        isPublished: product.isPublished,
                        name: product.name,
                        type: product.type as ProductFormType,
                        imageFiles: product.images.map(i => ({ preview: i.url })),
                        stock: String(product.skus[0].stock),
                        price: String(product.skus[0].price),
                        discountedPrice: String(product.skus[0].discountedPrice),
                        description: product.description,
                        variants,
                        components
                    })
                }
            }
        })()
    }, []);

    return {
        form, setForm,
        products, setProducts,
        loadingProducts, setLoadingProducts,
        loading, setLoading,
        error, setError,
        categories
    }
}