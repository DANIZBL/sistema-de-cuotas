import { useContext, useMemo, useState } from "react";
import { ProductsContext } from "../../lib/contexts";
import { ProductCondition } from "../products/types";
import type { Product, SKU } from "../products/types";
import { Currency } from "../../types/order";

export interface ProductVariantOption {
    sku_id: string,
    label: string,
    code: string,
    price: number,
    stock: number,
    condition: ProductCondition | null,
    // Ya resuelta: un nuevo sin batería cargada se toma como 100%
    battery: number | null
}

export interface ProductToOrder {
    randomId: string,
    productId: string,
    sku_id: string,
    name: string,
    variants: ProductVariantOption[]
    // "" mientras el usuario borra el campo para escribir otro número
    quantity: number | "",
    price: number
}

// Un producto con un solo SKU sin valores de variante es un producto simple
export function hasVariants(product: ProductToOrder) {
    return product.variants.length > 1 || product.variants[0]?.label !== ""
}

// Si es nuevo y no tiene batería cargada, se da por sentado que está al 100%
export function getSkuState(sku: Pick<SKU, "condition" | "battery">) {
    const condition = sku.condition ?? null
    const battery = sku.battery ?? (condition === ProductCondition.NUEVO ? 100 : null)
    return { condition, battery }
}

// "Usado · 87%", "Nuevo · 100%", "" si no tiene datos
export function getSkuStateLabel(state: { condition: ProductCondition | null, battery: number | null }) {
    return [
        state.condition === ProductCondition.NUEVO ? "Nuevo" : state.condition === ProductCondition.USADO ? "Usado" : "",
        state.battery != null ? `${state.battery}%` : ""
    ].filter(Boolean).join(" · ")
}

function toProductToOrder(product: Product): ProductToOrder {
    const variants = product.skus.map((sku) => ({
        sku_id: sku.id,
        // Un SKU puede tener varios valores (ej: "Rojo / M"), es una sola opción
        label: sku.variantValues
            .map((variantValue) => variantValue.variant?.value)
            .filter(Boolean)
            .join(" / "),
        code: sku.code,
        price: sku.price,
        stock: sku.stock,
        ...getSkuState(sku)
    }))

    const firstAvailable = variants.find((variant) => variant.stock > 0) ?? variants[0]

    return {
        randomId: crypto.randomUUID(),
        productId: product.id,
        sku_id: firstAvailable.sku_id,
        name: product.name,
        variants,
        quantity: 1,
        price: firstAvailable.price
    }
}

export default function useCreateOrder() {
    const { products } = useContext(ProductsContext)!
    const [productsToOrder, setProductsToOrder] = useState<ProductToOrder[]>([]);

    const [productsModal, setProductsModal] = useState(false)

    const [clientInfo, setClientInfo] = useState({
        name: "",
        apellido: "",
        mail: "",
        phone: ""
    })

    const [currency, setCurrency] = useState(Currency.ARS)

    // "" mientras el usuario borra el campo para escribir otro número
    const [installmentsCount, setInstallmentsCount] = useState<number | "">(1)

    function addProduct(product: Product) {
        if (product.skus.length === 0) return
        setProductsToOrder((prev) => [...prev, toProductToOrder(product)])
        setProductsModal(false)
    }

    function deleteProduct(randomId: string) {
        setProductsToOrder((prev) => prev.filter((product) => product.randomId !== randomId))
        setProductsModal(false)
    }

    function selectVariant(randomId: string, skuId: string) {
        setProductsToOrder((prev) => prev.map((product) => {
            if (product.randomId !== randomId) return product

            const variant = product.variants.find((variant) => variant.sku_id === skuId)

            if (!variant) return product

            // Si la nueva variante tiene menos stock, se ajusta la cantidad
            const quantity = product.quantity === ""
                ? product.quantity
                : Math.min(product.quantity, Math.max(variant.stock, 1))

            return { ...product, sku_id: skuId, price: variant.price, quantity }
        }))
    }

    function updateQuantity(randomId: string, value: string) {
        setProductsToOrder((prev) => prev.map((product) => {
            if (product.randomId !== randomId) return product
            if (value === "") return { ...product, quantity: "" }

            const stock = product.variants.find((variant) => variant.sku_id === product.sku_id)?.stock ?? 1
            const quantity = Math.min(Math.max(1, Math.floor(Number(value))), Math.max(stock, 1))

            return { ...product, quantity }
        }))
    }

    const total = useMemo(
        () => productsToOrder.reduce((sum, product) => sum + product.price * Number(product.quantity || 0), 0),
        [productsToOrder]
    )

    const installmentAmount = installmentsCount ? total / installmentsCount : 0

    return {
        products,
        productsToOrder, setProductsToOrder,
        productsModal, setProductsModal,
        addProduct,
        selectVariant,
        updateQuantity,
        deleteProduct,
        clientInfo, setClientInfo,
        currency, setCurrency,
        installmentsCount, setInstallmentsCount,
        total,
        installmentAmount
    }
}
