import { ImageFile, ProductFormState } from "../types";

export function handleImageFilesChange(event: React.ChangeEvent<HTMLInputElement>, setForm: React.Dispatch<React.SetStateAction<ProductFormState>>) {
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

export function removeImageFile(index: number, setForm: React.Dispatch<React.SetStateAction<ProductFormState>>) {
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