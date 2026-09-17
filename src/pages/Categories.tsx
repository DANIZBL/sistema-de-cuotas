import BaseTable from "../components/BaseTable";
import SubHeaderComponent from "../components/SearchAndNewButton";
import loadCategories from "../components/categories/services/loadCategories";
import CreateCategory from "../components/categories/ui/createCategory";
import CategoriesTable from "../components/categories/ui/table";
import useCategoreisHook from "../components/categories/useCategoriesHook";
import Modal from "../components/ui/Modal";

export default function Categories() {
    const {
        categories, setCategories,
        search, setSearch,
        showCreateModal, setShowCreateModal,
        loader, setLoader,
        error, setError,
        newCategories, setNewCategories
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
                TableComponent={
                    <CategoriesTable
                        categories={categories}
                        setCategories={setCategories}
                        setLoader={setLoader}
                        setError={setError}
                    />
                }
                elementText="categorias"
            />
            {showCreateModal &&
                <Modal title={"Nueva categoría"} onClose={() => {
                    setShowCreateModal(false)
                    setNewCategories([])
                }}>
                    <CreateCategory
                        newCategories={newCategories}
                        setNewCategories={setNewCategories}
                        setLoader={setLoader}
                        setShowCreateModal={setShowCreateModal}
                        setCategories={setCategories}
                        setError={setError}
                    />
                </Modal>}
        </div>
    )
}