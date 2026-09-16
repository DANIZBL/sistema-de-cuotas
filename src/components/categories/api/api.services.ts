import api from "../../../lib/axios.config"
import { Category } from "./types"

export const getCategories = async () => {
    const { data } = await api.get<Category[]>("/categories")
    return data
}