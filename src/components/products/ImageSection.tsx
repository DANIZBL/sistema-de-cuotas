import { ImageFile, ProductFormState } from "./types";

interface ImageSectionProps {
    images: ImageFile[];
    loading: boolean;
    onAdd: (event: React.ChangeEvent<HTMLInputElement>, setForm: React.Dispatch<React.SetStateAction<ProductFormState>>) => void;
    onRemove: (index: number, setForm: React.Dispatch<React.SetStateAction<ProductFormState>>) => void;
    setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
}

export function ImageSection({ images, loading, onAdd, onRemove, setForm }: ImageSectionProps) {
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
                        onChange={(event) => onAdd(event, setForm)}
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
                                onClick={() => onRemove(index, setForm)}
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