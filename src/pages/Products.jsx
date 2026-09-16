import { useEffect, useMemo, useState } from "react";
import ProductTable from "../components/products/ProductTable";
import ProductForm from "../components/products/ProductForm";
import Modal from "../components/ui/Modal";

import "./Products.css";
import SubHeaderComponent from "../components/SearchAndNewButton";
import { getProducts } from "../components/products/services/productService";

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");

  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesType = typeFilter === "all" || product.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [products, search, typeFilter]);

  function handleProductCreated() {
    setShowCreateModal(false);

    loadProducts();
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
          onChange={(event) => setTypeFilter(event.target.value)}
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

          <button onClick={loadProducts}>Intentar nuevamente</button>
        </div>
      )}

      {!loading && !error && <ProductTable products={filteredProducts} />}

      {showCreateModal && (
        <Modal title="Nuevo producto" onClose={() => setShowCreateModal(false)}>
          <ProductForm
            onSuccess={handleProductCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </section>
  );
}

export default Products;
