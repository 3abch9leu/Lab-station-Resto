import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { orderSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Public: place an order (validated, persisted when a DB is configured). */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order", issues: parsed.error.flatten() }, { status: 400 });
  }
  const o = parsed.data;
  try {
    const order = await db.order.create({
      data: {
        customer: o.name,
        phone: o.phone,
        type: o.type,
        address: o.address,
        lines: o.lines,
        total: o.total,
        status: "new",
      },
    });
    return NextResponse.json({ ok: true, id: order.id }, { status: 201 });
  } catch {
    // Demo mode (no database): accept the order so WhatsApp flow still works.
    const { randomUUID } = await import("node:crypto");
    return NextResponse.json({ ok: true, id: `demo-${randomUUID()}`, demo: true }, { status: 201 });
  }
}

/** Admin: list orders (newest first). */
export async function GET(req: Request) {
  let admin = null;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Database unavailable (demo mode)" }, { status: 503 });
  }
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));
  const orders = await db.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return NextResponse.json({ orders });
}
