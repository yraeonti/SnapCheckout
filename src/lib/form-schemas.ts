import { allowedFileTypes } from "@/static/static";
import { ORDER_STATUS } from "@prisma/client";

import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const storeItemSchema = z.object({
  item_name: z.string(),
  category: z.string(),
  item_price: z.string(),
  item_quantity: z.number(),
  image: z
    .any()
    .refine((file) => file, "Document is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => allowedFileTypes.includes(file?.type),
      "Unsupported file type. Allowed types: images, PDF, Excel, and Word documents only."
    ),
  description: z.string(),
});

export const categorySchema = z.object({
  category: z.string(),
});
export const clientSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
});

export const checkoutItemSchema = z.object({
  client_id: z.string(),
  product_id: z.string(),
  quantity: z.number(),
});

export const orderStatusSchema = z.object({
  order_id: z.string(),
  status: z.enum(["PENDING", "ONGOING", "COMPLETED", "FAILED"]),
});
