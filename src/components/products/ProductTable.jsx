import "./ProductTable.css";

function ProductTable({ products, setEditId }) {
  function formatPrice(price) {
    if (price === null || price === undefined) {
      return "-";
    }

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function getStock(product) {
    if (!product.skus?.length) {
      return 0;
    }

    return product.skus.reduce(
      (total, sku) => total + (Number(sku.stock) || 0),
      0
    );
  }

  function getPrice(product) {
    const sku = product.skus?.[0];

    if (!sku) {
      return null;
    }

    return sku.discountedPrice ?? sku.price;
  }

  function getTypeLabel(type) {
    const types = {
      simple: "Simple",
      variable: "Variable",
      bundle: "Bundle",
    };

    return types[type] || type;
  }

  if (!products.length) {
    return (
      <div className="empty-products">
        <div className="empty-icon">📦</div>

        <h3>No encontramos productos</h3>

        <p>Probá modificando la búsqueda o los filtros.</p>
      </div>
    );
  }

  return (
    <div className="products-table-container">
      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>SKUs</th>
            <th>Stock</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const stock = getStock(product);

            const price = getPrice(product);
            return (
              <tr key={product.id}>
                <td>
                  <div className="product-name">
                    <div className="product-image">
                      {product.images?.length ? (
                        <img src={product.images[0].url} alt={product.name} />
                      ) : (
                        "📦"
                      )}
                    </div>

                    <div>
                      <strong>{product.name}</strong>

                      <span>
                        ID: {product.id.slice(0, 8)}
                        ...
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={`type-badge type-${product.type}`}>
                    {getTypeLabel(product.type)}
                  </span>
                </td>

                <td>
                  <span className={`type-badge type-${product.type}`}>
                    {product.categories.map(category => category.name)}
                  </span>
                </td>

                <td>
                  <strong>{formatPrice(price)}</strong>
                </td>

                <td>{product.skus?.length || 0}</td>

                <td>
                  <span className={stock === 0 ? "stock stock-empty" : "stock"}>
                    {stock}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      product.isPublished
                        ? "status published"
                        : "status unpublished"
                    }
                  >
                    <span />
                    {product.isPublished ? "Publicado" : "Oculto"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => {
                      setEditId(product.id)
                    }}
                    className="product-menu"
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
