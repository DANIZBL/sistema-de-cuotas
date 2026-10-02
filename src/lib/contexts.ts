import { createContext } from "react";
import { Product } from "../components/products/types";

export const ProductsContext = createContext<{ products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>> } | null>(null)