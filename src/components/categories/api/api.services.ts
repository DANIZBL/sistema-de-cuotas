import api from "../../../lib/axios.config"
import { Category } from "./types"

export const getCategories = async () => {
    const { data } = await api.get<Category[]>("/categories")
    return data
}

export const createCategories = async (categories: { name: string }[]) => {
    const { data } = await api.post<Category[]>("/categories/bulk", categories)
    return data
}

export const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`)
    return
}