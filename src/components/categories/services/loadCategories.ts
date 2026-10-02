import React from "react";
import { LoadersTexts } from "../../../types/enums";
import { getCategories } from "../api/api.services";
import { Category } from "../api/types";
import { isAxiosError } from "axios";

interface Props<T> {
    setLoader: React.Dispatch<React.SetStateAction<string>>
    setError: React.Dispatch<React.SetStateAction<string>>
    setElement: React.Dispatch<React.SetStateAction<T[]>>
    getElements: () => Promise<T[]>
    loadersTexts: LoadersTexts
}

export default async function loadElements<T>({ setLoader, setError, setElement, getElements, loadersTexts }: Props<T>) {
    try {
        setLoader(loadersTexts);
        setError("");
        const data = await getElements();
        if (data.length == 0) throw new Error("No se encontraron categorias")
        setElement(data);
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