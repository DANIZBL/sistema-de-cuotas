import api from "../../../lib/axios.config";
import { Product, ProductApi } from "../types";


export default async function getOneProduct(id: string) {
    const { data } = await api.get<ProductApi>(`/products/oneProduct/${id}`)
    return data
}