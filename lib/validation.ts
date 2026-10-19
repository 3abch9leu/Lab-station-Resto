import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

export const orderLineSchema = z.object({
  id: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(20),
});

export const orderSchema = z.object({
  name: z.string().max(80).default(""),
  phone: z.string().max(30).default(""),
  type: z.enum(["pickup", "delivery"]).default("pickup"),
  address: z.string().max(200).default(""),
  lines: z.array(orderLineSchema).min(1).max(30),
  total: z.number().min(0).max(100000),
});

export const orderStatusSchema = z.enum(["new", "preparing", "ready", "done", "cancelled"]);

const categorySchema = z.enum(["burgers", "tacos", "supplements", "sides", "drinks", "desserts"]);

export const menuItemSchema = z.object({
  id: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(80),
  variant: z.string().max(80).optional(),
  category: categorySchema,
  description: z.string().max(500).default(""),
  ingredients: z.array(z.string().max(80)).max(30).default([]),
  price: z.number().min(0).max(10000).nullable(),
  priceVerified: z.boolean().default(false),
  sizes: z
    .array(z.object({ label: z.string().min(1).max(10), price: z.number().min(0).max(10000) }))
    .max(5)
    .default([]),
  sauces: z.array(z.string().max(30)).max(10).default([]),
  image: z.string().max(500).default(""),
  tags: z.array(z.string().max(30)).max(10).default([]),
  spicyLevel: z.union([z.literal(0), z.literal(1), z.literal(2)]).default(0),
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
  code: z.string().max(20).default(""),
  sort: z.number().int().default(0),
});

export const menuPatchSchema = menuItemSchema.omit({ id: true }).partial();

export const settingSchema = z.object({
  key: z.enum(["hours", "promo", "restaurant"]),
  value: z.unknown(),
});
