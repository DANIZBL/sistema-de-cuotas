import { uploadProductImage } from "../../services/imageService";
import { useEffect, useState } from "react";
import { createProduct, getProducts } from "../../services/productService";

import type {
  CreateBundleComponent,
  CreateBundleProduct,
  CreateSimpleProduct,
  CreateVariableProduct,
  Product,
  SKU,
} from "../../types/product";

import "./ProductForm.css";

type ProductFormType = "simple" | "variable" | "bundle";

interface AttributeForm {
  name: string;
  value: string;
}

interface VariableForm {
  attributes: AttributeForm[];
  price: string;
  discountedPrice: string;
  stock: string;
}

interface BundleComponentForm {
  skuId: string;
  quantity: string;
}

interface ImageFile {
  file: File;
  preview: string;
}

interface ProductFormState {
  type: ProductFormType;
  name: string;
  description: string;
  price: string;
  discountedPrice: string;
  stock: string;
  isPublished: boolean;
  imageFiles: ImageFile[];
  variants: VariableForm[];
  components: BundleComponentForm[];
}

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const createEmptyAttribute = (): AttributeForm => ({
  name: "",
  value: "",
});

const createEmptyVariant = (): VariableForm => ({
  attributes: [createEmptyAttribute()],
  price: "",
  discountedPrice: "",
  stock: "",
});

const createEmptyComponent = (): BundleComponentForm => ({
  skuId: "",
  quantity: "1",
});

