import { LoadersTexts } from "../../../types/enums";
import { deleteCategory } from "../api/api.services";
import { Category } from "../api/types";


export default function CategoriesTable({ categories, setCategories, setLoader, setError }: {
    categories: Category[],
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
    setLoader: React.Dispatch<React.SetStateAction<string>>
    setError: React.Dispatch<React.SetStateAction<string>>
}) {
    return (
        <div className="products-table-container">
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((category) => {
                        return (
                            <tr key={category.id}>
                                <td>
                                    <div className="product-name" style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <strong>{category.name}</strong>
                                            <span>
                                                ID: {category.id.slice(0, 8)}
                                                ...
                                            </span>
                                        </div>
                                        <button className="product-menu" onClick={async () => {
                                            setLoader(LoadersTexts.DELETE_CATEGORY)
                                            await deleteCategory(category.id)
                                            setLoader("")
                                            setCategories(prev => {
                                                const filtered = prev.filter(p => p.id != category.id)
                                                if (!filtered.length)
                                                    setError("No se encontraron categorías")
                                                return filtered
                                            })
                                        }}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}