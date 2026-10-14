import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { orderStatusSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Admin: update order status. */
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
  const status = orderStatusSchema.safeParse((body as { status?: unknown })?.status);
  if (!status.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  try {
    const order = await db.order.update({ where: { id }, data: { status: status.data } });
    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
