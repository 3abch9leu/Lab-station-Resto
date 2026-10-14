import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { menuPatchSchema } from "@/lib/validation";
import { toDb, toFrontend } from "@/lib/menu-map";

export const dynamic = "force-dynamic";

/** Admin: update a menu item. */
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
  try {
    const row = await db.menuItem.update({ where: { id }, data: toDb(parsed.data as Parameters<typeof toDb>[0]) });
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
