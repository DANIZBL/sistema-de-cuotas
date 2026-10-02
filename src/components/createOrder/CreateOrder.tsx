import { useLayoutEffect, useMemo, useRef, useState } from "react"
import useCreateOrder, { getSkuState } from "./useCreateOrder"
import SkuStateBadges from "./SkuStateBadges"
import style from "./CreateOrderForm.module.css"
import Modal from "../ui/Modal"
import { formatPrice } from "../../lib/format"
import ProductsSection from "./ProductsSection"
import ClientSection from "./ClientSection"
import OrderSummary from "./OrderSummary"
import PaymentSection from "./PaymentSection"
import api from "../../lib/axios.config"
import { isAxiosError } from "axios"

interface Props {
    // Se llama cuando la orden se registró bien (cerrar modal, recargar tabla, etc.)
    onCreated: () => void | Promise<void>
}

export default function CreateOrder({ onCreated }: Props) {

    const {
        products,
        productsToOrder,
        productsModal, setProductsModal,
        addProduct,
        deleteProduct,
        selectVariant,
        updateQuantity,
        clientInfo, setClientInfo,
        currency, setCurrency,
        installmentsCount, setInstallmentsCount,
        total,
        installmentAmount
    } = useCreateOrder()

    const formRef = useRef<HTMLFormElement>(null)
    const [search, setSearch] = useState("")
    const [pickerHeight, setPickerHeight] = useState<number>()

    // El modal de productos toma el mismo alto que el modal de "Crear orden"
    useLayoutEffect(() => {
        if (!productsModal) {
            setSearch("")
            return
        }

        const parentModal = formRef.current?.closest(".modal")
        setPickerHeight(parentModal?.getBoundingClientRect().height)
    }, [productsModal])

    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (submitting) return

        if (productsToOrder.length === 0) {
            setSubmitError("Agregá al menos un producto.")
            return
        }
        if (productsToOrder.some((product) => product.quantity === "")) {
            setSubmitError("Completá la cantidad de todos los productos.")
            return
        }
        if (installmentsCount === "") {
            setSubmitError("Ingresá la cantidad de cuotas (0 si se paga en el momento).")
            return
        }

        try {
            setSubmitting(true)
            setSubmitError("")
            await api.post("/orders", {
                client_name: clientInfo.name,
                client_surname: clientInfo.apellido,
                mail: clientInfo.mail,
                phone: clientInfo.phone,
                currency: currency,
                delivered_method: "local",
                order_items: productsToOrder.map(p => ({ sku_id: p.sku_id, quantity: Number(p.quantity) })),
                installments: Number(installmentsCount)
            })
            await onCreated()
        } catch (error) {
            console.error("Error al registrar la orden:", error)
            setSubmitError(
                isAxiosError(error) && error.response?.data?.message
                    ? String(error.response.data.message)
                    : "No se pudo registrar la orden. Intentá de nuevo."
            )
            setSubmitting(false)
        }
    }

    const filteredProducts = useMemo(() => {
        const term = normalize(search.trim())
        if (!term) return products
        return products.filter((product) => normalize(product.name).includes(term))
    }, [products, search])

    return (
        <>
            <form ref={formRef} className={style.form} onSubmit={handleSubmit}>
                <ProductsSection
                    deleteProduct={deleteProduct}
                    productsToOrder={productsToOrder}
                    selectVariant={selectVariant}
                    updateQuantity={updateQuantity}
                    setProductsModal={setProductsModal}
                />
                <ClientSection
                    setClientInfo={setClientInfo}
                />
                <PaymentSection
                    currency={currency}
                    setCurrency={setCurrency}
                    installmentsCount={installmentsCount}
                    setInstallmentsCount={setInstallmentsCount}
                />

                <div className={style.notice}>
                    <span aria-hidden="true">ℹ</span>
                    Todos los pedidos se retiran en el local.
                </div>

                <OrderSummary
                    total={total}
                    currency={currency}
                    installmentsCount={installmentsCount}
                    installmentAmount={installmentAmount}
                    hasProducts={productsToOrder.length > 0}
                />

                {submitError && (
                    <div className={style.formError}>{submitError}</div>
                )}

                <div className={style.formActions}>
                    <button
                        type="submit"
                        className={style.submitButton}
                        disabled={submitting || productsToOrder.length === 0}
                    >
                        {submitting && <span className={style.spinner} aria-hidden="true" />}
                        {submitting ? "Registrando orden..." : "Registrar orden"}
                    </button>
                </div>
            </form>

            {productsModal &&
                <Modal
                    onClose={() => setProductsModal(false)}
                    title={"Agregar producto"}
                    className={style.productsModal}
                    style={pickerHeight ? { height: pickerHeight } : undefined}
                >
                    <div className={style.picker}>
                        <input
                            type="search"
                            className={style.pickerSearch}
                            placeholder="Buscar producto por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            autoFocus
                        />

                        {filteredProducts.length === 0 ? (
                            <div className={style.empty}>
                                {products.length === 0
                                    ? "No hay productos cargados."
                                    : `No se encontraron productos para "${search}".`}
                            </div>
                        ) : (
                            <ul className={style.pickerList}>
                                {filteredProducts.map((product) => {
                                    const variantsCount = product.skus.filter((sku) => sku.variantValues.length > 0).length
                                    const simpleState = product.skus.length === 1 ? getSkuState(product.skus[0]) : null

                                    return (
                                        <li key={product.id} className={style.pickerItem}>
                                            <div>
                                                <strong>{product.name}</strong>
                                                <small>
                                                    {variantsCount > 0
                                                        ? `${variantsCount} ${variantsCount === 1 ? "variante" : "variantes"}`
                                                        : `${formatPrice(product.skus[0]?.price)}`}
                                                </small>
                                                {simpleState && (
                                                    <SkuStateBadges condition={simpleState.condition} battery={simpleState.battery} />
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className={style.addButton}
                                                disabled={product.skus.length === 0}
                                                onClick={() => addProduct(product)}
                                            >
                                                Agregar
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </Modal>
            }
        </>
    )
}

// Ignora mayúsculas y tildes: "cafe" encuentra "Café"
function normalize(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}
