import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { settingSchema } from "@/lib/validation";
import { HOURS } from "@/data/hours";
import { RESTAURANT } from "@/data/restaurant";

export const dynamic = "force-dynamic";

/** Public safe subset: hours, promo, restaurant rating (static defaults in demo mode). */
export async function GET() {
  try {
    const rows = await db.setting.findMany({
      where: { key: { in: ["hours", "promo", "restaurant"] } },
    });
    if (rows.length > 0) {
      const map: Record<string, unknown> = {};
      for (const r of rows) map[r.key] = r.value;
      return NextResponse.json(map, { headers: { "Cache-Control": "public, max-age=60" } });
    }
  } catch {}
  return NextResponse.json(
    {
      hours: HOURS,
      promo: { active: false, title: "", text: "" },
      restaurant: { rating: RESTAURANT.rating, reviewCount: RESTAURANT.reviewCount },
    },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
}

/** Admin: upsert a setting. */
export async function PUT(req: Request) {
  let admin = null;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Database unavailable (demo mode)" }, { status: 503 });
  }
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
