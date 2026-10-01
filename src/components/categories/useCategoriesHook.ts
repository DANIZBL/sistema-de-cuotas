import { useState, useEffect } from "react"
import { getCategories } from "./api/api.services"
import { Category } from "./api/types";
import { LoadersTexts } from "../../types/enums";
import { isAxiosError } from "axios";


export default function useCategoreisHook() {
    const [search, setSearch] = useState<string>("")
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [loader, setLoader] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [newCategories, setNewCategories] = useState<{ id: string, value: string }[]>([])

    useEffect(() => {
        (async () => {
            setLoader(LoadersTexts.CATEGORIES)
            try {
                const categories = await getCategories()
                if (categories.length == 0) throw new Error("No se encontraron categorias")
                setLoader("")
                setCategories(categories)
            } catch (error) {
                if (isAxiosError(error))
                    setError(error.message)
                else if (error instanceof Error)
                    setError(error.message)
                else setError("Ocurrió un error desconocido")
                setLoader("")
            }
        })()
    }, [])

    return {
        categories, setCategories,
        showCreateModal, setShowCreateModal,
        search, setSearch,
        loader, setLoader,
        error, setError,
        newCategories, setNewCategories
    }
} 