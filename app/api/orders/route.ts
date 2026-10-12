import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { orderSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Public: place an order (validated, persisted). */
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
}

/** Admin: list orders (newest first). */
export async function GET(req: Request) {
  const admin = await requireAdmin();
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
