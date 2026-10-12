import type { MenuItem as DbMenuItem } from "@prisma/client";
import type { MenuItem, MenuCategory, MenuTag } from "@/data/menu";

const CATEGORIES = ["burgers", "tacos", "supplements", "sides", "drinks", "desserts"] as const;

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

/** Prisma row → frontend MenuItem (safe against malformed JSON). */
export function toFrontend(row: DbMenuItem): MenuItem {
  const category = (CATEGORIES as readonly string[]).includes(row.category)
    ? (row.category as MenuCategory)
    : "burgers";
  const spicy = row.spicyLevel === 1 || row.spicyLevel === 2 ? row.spicyLevel : 0;
  return {
    id: row.id,
    name: row.name,
    variant: row.variant ?? undefined,
    category,
    description: row.description,
    ingredients: asStrings(row.ingredients),
    price: row.price,
    priceVerified: row.priceVerified,
    image: row.image,
    tags: asStrings(row.tags) as MenuTag[],
    spicyLevel: spicy as 0 | 1 | 2,
    featured: row.featured,
    available: row.available,
    code: row.code,
  };
}

/** Frontend/validated payload → Prisma create/update data. */
export function toDb(input: {
  name: string;
  variant?: string;
  category: string;
  description?: string;
  ingredients?: string[];
  price?: number | null;
  priceVerified?: boolean;
  image?: string;
  tags?: string[];
  spicyLevel?: number;
  featured?: boolean;
  available?: boolean;
  code?: string;
  sort?: number;
}) {
  return {
    name: input.name,
    variant: input.variant ?? null,
    category: input.category,
    description: input.description ?? "",
    ingredients: input.ingredients ?? [],
    price: input.price ?? null,
    priceVerified: input.priceVerified ?? false,
    image: input.image ?? "",
    tags: input.tags ?? [],
    spicyLevel: input.spicyLevel ?? 0,
    featured: input.featured ?? false,
    available: input.available ?? true,
    code: input.code ?? "",
    sort: input.sort ?? 0,
  };
}
