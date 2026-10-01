import { ChangeEvent } from "react"
import { Saving } from "../ui/createCategory";

interface Props {
    setCategory: React.Dispatch<React.SetStateAction<{
        id: string;
        value: string;
        saving: Saving
    }[]>>
    e: ChangeEvent<HTMLInputElement>,
    id: string
}
export const handleInput = ({ e, id, setCategory }: Props) => {
    setCategory(prev => {
        if (prev.length) {
            const category = prev.findIndex(c => c.id == id)
            prev[category].value = e.target.value
            return [...prev]
        } else return prev
    })
}