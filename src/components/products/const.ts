import { AttributeForm, BundleComponentForm, VariableForm } from "./types";

export const createEmptyAttribute = (): AttributeForm => ({
    name: "",
    value: "",
});

export const createEmptyVariant = (): VariableForm => ({
    attributes: [createEmptyAttribute()],
    price: "",
    discountedPrice: "",
    stock: "",
    battery: "",
    condition: "",
});

export const createEmptyComponent = (): BundleComponentForm => ({
    skuId: "",
    quantity: "1",
});