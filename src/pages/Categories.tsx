import BaseTable from "../components/BaseTable";
import SubHeaderComponent from "../components/SearchAndNewButton";
import loadCategories from "../components/categories/services/loadCategories";
import CategoriesTable from "../components/categories/ui/table";
import useCategoreisHook from "../components/categories/useCategoriesHook";

export default function Categories() {
    const {
        categories, setCategories,
        search, setSearch,
        showCreateModal, setShowCreateModal,
        loader, setLoader,
        error, setError
    } = useCategoreisHook()

    return (
        <div>
            <SubHeaderComponent
                placeholder="Buscar categoria..."
                search={search}
                setSearch={setSearch}
                setShowCreateModal={setShowCreateModal}
            />
            <BaseTable
                error={error}
                filteredElement={categories}
                loading={loader}
                loadElements={() => loadCategories({ setCategories, setError, setLoader })}
                TableComponent={<CategoriesTable categories={categories} />}
                elementText="categorias"
            />
        </div>
    )
}