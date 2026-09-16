import { Category } from "../api/types";


export default function CategoriesTable({ categories }: { categories: Category[] }) {
    return (
        <div className="products-table-container">
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {categories.map((category) => {
                        return (
                            <tr key={category.id}>
                                <td>
                                    <div className="product-name">
                                        <div>
                                            <strong>{category.name}</strong>
                                            <span>
                                                ID: {category.id.slice(0, 8)}
                                                ...
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button className="product-menu">⋮</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}