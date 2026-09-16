import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import type { Product } from "../model/types";

export function useProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadToken, setReloadToken] = useState(0);

    const reload = useCallback(() => {
        setLoading(true);
        setError("");
        setReloadToken((token) => token + 1);
    }, []);

    useEffect(() => {
        let active = true;

        void (async () => {
            try {
                const data = await getProducts();

                if (active) {
                    setProducts(data);
                }
            } catch (cause) {
                console.error("Error al cargar productos:", cause);

                if (active) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : "No se pudieron cargar los productos."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [reloadToken]);

    return { products, loading, error, reload };
}
