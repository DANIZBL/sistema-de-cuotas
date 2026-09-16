import React from "react"

interface Props {
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>
    children?: React.ReactNode
    setShowCreateModal: React.Dispatch<React.SetStateAction<boolean>>
    placeholder: string
}

export default function SubHeaderComponent({ search, setSearch, children, setShowCreateModal, placeholder }: Props) {

    return (
        <div className="products-toolbar">
            <div className="products-search">
                <span>🔎</span>

                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>


            <div className="products-actions">
                {children}
                <button
                    className="new-product-button"
                    onClick={() => setShowCreateModal(true)}
                >
                    + Nuevo {placeholder.split(" ")[1].replace("...", "")}
                </button>
            </div>
        </div>
    )
}