import type { MenuItem as DbMenuItem } from "@prisma/client";
import type { MenuItem, MenuCategory, MenuTag, MenuSize } from "@/data/menu";

const CATEGORIES = ["burgers", "tacos", "supplements", "sides", "drinks", "desserts"] as const;

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

const asSizes = (v: unknown): MenuSize[] => {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is { label: string; price: number } =>
      !!x &&
      typeof (x as { label?: unknown }).label === "string" &&
      typeof (x as { price?: unknown }).price === "number"
    )
    .map((s) => ({ label: s.label, price: s.price }));
};

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
    sizes: asSizes(row.sizes),
    sauces: asStrings(row.sauces),
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
  sizes?: { label: string; price: number }[];
  sauces?: string[];
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
    sizes: input.sizes ?? [],
    sauces: input.sauces ?? [],
    image: input.image ?? "",
    tags: input.tags ?? [],
    spicyLevel: input.spicyLevel ?? 0,
    featured: input.featured ?? false,
    available: input.available ?? true,
    code: input.code ?? "",
    sort: input.sort ?? 0,
  };
}
