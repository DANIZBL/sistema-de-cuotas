import { useProductForm } from "../hooks/useProductForm";
import { getSkuLabel, getSkusForProduct } from "../model/selectors";
import type { Product, ProductTextField, ProductType } from "../model/types";
import { ImageSection } from "./ImageSection";
import "./ProductForm.css";

interface ProductFormProps {
  products: Product[];
  loadingProducts: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

function ProductForm({
  products,
  loadingProducts,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const {
    form,
    loading,
    error,
    setTextField,
    setType,
    setPublished,
    addImages,
    removeImage,
    addVariant,
    removeVariant,
    updateVariant,
    addAttribute,
    removeAttribute,
    updateAttribute,
    addComponent,
    removeComponent,
    updateComponentQuantity,
    updateComponentSku,
    selectComponentProduct,
    submit,
  } = useProductForm({ products, onSuccess });

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setTextField(event.target.name as ProductTextField, event.target.value);

  return (
    <form className="product-form" onSubmit={submit}>
      {/* =========================
          INFORMACIÓN GENERAL
      ========================= */}

      <div className="form-section">
        <div className="form-section-title">
          <h3>Información general</h3>

          <p>Datos principales del producto</p>
        </div>

        <div className="form-group">
          <label htmlFor="product-type">Tipo de producto</label>

          <select
            id="product-type"
            value={form.type}
            onChange={(event) => setType(event.target.value as ProductType)}
            disabled={loading}
          >
            <option value="simple">Producto simple</option>

            <option value="variable">Producto variable</option>

            <option value="bundle">Combo</option>
          </select>

          <small>
            Los combos están compuestos por productos o variantes existentes.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="product-name">Nombre *</label>

          <input
            id="product-name"
            type="text"
            name="name"
            placeholder="Ej: Combo Consola + 2 Joysticks"
            value={form.name}
            onChange={onTextChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-description">Descripción</label>

          <textarea
            id="product-description"
            name="description"
            placeholder="Descripción del producto..."
            value={form.description}
            onChange={onTextChange}
            rows={4}
            disabled={loading}
          />
        </div>
      </div>

      {/* =========================
          SIMPLE
      ========================= */}

      {form.type === "simple" && (
        <>
          <div className="form-section">
            <div className="form-section-title">
              <h3>Precio y stock</h3>

              <p>Información comercial del producto</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="product-price">Precio *</label>

                <input
                  id="product-price"
                  type="number"
                  name="price"
                  placeholder="95000"
                  value={form.price}
                  onChange={onTextChange}
                  min="0"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-discount">Precio promocional</label>

                <input
                  id="product-discount"
                  type="number"
                  name="discountedPrice"
                  placeholder="85000"
                  value={form.discountedPrice}
                  onChange={onTextChange}
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-stock">Stock *</label>

                <input
                  id="product-stock"
                  type="number"
                  name="stock"
                  placeholder="40"
                  value={form.stock}
                  onChange={onTextChange}
                  min="0"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <ImageSection
            images={form.imageFiles}
            disabled={loading}
            onAdd={addImages}
            onRemove={removeImage}
          />
        </>
      )}

      {/* =========================
          VARIABLE
      ========================= */}

      {form.type === "variable" && (
        <div className="form-section variants-section">
          <div className="form-section-title">
            <div>
              <h3>Variantes</h3>

              <p>Cada combinación tendrá su propio precio y stock.</p>
            </div>

            <button
              type="button"
              className="add-variant-button"
              onClick={addVariant}
              disabled={loading}
            >
              + Agregar variante
            </button>
          </div>

          <div className="variants-list">
            {form.variants.map((variant, variantIndex) => (
              <div className="variant-card" key={variant.id}>
                <div className="variant-card-header">
                  <div>
                    <span className="variant-number">
                      Variante {variantIndex + 1}
                    </span>

                    <p>Características y datos comerciales</p>
                  </div>

                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      className="remove-variant-button"
                      onClick={() => removeVariant(variant.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="variant-attributes">
                  <div className="variant-subtitle">Características</div>

                  {variant.attributes.map((attribute) => (
                    <div className="attribute-row" key={attribute.id}>
                      <div className="form-group">
                        <label>Nombre</label>

                        <input
                          type="text"
                          placeholder="Ej: Color"
                          value={attribute.name}
                          onChange={(event) =>
                            updateAttribute(
                              variant.id,
                              attribute.id,
                              "name",
                              event.target.value
                            )
                          }
                          disabled={loading}
                        />
                      </div>

                      <div className="form-group">
                        <label>Valor</label>

                        <input
                          type="text"
                          placeholder="Ej: Rojo"
                          value={attribute.value}
                          onChange={(event) =>
                            updateAttribute(
                              variant.id,
                              attribute.id,
                              "value",
                              event.target.value
                            )
                          }
                          disabled={loading}
                        />
                      </div>

                      {variant.attributes.length > 1 && (
                        <button
                          type="button"
                          className="remove-attribute-button"
                          onClick={() => removeAttribute(variant.id, attribute.id)}
                          disabled={loading}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-attribute-button"
                    onClick={() => addAttribute(variant.id)}
                    disabled={loading}
                  >
                    + Agregar característica
                  </button>
                </div>

                <div className="variant-commercial">
                  <div className="variant-subtitle">Precio y stock</div>

                  <div className="form-grid variant-price-grid">
                    <div className="form-group">
                      <label>Precio *</label>

                      <input
                        type="number"
                        placeholder="95000"
                        min="0"
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(variant.id, "price", event.target.value)
                        }
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Precio promocional</label>

                      <input
                        type="number"
                        placeholder="85000"
                        min="0"
                        value={variant.discountedPrice}
                        onChange={(event) =>
                          updateVariant(
                            variant.id,
                            "discountedPrice",
                            event.target.value
                          )
                        }
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock *</label>

                      <input
                        type="number"
                        placeholder="25"
                        min="0"
                        value={variant.stock}
                        onChange={(event) =>
                          updateVariant(variant.id, "stock", event.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================
          BUNDLE / COMBO
      ========================= */}

      {form.type === "bundle" && (
        <>
          <div className="form-section">
            <div className="form-section-title">
              <div>
                <h3>Precio del combo</h3>

                <p>El precio final que tendrá el combo.</p>
              </div>
            </div>

            <div className="form-grid bundle-price-grid">
              <div className="form-group">
                <label htmlFor="bundle-price">Precio *</label>

                <input
                  id="bundle-price"
                  type="number"
                  name="price"
                  placeholder="850000"
                  value={form.price}
                  onChange={onTextChange}
                  min="0"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <ImageSection
            images={form.imageFiles}
            disabled={loading}
            onAdd={addImages}
            onRemove={removeImage}
          />

          <div className="form-section bundle-section">
            <div className="form-section-title">
              <div>
                <h3>Componentes del combo</h3>

                <p>
                  Elegí productos y, si corresponde, una variante específica.
                </p>
              </div>

              <button
                type="button"
                className="add-variant-button"
                onClick={addComponent}
                disabled={loading || loadingProducts}
              >
                + Agregar componente
              </button>
            </div>

            {loadingProducts && (
              <div className="bundle-loading">Cargando productos...</div>
            )}

            {!loadingProducts && products.length === 0 && (
              <div className="bundle-empty">
                No hay productos disponibles para agregar al combo.
              </div>
            )}

            <div className="bundle-components">
              {form.components.map((component, componentIndex) => {
                const availableSkus = getSkusForProduct(
                  component.productId,
                  products
                );

                return (
                  <div className="bundle-component-card" key={component.id}>
                    <div className="bundle-component-header">
                      <div>
                        <span className="variant-number">
                          Componente {componentIndex + 1}
                        </span>

                        <p>Producto y SKU que formarán parte del combo</p>
                      </div>

                      {form.components.length > 1 && (
                        <button
                          type="button"
                          className="remove-variant-button"
                          onClick={() => removeComponent(component.id)}
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="bundle-component-grid">
                      <div className="form-group">
                        <label>Producto</label>

                        <select
                          value={component.productId}
                          onChange={(event) =>
                            selectComponentProduct(
                              component.id,
                              event.target.value
                            )
                          }
                          disabled={loading || loadingProducts}
                        >
                          <option value="">Seleccionar producto</option>

                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>SKU / Variante</label>

                        <select
                          value={component.skuId}
                          onChange={(event) =>
                            updateComponentSku(component.id, event.target.value)
                          }
                          disabled={loading || !component.productId}
                        >
                          <option value="">Seleccionar SKU</option>

                          {availableSkus.map((sku) => (
                            <option key={sku.id} value={sku.id}>
                              {getSkuLabel(sku)}
                            </option>
                          ))}
                        </select>

                        {component.productId && availableSkus.length === 0 && (
                          <small>Este producto todavía no tiene SKUs.</small>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Cantidad</label>

                        <input
                          type="number"
                          min="1"
                          value={component.quantity}
                          onChange={(event) =>
                            updateComponentQuantity(
                              component.id,
                              event.target.value
                            )
                          }
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* =========================
          PUBLICACIÓN
      ========================= */}

      <div className="form-section">
        <div className="form-section-title">
          <h3>Publicación</h3>

          <p>Controlá si el producto está visible</p>
        </div>

        <label className="publish-toggle">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => setPublished(event.target.checked)}
            disabled={loading}
          />

          <span className="toggle-slider" />

          <div>
            <strong>Producto publicado</strong>

            <small>El producto estará disponible para los clientes.</small>
          </div>
        </label>
      </div>

      {error && (
        <div className="form-error">
          <strong>No se pudo crear el producto</strong>

          <span>{error}</span>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Creando producto..." : "Crear producto"}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
