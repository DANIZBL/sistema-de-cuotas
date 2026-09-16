import type { ImageFile } from "../model/types";

interface ImageSectionProps {
    images: ImageFile[];
    disabled: boolean;
    onAdd: (files: File[]) => void;
    onRemove: (imageId: string) => void;
}

export function ImageSection({
    images,
    disabled,
    onAdd,
    onRemove,
}: ImageSectionProps) {
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
                        onChange={(event) => {
                            const files = Array.from(event.target.files ?? []);

                            if (files.length) {
                                onAdd(files);
                            }

                            event.target.value = "";
                        }}
                        disabled={disabled}
                        hidden
                    />
                </label>
            </div>

            {images.length === 0 ? (
                <div className="images-empty">Todavía no agregaste imágenes.</div>
            ) : (
                <div className="images-preview-grid">
                    {images.map((image, index) => (
                        <div className="image-preview-card" key={image.id}>
                            <img src={image.preview} alt={`Imagen ${index + 1}`} />

                            <button
                                type="button"
                                onClick={() => onRemove(image.id)}
                                disabled={disabled}
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
