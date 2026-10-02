import style from "./CreateOrderForm.module.css"
import { Currency } from "../../types/order"

interface Props {
    currency: Currency,
    setCurrency: React.Dispatch<React.SetStateAction<Currency>>,
    installmentsCount: number | "",
    setInstallmentsCount: React.Dispatch<React.SetStateAction<number | "">>
}

export default function PaymentSection({
    currency,
    setCurrency,
    installmentsCount,
    setInstallmentsCount
}: Props) {
    return (
        <section className={style.section}>
            <div className={style.sectionTitle}>
                <div>
                    <h3>Pago</h3>
                    <p>Moneda y cantidad de cuotas en las que se divide el total.</p>
                </div>
            </div>

            <div className={style.formGrid}>
                <div className={style.formGroup}>
                    <label htmlFor="order-currency">Moneda</label>
                    <select
                        id="order-currency"
                        value={currency}
                        onChange={(e) => { setCurrency(e.currentTarget.value as Currency) }}
                    >
                        <option value={Currency.ARS}>Pesos</option>
                        <option value={Currency.US}>Dólares</option>
                    </select>
                </div>

                <div className={style.formGroup}>
                    <label htmlFor="order-installments">Cuotas</label>
                    <input
                        id="order-installments"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Ej: 6"
                        value={installmentsCount}
                        onChange={(e) => {
                            const value = e.currentTarget.value
                            setInstallmentsCount(value === "" ? "" : Math.max(0, Math.floor(Number(value))))
                        }}
                    />
                    <small>
                        {installmentsCount === 0
                            ? "Pago en el momento, sin cuotas."
                            : "Poné 0 si se paga en el momento."}
                    </small>
                </div>
            </div>
        </section>
    )
}
