import { hasVariants, ProductToOrder } from "./useCreateOrder"
import style from "./CreateOrderForm.module.css"
import { formatPrice } from "../../lib/format"


interface Props {
    productsToOrder: ProductToOrder[],
    selectVariant: (randomId: string, skuId: string) => void,
    updateQuantity: (randomId: string, value: string) => void,
    deleteProduct: (randomId: string) => void,
    setProductsModal: (value: boolean) => void
}

export default function ProductsSection({
    productsToOrder,
    selectVariant,
    updateQuantity,
    deleteProduct,
    setProductsModal
}: Props) {
    return (
        <section className={style.section}>
            <div className={style.sectionTitle}>
                <div>
                    <h3>Productos</h3>
                    <p>Elegí los productos y, si tienen variantes, cuál se lleva el cliente.</p>
                </div>

                <button
                    type="button"
                    className={style.addButton}
                    onClick={() => setProductsModal(true)}
                >
                    + Agregar producto
                </button>
            </div>

            {productsToOrder.length === 0 ? (
                <div className={style.empty}>Todavía no agregaste productos.</div>
            ) : (
                <div className={style.productList}>
                    {productsToOrder.map((product) => {
                        const selected = product.variants.find((variant) => variant.sku_id === product.sku_id)

                        return (
                            <div className={style.productItem} key={product.randomId}>
                                <div className={style.productHeader}>
                                    <div>
                                        <strong>{product.name}</strong>
                                        {selected && (
                                            <small>
                                                SKU {selected.code} · Stock: {selected.stock}
                                            </small>
                                        )}
                                    </div>
                                    <button
                                        className={style.deleteButton}
                                        type="button"
                                        onClick={() => deleteProduct(product.randomId)}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                                <div className={style.productGrid}>
                                    <div className={style.formGroup}>
                                        <label htmlFor={`variant-${product.randomId}`}>Variante</label>

                                        {hasVariants(product) ? (
                                            <select
                                                id={`variant-${product.randomId}`}
                                                value={product.sku_id}
                                                onChange={(event) => selectVariant(product.randomId, event.currentTarget.value)}
                                            >
                                                {product.variants.map((variant) => (
                                                    <option
                                                        key={variant.sku_id}
                                                        value={variant.sku_id}
                                                        disabled={variant.stock <= 0}
                                                    >
                                                        {variant.label || variant.code}
                                                        {variant.stock <= 0 ? " (sin stock)" : ""}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className={style.readonlyField}>Sin variantes</div>
                                        )}
                                    </div>

                                    <div className={style.formGroup}>
                                        <label htmlFor={`quantity-${product.randomId}`}>Cantidad</label>
                                        <input
                                            id={`quantity-${product.randomId}`}
                                            type="number"
                                            min="1"
                                            max={selected?.stock}
                                            step="1"
                                            value={product.quantity}
                                            onChange={(event) => updateQuantity(product.randomId, event.currentTarget.value)}
                                        />
                                    </div>

                                    <div className={style.formGroup}>
                                        <label>Precio unitario</label>
                                        <div className={style.readonlyField}>{formatPrice(product.price)}</div>
                                    </div>

                                    <div className={style.formGroup}>
                                        <label>Subtotal</label>
                                        <div className={`${style.readonlyField} ${style.subtotalField}`}>
                                            {formatPrice(product.price * Number(product.quantity || 0))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}