import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { settingSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Public safe subset: hours, promo, restaurant rating. */
export async function GET() {
  const rows = await db.setting.findMany({
    where: { key: { in: ["hours", "promo", "restaurant"] } },
  });
  const map: Record<string, unknown> = {};
  for (const r of rows) map[r.key] = r.value;
  return NextResponse.json(map, { headers: { "Cache-Control": "public, max-age=60" } });
}

/** Admin: upsert a setting. */
export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = settingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid setting" }, { status: 400 });
  const value = (parsed.data.value ?? {}) as Prisma.InputJsonValue;
  const row = await db.setting.upsert({
    where: { key: parsed.data.key },
    update: { value },
    create: { key: parsed.data.key, value },
  });
  return NextResponse.json({ ok: true, key: row.key });
}
