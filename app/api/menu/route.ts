import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toFrontend } from "@/lib/menu-map";

export const dynamic = "force-dynamic";

/** Public menu — only available items, stable sort order. */
export async function GET() {
  const rows = await db.menuItem.findMany({
    where: { available: true },
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(
    { items: rows.map(toFrontend), updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
}
