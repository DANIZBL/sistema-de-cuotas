import { useState } from "react";

import { createProduct } from "../../services/productService";

import "./ProductForm.css";

const createEmptyAttribute = () => ({
  name: "",
  value: "",
});

const createEmptyVariant = () => ({
  attributes: [createEmptyAttribute()],
  price: "",
  discountedPrice: "",
  stock: "",
});

function ProductForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    type: "simple",
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    stock: "",
    isPublished: true,
    images: [""],
    variants: [createEmptyVariant()],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleTypeChange(event) {
    const type = event.target.value;

    setForm((current) => ({
      ...current,
      type,
    }));
  }

  function handleImageChange(index, value) {
    setForm((current) => {
      const images = [...current.images];

      images[index] = value;

      return {
        ...current,
        images,
      };
    });
  }

  function addImage() {
    setForm((current) => ({
      ...current,
      images: [...current.images, ""],
    }));
  }

  function removeImage(index) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  }

  function updateVariant(variantIndex, field, value) {
    setForm((current) => {
      const variants = [...current.variants];

      variants[variantIndex] = {
        ...variants[variantIndex],
        [field]: value,
      };

      return {
        ...current,
        variants,
      };
    });
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [...current.variants, createEmptyVariant()],
    }));
  }

  function removeVariant(index) {
    setForm((current) => {
      if (current.variants.length === 1) {
        return current;
      }

      return {
        ...current,
        variants: current.variants.filter(
          (_, variantIndex) => variantIndex !== index
        ),
      };
    });
  }

  function updateAttribute(variantIndex, attributeIndex, field, value) {
    setForm((current) => {
      const variants = [...current.variants];

      const variant = variants[variantIndex];

      const attributes = [...variant.attributes];

      attributes[attributeIndex] = {
        ...attributes[attributeIndex],
        [field]: value,
      };

      variants[variantIndex] = {
        ...variant,
        attributes,
      };

      return {
        ...current,
        variants,
      };
    });
  }

  function addAttribute(variantIndex) {
    setForm((current) => {
      const variants = [...current.variants];

      variants[variantIndex] = {
        ...variants[variantIndex],
        attributes: [
          ...variants[variantIndex].attributes,
          createEmptyAttribute(),
        ],
      };

      return {
        ...current,
        variants,
      };
    });
  }

  function removeAttribute(variantIndex, attributeIndex) {
    setForm((current) => {
      const variant = current.variants[variantIndex];

      if (variant.attributes.length === 1) {
        return current;
      }

      const variants = [...current.variants];

      variants[variantIndex] = {
        ...variant,
        attributes: variant.attributes.filter(
          (_, currentIndex) => currentIndex !== attributeIndex
        ),
      };

      return {
        ...current,
        variants,
      };
    });
  }

  function validateSimple() {
    if (!form.name.trim()) {
      return "El nombre del producto es obligatorio.";
    }

    if (form.price === "") {
      return "El precio es obligatorio.";
    }

    if (form.stock === "") {
      return "El stock es obligatorio.";
    }

    if (Number(form.price) < 0) {
      return "El precio no puede ser negativo.";
    }

    if (Number(form.stock) < 0) {
      return "El stock no puede ser negativo.";
    }

    if (form.discountedPrice !== "" && Number(form.discountedPrice) < 0) {
      return "El precio promocional no puede ser negativo.";
    }

    return "";
  }

  function validateVariable() {
    if (!form.name.trim()) {
      return "El nombre del producto es obligatorio.";
    }

    if (!form.variants.length) {
      return "El producto debe tener al menos una variante.";
    }

    for (
      let variantIndex = 0;
      variantIndex < form.variants.length;
      variantIndex++
    ) {
      const variant = form.variants[variantIndex];

      if (!variant.attributes.length) {
        return `La variante ${
          variantIndex + 1
        } necesita al menos una característica.`;
      }

      for (
        let attributeIndex = 0;
        attributeIndex < variant.attributes.length;
        attributeIndex++
      ) {
        const attribute = variant.attributes[attributeIndex];

        if (!attribute.name.trim()) {
          return `Completá el nombre de la característica de la variante ${
            variantIndex + 1
          }.`;
        }

        if (!attribute.value.trim()) {
          return `Completá el valor de la característica de la variante ${
            variantIndex + 1
          }.`;
        }
      }

      if (variant.price === "") {
        return `El precio de la variante ${variantIndex + 1} es obligatorio.`;
      }

      if (variant.stock === "") {
        return `El stock de la variante ${variantIndex + 1} es obligatorio.`;
      }

      if (Number(variant.price) < 0) {
        return `El precio de la variante ${
          variantIndex + 1
        } no puede ser negativo.`;
      }

      if (Number(variant.stock) < 0) {
        return `El stock de la variante ${
          variantIndex + 1
        } no puede ser negativo.`;
      }

      if (
        variant.discountedPrice !== "" &&
        Number(variant.discountedPrice) < 0
      ) {
        return `El precio promocional de la variante ${
          variantIndex + 1
        } no puede ser negativo.`;
      }
    }

    return "";
  }

  function buildSimplePayload() {
    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      isPublished: form.isPublished,
      images: form.images.map((image) => image.trim()).filter(Boolean),
    };

    if (form.discountedPrice !== "") {
      productData.discountedPrice = Number(form.discountedPrice);
    }

    return productData;
  }

  function buildVariablePayload() {
    return {
      name: form.name.trim(),
      description: form.description.trim(),

      // El backend también espera estos campos
      // en el nivel principal para productos variables.
      price: Number(form.variants[0].price) || 0,
      stock: 0,

      isPublished: form.isPublished,

      variants: form.variants.map((variant) => {
        const payloadVariant = {
          variant: variant.attributes.map((attribute) => ({
            name: attribute.name.trim(),
            value: attribute.value.trim(),
          })),

          stock: Number(variant.stock),
        };

        if (variant.price !== "") {
          payloadVariant.price = Number(variant.price);
        }

        if (variant.discountedPrice !== "") {
          payloadVariant.discountedPrice = Number(variant.discountedPrice);
        }

        return payloadVariant;
      }),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const validationError =
      form.type === "simple" ? validateSimple() : validateVariable();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const productData =
        form.type === "simple" ? buildSimplePayload() : buildVariablePayload();

      console.log("Payload enviado:", productData);

      await createProduct(productData);

      onSuccess();
    } catch (error) {
      console.error("Error al crear producto:", error);

      setError(error.message || "No se pudo crear el producto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
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
            onChange={handleTypeChange}
            disabled={loading}
          >
            <option value="simple">Producto simple</option>

            <option value="variable">Producto variable</option>
          </select>

          <small>
            Los productos variables generan un SKU por cada combinación de
            características.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="product-name">Nombre *</label>

          <input
            id="product-name"
            type="text"
            name="name"
            placeholder="Ej: Joystick inalámbrico"
            value={form.name}
            onChange={handleChange}
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
            onChange={handleChange}
            rows="4"
            disabled={loading}
          />
        </div>
      </div>

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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  min="0"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <ImageSection
            images={form.images}
            loading={loading}
            onAdd={addImage}
            onRemove={removeImage}
            onChange={handleImageChange}
          />
        </>
      )}

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
                      onClick={() => removeVariant(variantIndex)}
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
                            updateAttribute(
                              variantIndex,
                              attributeIndex,
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
                              variantIndex,
                              attributeIndex,
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
                          onClick={() =>
                            removeAttribute(variantIndex, attributeIndex)
                          }
                          disabled={loading}
                          aria-label="Eliminar característica"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-attribute-button"
                    onClick={() => addAttribute(variantIndex)}
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
                          updateVariant(
                            variantIndex,
                            "price",
                            event.target.value
                          )
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
                            variantIndex,
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
                          updateVariant(
                            variantIndex,
                            "stock",
                            event.target.value
                          )
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

function ImageSection({ images, loading, onAdd, onRemove, onChange }) {
  return (
    <div className="form-section">
      <div className="form-section-title">
        <div>
          <h3>Imágenes</h3>

          <p>Agregá las URLs de las imágenes</p>
        </div>

        <button
          type="button"
          className="add-image-button"
          onClick={onAdd}
          disabled={loading}
        >
          + Agregar
        </button>
      </div>

      <div className="images-form">
        {images.map((image, index) => (
          <div className="image-input" key={index}>
            <input
              type="url"
              placeholder="https://..."
              value={image}
              onChange={(event) => onChange(index, event.target.value)}
              disabled={loading}
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={loading}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductForm;
