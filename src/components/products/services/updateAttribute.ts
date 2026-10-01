import { createEmptyAttribute } from "../const";
import { AttributeForm, ProductFormState } from "../types";

interface Props {
  variantIndex: number,
  attributeIndex: number,
  field: keyof AttributeForm,
  value: string
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
}

export function updateAttribute({ attributeIndex, field, value, variantIndex, setForm }: Props) {
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

export function addAttribute({ setForm, variantIndex }: Pick<Props, "setForm" | "variantIndex">) {
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

export function removeAttribute({ attributeIndex, setForm, variantIndex }: Pick<Props, "setForm" | "variantIndex" | "attributeIndex">) {
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