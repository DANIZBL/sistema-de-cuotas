import React, { useEffect, useState } from "react"
import style from "./createCategory.module.css"
import { handleInput } from "../services/handleInput"
import { LoadersTexts } from "../../../types/enums"
import { createCategories, getCategories } from "../api/api.services"
import { Category } from "../api/types"
import { StorageError } from "firebase/storage"

export enum Saving {
    NONE = "none",
    PENDING = "pending",
    SAVE = "save",
}

interface Props {
    setNewCategories: React.Dispatch<React.SetStateAction<{ id: string, value: string }[]>>
    newCategories: { id: string, value: string }[]
    setLoader: React.Dispatch<React.SetStateAction<string>>
    setShowCreateModal: React.Dispatch<React.SetStateAction<boolean>>
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
    setError: React.Dispatch<React.SetStateAction<string>>
}
export default function CreateCategory({
    newCategories,
    setNewCategories,
    setLoader,
    setShowCreateModal,
    setCategories,
    setError
}: Props) {
    const [category, setCategory] = useState<{
        id: string,
        value: string,
        saving: Saving
    }[]>([{ id: crypto.randomUUID(), value: "", saving: Saving.NONE }])

    useEffect(() => {
        const valuesToSave = category.filter(
            c => c.saving === Saving.NONE && c.value.trim() !== ""
        )

        if (!valuesToSave.length) return

        const pendingTimeout = setTimeout(() => {
            setCategory(prev =>
                prev.map(cat =>
                    valuesToSave.some(v => v.id === cat.id)
                        ? { ...cat, saving: Saving.PENDING }
                        : cat
                )
            )

            const saveTimeout = setTimeout(() => {
                setCategory(prev => {
                    const updated = prev.map(cat =>
                        valuesToSave.some(v => v.id === cat.id)
                            ? { ...cat, saving: Saving.SAVE }
                            : cat
                    )

                    setNewCategories(
                        updated
                            .filter(cat => cat.value.trim() !== "")
                            .map(({ id, value }) => ({ id, value }))
                    )

                    return [...updated, { id: crypto.randomUUID(), saving: Saving.NONE, value: "" }]
                })
            }, 1000)

            return () => clearTimeout(saveTimeout)
        }, 500)

        return () => clearTimeout(pendingTimeout)
    }, [category, setNewCategories])

    return (
        <div className={style["inputs-container"]}>
            <label className={style["labels"]}>
                Nombre de la categoría:
                <div className={style["input-spinner"]}>
                    {category.map((cat) => (
                        <div className={style["inputs"]}>
                            <input
                                onChange={e => handleInput({ e, id: cat.id, setCategory })}>
                            </input>
                            {cat.saving == "pending"
                                ?
                                <div className="spinner" />
                                :
                                cat.saving == "save" && <p>✅</p>
                            }
                        </div>
                    ))}
                </div>
            </label>
            <button
                onClick={async () => {
                    try {
                        setCategory([{ id: crypto.randomUUID(), value: "", saving: Saving.NONE }])
                        setShowCreateModal(false)
                        setLoader(LoadersTexts.CREATE_CATEGORIES)
                        await createCategories(newCategories.map(c => ({ name: c.value })))
                        const data = await getCategories()
                        setLoader("")
                        setError("")
                        setCategories(data)
                    } catch (error) {
                        setLoader("")
                        setError("")
                    }
                }}
                className="new-product-button"
                disabled={newCategories.length == 0}
                style={{
                    fontWeight: "bold",
                    fontSize: "17px",
                    background: (newCategories.length == 0) ? "grey" : "",
                    cursor: (newCategories.length == 0) ? "not-allowed" : "pointer"
                }}
            >
                Crear {(newCategories.length == 1 || newCategories.length == 0) ? "categoría" : "categorías"}
            </button>
        </div>
    )
}