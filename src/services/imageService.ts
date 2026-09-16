import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "../lib/firebase.config";

export async function uploadProductImage(file: File): Promise<string> {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()
    : "jpg";

  const uniqueName = `${crypto.randomUUID()}.${extension}`;

  const storageRef = ref(storage, `Productos/${uniqueName}`);

  await uploadBytes(storageRef, file);

  return getDownloadURL(storageRef);
}