function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormState>({
    type: "simple",
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    stock: "",
    isPublished: true,
    imageFiles: [],
    variants: [createEmptyVariant()],
    components: [createEmptyComponent()],
  });

  const [products, setProducts] = useState<Product[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoadingProducts(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const type = event.target.value as ProductFormType;

    setForm((current) => ({
      ...current,
      type,
    }));

    setError("");
  }

  /* =========================
     IMÁGENES
  ========================= */

  function handleImageFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const newImageFiles: ImageFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setForm((current) => ({
      ...current,
      imageFiles: [...current.imageFiles, ...newImageFiles],
    }));

    event.target.value = "";
  }

  function removeImageFile(index: number) {
    setForm((current) => {
      const image = current.imageFiles[index];

      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return {
        ...current,
        imageFiles: current.imageFiles.filter(
          (_, imageIndex) => imageIndex !== index
        ),
      };
    });
  }

  /* =========================
     VARIANTES
  ========================= */

  function updateVariant(
    variantIndex: number,
    field: keyof VariableForm,
    value: string
  ) {
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

  function removeVariant(index: number) {
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

  function updateAttribute(
    variantIndex: number,
    attributeIndex: number,
    field: keyof AttributeForm,
    value: string
  ) {
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

  function addAttribute(variantIndex: number) {
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

  function removeAttribute(variantIndex: number, attributeIndex: number) {
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

  /* =========================
     COMPONENTES DEL COMBO
  ========================= */

  function updateComponent(
    componentIndex: number,
    field: keyof BundleComponentForm,
    value: string
  ) {
    setForm((current) => {
      const components = [...current.components];

      components[componentIndex] = {
        ...components[componentIndex],
        [field]: value,
      };

      return {
        ...current,
        components,
      };
    });
  }

  function addComponent() {
    setForm((current) => ({
      ...current,
      components: [...current.components, createEmptyComponent()],
    }));
  }

  function removeComponent(componentIndex: number) {
    setForm((current) => {
      if (current.components.length === 1) {
        return current;
      }

      return {
        ...current,
        components: current.components.filter(
          (_, index) => index !== componentIndex
        ),
      };
    });
  }

  function getProductForSku(skuId: string): Product | undefined {
    return products.find((product) =>
      product.skus.some((sku) => sku.id === skuId)
    );
  }

  function getSkusForProduct(productId: string): SKU[] {
    return products.find((product) => product.id === productId)?.skus || [];
  }

  function getComponentProductId(skuId: string): string {
    return getProductForSku(skuId)?.id || "";
  }

  function handleComponentProductChange(
    componentIndex: number,
    productId: string
  ) {
    const skus = getSkusForProduct(productId);

    setForm((current) => {
      const components = [...current.components];

      components[componentIndex] = {
        ...components[componentIndex],
        skuId: skus[0]?.id || "",
      };

      return {
        ...current,
        components,
      };
    });
  }

  /* =========================
     VALIDACIONES
  ========================= */

  function validateSimple(): string {
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

  function validateVariable(): string {
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

  function validateBundle(): string {
    if (!form.name.trim()) {
      return "El nombre del combo es obligatorio.";
    }

    if (form.price === "") {
      return "El precio del combo es obligatorio.";
    }

    if (Number(form.price) < 0) {
      return "El precio no puede ser negativo.";
    }

    if (!form.components.length) {
      return "El combo debe tener al menos un componente.";
    }

    for (let index = 0; index < form.components.length; index++) {
      const component = form.components[index];

      if (!component.skuId) {
        return `Seleccioná un SKU para el componente ${index + 1}.`;
      }

      if (component.quantity === "" || Number(component.quantity) <= 0) {
        return `La cantidad del componente ${index + 1} debe ser mayor a 0.`;
      }
    }

    return "";
  }

  /* =========================
     PAYLOADS
  ========================= */

  function buildSimplePayload(imageUrls: string[]): CreateSimpleProduct {
    const productData: CreateSimpleProduct = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      isPublished: form.isPublished,
      images: imageUrls,
    };

    if (form.discountedPrice !== "") {
      productData.discountedPrice = Number(form.discountedPrice);
    }

    return productData;
  }
  function buildVariablePayload(): CreateVariableProduct {
    return {
      name: form.name.trim(),
      description: form.description.trim(),
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
          return {
            ...payloadVariant,
            price: Number(variant.price),
            ...(variant.discountedPrice !== ""
              ? {
                  discountedPrice: Number(variant.discountedPrice),
                }
              : {}),
          };
        }

        return payloadVariant;
      }),
    };
  }

  function buildBundlePayload(imageUrls: string[]): CreateBundleProduct {
    const components: CreateBundleComponent[] = form.components.map(
      (component) => ({
        skuId: component.skuId,
        quantity: Number(component.quantity),
      })
    );

    return {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      isPublished: form.isPublished,
      images: imageUrls,
      components,
    };
  }
  /* =========================
     SUBMIT
  ========================= */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    let validationError = "";

    if (form.type === "simple") {
      validationError = validateSimple();
    } else if (form.type === "variable") {
      validationError = validateVariable();
    } else {
      validationError = validateBundle();
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      let productData:
        | CreateSimpleProduct
        | CreateVariableProduct
        | CreateBundleProduct;

      if (form.type === "simple") {
        const imageUrls = await Promise.all(
          form.imageFiles.map((image) => uploadProductImage(image.file))
        );

        productData = buildSimplePayload(imageUrls);
      } else if (form.type === "variable") {
        productData = buildVariablePayload();
      } else {
        const imageUrls = await Promise.all(
          form.imageFiles.map((image) => uploadProductImage(image.file))
        );

        productData = buildBundlePayload(imageUrls);
      }

      console.log("Payload enviado:", productData);

      await createProduct(productData);

      onSuccess();
    } catch (error) {
      console.error("Error al crear producto:", error);

      setError(
        error instanceof Error ? error.message : "No se pudo crear el producto."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
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
            onChange={handleTypeChange}
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
            images={form.imageFiles}
            loading={loading}
            onAdd={handleImageFilesChange}
            onRemove={removeImageFile}
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
                  onChange={handleChange}
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
                const selectedProductId = getComponentProductId(
                  component.skuId
                );

                const availableSkus = selectedProductId
                  ? getSkusForProduct(selectedProductId)
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
                          onClick={() => removeComponent(componentIndex)}
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
                            handleComponentProductChange(
                              componentIndex,
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
                            updateComponent(
                              componentIndex,
                              "skuId",
                              event.target.value
                            )
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
                            updateComponent(
                              componentIndex,
                              "quantity",
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

function getSkuLabel(sku: SKU): string {
  if (!sku.variantValues || sku.variantValues.length === 0) {
    return sku.code;
  }

  const variants = sku.variantValues
    .map(
      (variantValue) =>
        `${variantValue.variant.name}: ${variantValue.variant.value}`
    )
    .join(" / ");

  return `${sku.code} — ${variants}`;
}

interface ImageSectionProps {
  images: ImageFile[];
  loading: boolean;
  onAdd: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

function ImageSection({ images, loading, onAdd, onRemove }: ImageSectionProps) {
  return (
    <div className="form-section">
      <div className="form-section-title">
        <div>
          <h3>Imágenes</h3>

          <p>Seleccioná las imágenes del producto</p>
        </div>

        <label className="add-image-button">
          + Agregar imágenes
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onAdd}
            disabled={loading}
            hidden
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="images-empty">Todavía no agregaste imágenes.</div>
      ) : (
        <div className="images-preview-grid">
          {images.map((image, index) => (
            <div className="image-preview-card" key={image.preview}>
              <img src={image.preview} alt={`Imagen ${index + 1}`} />

              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={loading}
                className="image-remove-button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductForm;
