import type {
    AttributeForm,
    BundleComponentForm,
    ImageFile,
    ProductFormState,
    VariantForm,
} from "./types";

const uid = () => crypto.randomUUID();

export const createEmptyAttribute = (): AttributeForm => ({
    id: uid(),
    name: "",
    value: "",
});

export const createEmptyVariant = (): VariantForm => ({
    id: uid(),
    attributes: [createEmptyAttribute()],
    price: "",
    discountedPrice: "",
    stock: "",
});

export const createEmptyComponent = (): BundleComponentForm => ({
    id: uid(),
    productId: "",
    skuId: "",
    quantity: "1",
});

export const createImageFile = (file: File): ImageFile => ({
    id: uid(),
    file,
    preview: URL.createObjectURL(file),
});

export const createEmptyProductForm = (): ProductFormState => ({
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
