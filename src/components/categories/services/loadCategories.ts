import React from "react";
import { LoadersTexts } from "../../../types/enums";
import { getCategories } from "../api/api.services";
import { Category } from "../api/types";
import { isAxiosError } from "axios";

interface Props {
    setLoader: React.Dispatch<React.SetStateAction<string>>
    setError: React.Dispatch<React.SetStateAction<string>>
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
}

export default async function loadCategories({ setLoader, setError, setCategories }: Props) {
    try {
        setLoader(LoadersTexts.PRODUCTS);
        setError("");
        const data = await getCategories();
        if (data.length == 0) throw new Error("No se encontraron categorias")
        setCategories(data);
    } catch (error) {
        if (isAxiosError(error))
            setError(error.message)
        else if (error instanceof Error)
            setError(error.message)
        else setError("Ocurrió un error desconocido")
        setLoader("")
    } finally {
        setLoader("");
    }
}