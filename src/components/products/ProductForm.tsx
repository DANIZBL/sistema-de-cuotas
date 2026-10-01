import useProducts from "./customHook";
import { ImageSection } from "./ImageSection";
import "./ProductForm.css";
import { getComponentProductId, getSkuLabel, getSkusForProduct } from "./services/getProducts";
import { handleChange } from "./services/handleChange";
import { handleComponentProductChange } from "./services/handleComponentProductChange";
import { handleImageFilesChange, removeImageFile } from "./services/handleImageFilesChange";
import { handleTypeChange } from "./services/handleTypeChange";
import { handleSubmit } from "./services/submit";
import { addAttribute, removeAttribute, updateAttribute } from "./services/updateAttribute";
import { addComponent, removeComponent, updateComponent } from "./services/updateComponent";
import { addVariant, removeVariant, updateVariant } from "./services/updateVariant";
import { ProductFormProps } from "./types";

function ProductForm({ onSuccess, onCancel, editId }: ProductFormProps) {
  const {
    form, setForm,
    products,
    loadingProducts,
    loading, setLoading,
    error, setError,
    categories
  } = useProducts(editId)

  return (
    <form className="product-form" onSubmit={(event) => handleSubmit({ event, form, onSuccess, setError, setLoading, editId })}>
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
            onChange={(e) => handleTypeChange({ event: e, setError, setForm })}
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
            onChange={(e) => handleChange({ event: e, setForm })}
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
            onChange={(e) => handleChange({ event: e, setForm })}
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-category-0">Categoría</label>

          {form.categories.map((selected, i) =>
            <select
              key={i}
              id={`product-category-${i}`}
              value={selected.id}
              onChange={(e) => setForm((current) => ({
                ...current,
                categories: current.categories.map((c, j) =>
                  j === i ? { ...c, id: e.target.value } : c
                ),
              }))}
              disabled={loading}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat =>
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              )}
            </select>
          )}
          <button
            type="button"
            className="add-image-button"
            disabled={loading}
            onClick={() => setForm(prev => ({
              ...prev,
              categories: [...prev.categories, { id: "" }]
            }))}
          > + Categoría</button>
        </div>
      </div>

      {/* =========================
          SIMPLE
      ========================= */}

      {
        form.type === "simple" && (
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
                    onChange={(e) => handleChange({ event: e, setForm })}
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
                    onChange={(e) => handleChange({ event: e, setForm })}
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
                    onChange={(e) => handleChange({ event: e, setForm })}
                    min="0"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            <ImageSection
              images={form.imageFiles}
              loading={loading}
              onAdd={handleImageFilesChange}
              onRemove={removeImageFile}
              setForm={setForm}
            />
          </>
        )
      }

      {/* =========================
          VARIABLE
      ========================= */}

      {
        form.type === "variable" && (
          <div className="form-section variants-section">
            <div className="form-section-title">
              <div>
                <h3>Variantes</h3>

                <p>Cada combinación tendrá su propio precio y stock.</p>
              </div>

              <button
                type="button"
                className="add-variant-button"
                onClick={() => addVariant({ setForm })}
                disabled={loading}
              >
                + Agregar variante
              </button>
            </div>

            <div className="variants-list">
              {form.variants.map((variant, variantIndex) => (
                <div className="variant-card" key={variantIndex}>
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
                        onClick={() => removeVariant({ index: variantIndex, setForm })}
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="variant-attributes">
                    <div className="variant-subtitle">Características</div>

                    {variant.attributes.map((attribute, attributeIndex) => (
                      <div className="attribute-row" key={attributeIndex}>
                        <div className="form-group">
                          <label>Nombre</label>

                          <input
                            type="text"
                            placeholder="Ej: Color"
                            value={attribute.name}
                            onChange={(event) =>
                              updateAttribute({
                                variantIndex,
                                attributeIndex,
                                field: "name",
                                value: event.target.value,
                                setForm
                              })
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
                              updateAttribute({
                                variantIndex,
                                attributeIndex,
                                field: "value",
                                value: event.target.value,
                                setForm
                              })
                            }
                            disabled={loading}
                          />
                        </div>

                        {variant.attributes.length > 1 && (
                          <button
                            type="button"
                            className="remove-attribute-button"
                            onClick={() =>
                              removeAttribute({ variantIndex, attributeIndex, setForm })
                            }
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
                      onClick={() => addAttribute({ variantIndex, setForm })}
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
                            updateVariant({
                              variantIndex,
                              field: "price",
                              value: event.target.value,
                              setForm
                            })
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
                            updateVariant({
                              variantIndex,
                              field: "discountedPrice",
                              value: event.target.value,
                              setForm
                            })
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
                            updateVariant({
                              variantIndex,
                              field: "stock",
                              value: event.target.value,
                              setForm
                            })
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
        )
      }

      {/* =========================
          BUNDLE / COMBO
      ========================= */}

      {
        form.type === "bundle" && (
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
                    onChange={(e) => handleChange({ event: e, setForm })}
                    min="0"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            <ImageSection
              images={form.imageFiles}
              loading={loading}
              onAdd={handleImageFilesChange}
              onRemove={removeImageFile}
              setForm={setForm}
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
                  onClick={() => addComponent({ setForm })}
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
                  const selectedProductId = getComponentProductId(component.skuId, products);

                  const availableSkus = selectedProductId
                    ? getSkusForProduct(selectedProductId, products)
                    : [];

                  return (
                    <div className="bundle-component-card" key={componentIndex}>
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
                            onClick={() => removeComponent({ setForm, componentIndex })}
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
                            value={selectedProductId}
                            onChange={(event) =>
                              handleComponentProductChange({
                                componentIndex,
                                productId: event.target.value,
                                setForm,
                                products
                              })
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
                              updateComponent({
                                componentIndex,
                                field: "skuId",
                                value: event.target.value,
                                setForm
                              })
                            }
                            disabled={loading || !selectedProductId}
                          >
                            <option value="">Seleccionar SKU</option>

                            {availableSkus.map((sku) => (
                              <option key={sku.id} value={sku.id}>
                                {getSkuLabel(sku)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Cantidad</label>

                          <input
                            type="number"
                            min="1"
                            value={component.quantity}
                            onChange={(event) =>
                              updateComponent({
                                componentIndex,
                                field: "quantity",
                                value: event.target.value,
                                setForm
                              })
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
        )
      }

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
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                isPublished: event.target.checked,
              }))
            }
            disabled={loading}
          />

          <span className="toggle-slider" />

          <div>
            <strong>Producto publicado</strong>

            <small>El producto estará disponible para los clientes.</small>
          </div>
        </label>
      </div>

      {
        error && (
          <div className="form-error">
            <strong>{editId ? "No se pudo editar el producto" : "No se pudo crear el producto"}</strong>

            <span>{error}</span>
          </div>
        )
      }

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
          {!editId ? (loading ? "Creando producto..." : "Crear producto") : (loading ? "Editando producto..." : "Editar producto")}
        </button>
      </div>
    </form >
  );
}

export default ProductForm;
