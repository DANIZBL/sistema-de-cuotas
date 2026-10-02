import style from "./CreateOrderForm.module.css"
import { formatPrice } from "../../lib/format"
import { Currency } from "../../types/order"

interface Props {
    total: number,
    currency: Currency,
    installmentsCount: number | "",
    installmentAmount: number,
    hasProducts: boolean
}

// Redondea a 2 decimales para mostrar (ej: 1000 / 3 = 333,33)
function formatMoney(value: number, currency: Currency) {
    const symbol = currency === Currency.US ? "US$" : "$"
    return `${symbol} ${formatPrice(Math.round(value * 100) / 100)}`
}

export default function OrderSummary({
    total,
    currency,
    installmentsCount,
    installmentAmount,
    hasProducts
}: Props) {
    if (!hasProducts) {
        return (
            <div className={style.summary}>
                <div className={style.summaryRow}>
                    <span>Monto final</span>
                    <strong className={style.summaryTotal}>{formatMoney(0, currency)}</strong>
                </div>
                <small className={style.summaryHint}>Agregá productos para calcular el total.</small>
            </div>
        )
    }

    return (
        <div className={style.summary}>
            <div className={style.summaryRow}>
                <span>Monto final</span>
                <strong className={style.summaryTotal}>{formatMoney(total, currency)}</strong>
            </div>

            <div className={style.summaryDivider} />

            {installmentsCount === "" ? (
                <small className={style.summaryHint}>Ingresá la cantidad de cuotas.</small>
            ) : installmentsCount === 0 ? (
                <div className={style.summaryRow}>
                    <span>Forma de pago</span>
                    <strong>Pago en el momento</strong>
                </div>
            ) : (
                <div className={style.summaryRow}>
                    <span>
                        {installmentsCount} {installmentsCount === 1 ? "cuota" : "cuotas"} de
                    </span>
                    <strong className={style.summaryInstallment}>
                        {formatMoney(installmentAmount, currency)}
                    </strong>
                </div>
            )}
        </div>
    )
}
