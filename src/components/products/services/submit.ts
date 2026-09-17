import { uploadProductImage } from "../../../services/imageService"
import { ProductFormState } from "../types"
import { CreateBundleProduct, CreateSimpleProduct, CreateVariableProduct } from "../types"
import { buildBundlePayload, buildSimplePayload, buildVariablePayload } from "./payloads"
import { createProduct } from "./productService"
import { validateBundle, validateSimple, validateVariable } from "./validates"

interface Props {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string>>
    event: React.FormEvent<HTMLFormElement>
    form: ProductFormState
    onSuccess: () => void
}

export async function handleSubmit({
    event,
    setError,
    setLoading,
    form,
    onSuccess
}: Props) {
    event.preventDefault();

    setError("");

    let validationError = "";

    if (form.type === "simple") {
        validationError = validateSimple(form);
    } else if (form.type === "variable") {
        validationError = validateVariable(form);
    } else {
        validationError = validateBundle(form);
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
                form.imageFiles.map((image) => uploadProductImage(image.file as File))
            );

            productData = buildSimplePayload(imageUrls, form);
        } else if (form.type === "variable") {
            productData = buildVariablePayload(form);
        } else {
            const imageUrls = await Promise.all(
                form.imageFiles.map((image) => uploadProductImage(image.file as File))
            );

            productData = buildBundlePayload(imageUrls, form);
        }

        await createProduct(productData);

        onSuccess();
    } catch (error) {

        setError(
            error instanceof Error ? error.message : "No se pudo crear el producto."
        );
    } finally {
        setLoading(false);
    }
}