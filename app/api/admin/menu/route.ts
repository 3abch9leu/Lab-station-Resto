import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { menuItemSchema } from "@/lib/validation";
import { toDb, toFrontend } from "@/lib/menu-map";

export const dynamic = "force-dynamic";

/** Admin: full menu including unavailable items. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.menuItem.findMany({ orderBy: [{ sort: "asc" }, { name: "asc" }] });
  return NextResponse.json({ items: rows.map(toFrontend) });
}

/** Admin: create a menu item. */
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = menuItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid item", issues: parsed.error.flatten() }, { status: 400 });
  }
  const exists = await db.menuItem.findUnique({ where: { id: parsed.data.id } });
  if (exists) return NextResponse.json({ error: "ID already exists" }, { status: 409 });
  const row = await db.menuItem.create({
    data: { id: parsed.data.id, ...toDb(parsed.data) },
  });
  return NextResponse.json({ ok: true, item: toFrontend(row) }, { status: 201 });
}
