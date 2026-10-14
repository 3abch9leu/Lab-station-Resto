import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toFrontend } from "@/lib/menu-map";
import { MENU } from "@/data/menu";

export const dynamic = "force-dynamic";

/** Public menu — DB first, verified static data as demo fallback (no DB configured). */
export async function GET() {
  try {
    const rows = await db.menuItem.findMany({
      where: { available: true },
      orderBy: [{ sort: "asc" }, { name: "asc" }],
    });
    if (rows.length > 0) {
      return NextResponse.json(
        { items: rows.map(toFrontend), updatedAt: new Date().toISOString(), source: "db" },
        { headers: { "Cache-Control": "public, max-age=60" } }
      );
    }
  } catch {}
  return NextResponse.json(
    { items: MENU.filter((m) => m.available), updatedAt: new Date().toISOString(), source: "static" },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
}
