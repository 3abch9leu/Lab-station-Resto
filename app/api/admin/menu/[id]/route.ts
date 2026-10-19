import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { menuPatchSchema } from "@/lib/validation";
import { toFrontend } from "@/lib/menu-map";

export const dynamic = "force-dynamic";

/** Admin: update a menu item (partial — only the provided fields change). */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  let admin = null;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Database unavailable (demo mode)" }, { status: 503 });
  }
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = menuPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid patch", issues: parsed.error.flatten() }, { status: 400 });
  }

  // Only update the keys actually present in the request body.
  // NOTE: we must NOT rely on the parsed object for this — zod's `.partial()`
  // still fills in each field's `.default()` value, which would wipe
  // sizes/sauces/ingredients on a simple price update.
  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const FIELDS: Record<string, string> = {
    name: "name",
    variant: "variant",
    category: "category",
    description: "description",
    ingredients: "ingredients",
    price: "price",
    priceVerified: "priceVerified",
    sizes: "sizes",
    sauces: "sauces",
    image: "image",
    tags: "tags",
    spicyLevel: "spicyLevel",
    featured: "featured",
    available: "available",
    code: "code",
    sort: "sort",
  };
  const data: Record<string, unknown> = {};
  for (const [key, column] of Object.entries(FIELDS)) {
    if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
    const v = raw[key];
    if (v === undefined) continue;
    data[column] = v === "" && column === "variant" ? null : v;
  }

  try {
    const row = await db.menuItem.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item: toFrontend(row) });
  } catch {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}

/** Admin: delete a menu item. */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  let admin = null;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Database unavailable (demo mode)" }, { status: 503 });
  }
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    await db.menuItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}
