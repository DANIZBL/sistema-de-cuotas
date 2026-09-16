import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { uploadProductImage } from "../../../services/imageService";
import { createProduct } from "../api/products.api";
import * as actions from "../model/formActions";
import { createEmptyProductForm } from "../model/factories";
import { buildProductPayload, formNeedsImageUpload } from "../model/payloads";
import { validateProductForm } from "../model/validate";
import type { AttributeForm, Product, ProductTextField, ProductType } from "../model/types";

interface Options {
    products: Product[];
    onSuccess: () => void;
}

export function useProductForm({ products, onSuccess }: Options) {
    const [form, setForm] = useState(createEmptyProductForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const imageFilesRef = useRef(form.imageFiles);

    useEffect(() => {
        imageFilesRef.current = form.imageFiles;
    }, [form.imageFiles]);

    useEffect(
        () => () => {
            for (const image of imageFilesRef.current) {
                URL.revokeObjectURL(image.preview);
            }
        },
        []
    );

    async function submit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");

        const validationError = validateProductForm(form);

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const imageUrls = formNeedsImageUpload(form)
                ? await Promise.all(
                    form.imageFiles.map((image) => uploadProductImage(image.file))
                )
                : [];

            await createProduct(buildProductPayload(form, imageUrls));

            onSuccess();
        } catch (cause) {
            console.error("Error al crear producto:", cause);

            setError(
                cause instanceof Error
                    ? cause.message
                    : "No se pudo crear el producto."
            );
        } finally {
            setLoading(false);
        }
    }

    return {
        form,
        loading,
        error,

        setTextField: (field: ProductTextField, value: string) =>
            setForm((current) => actions.setTextField(current, field, value)),

        setType: (type: ProductType) => {
            setError("");
            setForm((current) => actions.setType(current, type));
        },

        setPublished: (isPublished: boolean) =>
            setForm((current) => actions.setPublished(current, isPublished)),

        addImages: (files: File[]) =>
            setForm((current) => actions.addImages(current, files)),

        removeImage: (imageId: string) => {
            const image = form.imageFiles.find((item) => item.id === imageId);

            if (image) {
                URL.revokeObjectURL(image.preview);
            }

            setForm((current) => actions.removeImage(current, imageId));
        },

        addVariant: () => setForm(actions.addVariant),

        removeVariant: (variantId: string) =>
            setForm((current) => actions.removeVariant(current, variantId)),

        updateVariant: (
            variantId: string,
            field: "price" | "discountedPrice" | "stock",
            value: string
        ) => setForm((current) => actions.updateVariant(current, variantId, field, value)),

        addAttribute: (variantId: string) =>
            setForm((current) => actions.addAttribute(current, variantId)),

        removeAttribute: (variantId: string, attributeId: string) =>
            setForm((current) => actions.removeAttribute(current, variantId, attributeId)),

        updateAttribute: (
            variantId: string,
            attributeId: string,
            field: keyof Omit<AttributeForm, "id">,
            value: string
        ) =>
            setForm((current) =>
                actions.updateAttribute(current, variantId, attributeId, field, value)
            ),

        addComponent: () => setForm(actions.addComponent),

        removeComponent: (componentId: string) =>
            setForm((current) => actions.removeComponent(current, componentId)),

        updateComponentQuantity: (componentId: string, quantity: string) =>
            setForm((current) =>
                actions.updateComponent(current, componentId, "quantity", quantity)
            ),

        updateComponentSku: (componentId: string, skuId: string) =>
            setForm((current) =>
                actions.updateComponent(current, componentId, "skuId", skuId)
            ),

        selectComponentProduct: (componentId: string, productId: string) =>
            setForm((current) =>
                actions.selectComponentProduct(current, componentId, productId, products)
            ),

        submit,
    };
}
