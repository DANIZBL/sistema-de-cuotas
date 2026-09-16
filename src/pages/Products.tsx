import { useMemo, useState } from "react";
import Modal from "../components/ui/Modal";
import SubHeaderComponent from "../components/SearchAndNewButton";
import {
  ProductForm,
  ProductTable,
  useProductList,
  type ProductType,
} from "../components/products";

import "./Products.css";

type TypeFilter = ProductType | "all";

function Products() {
  const { products, loading, error, reload } = useProductList();

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(term);

      const matchesType = typeFilter === "all" || product.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [products, search, typeFilter]);

  function handleProductCreated() {
    setShowCreateModal(false);

    reload();
  }

  return (
    <section className="products-page">
      <SubHeaderComponent
        search={search}
        setSearch={setSearch}
        setShowCreateModal={setShowCreateModal}
        placeholder="Buscar producto..."
      >
        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as TypeFilter)
          }
        >
          <option value="all">Todos los tipos</option>

          <option value="simple">Simple</option>

          <option value="variable">Variable</option>

          <option value="bundle">Bundle</option>
        </select>
      </SubHeaderComponent>

      <div className="products-info">
        <strong>{filteredProducts.length}</strong>

        <span>
          {filteredProducts.length === 1 ? " producto" : " productos"}
        </span>
      </div>

      {loading && (
        <div className="products-state">
          <div className="spinner" />
          <p>Cargando productos...</p>
        </div>
      )}

      {!loading && error && (
        <div className="products-state error-state">
          <p>{error}</p>

          <button onClick={() => reload()}>Intentar nuevamente</button>
        </div>
      )}

      {!loading && !error && <ProductTable products={filteredProducts} />}

      {showCreateModal && (
        <Modal title="Nuevo producto" onClose={() => setShowCreateModal(false)}>
          <ProductForm
            products={products}
            loadingProducts={loading}
            onSuccess={handleProductCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </section>
  );
}

export default Products;
