import style from "./CreateOrderForm.module.css"

export default function ClientSection({ setClientInfo }: {
    setClientInfo: React.Dispatch<React.SetStateAction<{
        name: string;
        apellido: string;
        mail: string;
        phone: string;
    }>>
}) {

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setClientInfo((prev) => ({ ...prev, [name]: value }))
    }
    return (
        <section className={style.section}>
            <div className={style.sectionTitle}>
                <div>
                    <h3>Datos del cliente</h3>
                    <p>Se usan para identificar la orden y enviar avisos de las cuotas.</p>
                </div>
            </div>

            <div className={style.formGrid}>
                <div className={style.formGroup}>
                    <label htmlFor="client-name">Nombre</label>
                    <input id="client-name" name="name" placeholder="Ej: Juan" onChange={handleInputChange} />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="client-apellido">Apellido</label>
                    <input id="client-apellido" name="apellido" placeholder="Ej: Pérez" onChange={handleInputChange} />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="client-phone">Teléfono</label>
                    <input id="client-phone" name="phone" type="tel" placeholder="Ej: 11 1234-5678" onChange={handleInputChange} />
                </div>
                <div className={style.formGroup}>
                    <label htmlFor="client-mail">Mail</label>
                    <input id="client-mail" name="mail" type="email" placeholder="Ej: juan@mail.com" onChange={handleInputChange} />
                </div>
            </div>
        </section>
    )
}
