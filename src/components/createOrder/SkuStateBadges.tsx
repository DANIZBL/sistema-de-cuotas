import style from "./CreateOrderForm.module.css"
import { ProductCondition } from "../products/types"

interface Props {
    condition: ProductCondition | null,
    battery: number | null
}

function batteryLevel(battery: number) {
    if (battery >= 80) return style.batteryHigh
    if (battery >= 60) return style.batteryMedium
    return style.batteryLow
}

// Condición (nuevo/usado) y batería de un SKU. No renderiza nada si no hay datos
export default function SkuStateBadges({ condition, battery }: Props) {
    if (!condition && battery == null) return null

    return (
        <div className={style.skuState}>
            {condition && (
                <span
                    className={`${style.stateBadge} ${condition === ProductCondition.NUEVO ? style.conditionNew : style.conditionUsed}`}
                >
                    {condition === ProductCondition.NUEVO ? "Nuevo" : "Usado"}
                </span>
            )}

            {battery != null && (
                <span className={`${style.stateBadge} ${batteryLevel(battery)}`} title="Salud de la batería">
                    <span className={style.batteryIcon} aria-hidden="true">
                        <span style={{ width: `${battery}%` }} />
                    </span>
                    {battery}%
                </span>
            )}
        </div>
    )
}
