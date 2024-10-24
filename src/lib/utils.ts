import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import mime from "mime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = async (file: Blob | null) => {
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const mimeType = mime.getExtension(file.type);
    return buffer.length > 0
      ? `data:image/${mimeType};base64,${buffer.toString("base64")}`
      : null;
  }
  return null;
};

export const cloudinary_options = {
  folder: "snap-checkout",
  use_asset_folder_as_public_id_prefix: false,
};
