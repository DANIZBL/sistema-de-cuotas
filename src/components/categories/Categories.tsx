import { useState } from "react";
import SubHeaderComponent from "../SearchAndNewButton";

export default function Categories() {
    const [search, setSearch] = useState<string>("")
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
    return (
        <div>
            <SubHeaderComponent
                placeholder="Buscar categoria..."
                search={search}
                setSearch={setSearch}
                setShowCreateModal={setShowCreateModal}
            />
        </div>
    )
}