import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import mime from "mime";
import crypto from "crypto";

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

export function generateHash(
  email: string,
  userId: string,
  timestamp: Date,
  length = 32
) {
  // Concatenate inputs into a single string
  const input = `${email}:${userId}:${timestamp.toISOString()}`;

  // Generate a SHA-256 hash of the input
  const hash = crypto.createHash("sha256").update(input).digest("hex");

  // Return a fixed-length substring of the hash (between 8 and 20 characters)
  return { hash, short_hash: hash.slice(0, length) };
}

export const cloudinary_options = {
  folder: "snap-checkout",
  use_asset_folder_as_public_id_prefix: false,
};

export const formatAmount = (amount: number): string => {
  const positiveAmount = Math.abs(amount);

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return formatter.format(positiveAmount);
};
