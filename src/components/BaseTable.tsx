import React from "react"

interface Props {
    loading: string
    error: string
    filteredElement: any,
    TableComponent: React.Component,
    loadElements: () => Promise<void>
}


export default function BaseTable({ filteredElement, loading, error, loadElements, TableComponent }: Props) {
    return (
        <>
            <div className="products-info">
                <strong>{filteredElement.length}</strong>

                <span>
                    {filteredElement.length === 1 ? " producto" : " productos"}
                </span>
            </div>

            {loading && (
                <div className="products-state">
                    <div className="spinner" />
                    <p>{loading}</p>
                </div>
            )}

            {!loading && error && (
                <div className="products-state error-state">
                    <p>{error}</p>

                    <button onClick={loadElements}>Intentar nuevamente</button>
                </div>
            )}

            {!loading && !error && TableComponent}
        </>
    )
}