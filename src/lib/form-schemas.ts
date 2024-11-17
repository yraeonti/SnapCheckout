"use client";
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
  location: z.string(),
});
export const clientLinkSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  location: z.string(),
  client_link: z.string(),
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

export const brandFormSchema = z.object({
  brand_name: z
    .string()
    .min(2, { message: "Brand name must be at least 2 characters" })
    .max(50, { message: "Brand name must be less than 50 characters" }),
  brand_logo: z
    .any()
    .refine((file) => file, "Document is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => allowedFileTypes.includes(file?.type),
      "Unsupported file type. Allowed types: images, PDF, Excel, and Word documents only."
    ),
});

export const socialsFormSchema = z.object({
  instagram: z
    .string()
    .url("Please enter a valid URL")
    .regex(
      /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-_\.]+)/i,
      "Please enter a valid Instagram URL"
    )
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Please enter a valid URL")
    .regex(
      /(?:(?:http|https):\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9-_\.]+)/i,
      "Please enter a valid Twitter URL"
    )
    .optional()
    .or(z.literal("")),
  facebook: z
    .string()
    .url("Please enter a valid URL")
    .regex(
      /(?:(?:http|https):\/\/)?(?:www\.)?facebook\.com\/([A-Za-z0-9-_\.]+)/i,
      "Please enter a valid Facebook URL"
    )
    .optional()
    .or(z.literal("")),
});

export const bankFormSchema = z.object({
  account_name: z
    .string()
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name must be less than 100 characters"),
  account_number: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .max(20, "Account number must be less than 20 digits")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  bank_name: z.string().min(2, "Bank name must be at least 2 characters"),
});
