import { PrismaClient } from "@prisma/client";
import { MENU } from "../data/menu";

const db = new PrismaClient();

async function main() {
  const rows = await db.menuItem.findMany({ select: { id: true, price: true, priceVerified: true } });
  const dbIds = new Set(rows.map((r) => r.id));
  const staticIds = new Set(MENU.map((m) => m.id));
  const orphaned = [...dbIds].filter((id) => !staticIds.has(id));
  const missing = [...staticIds].filter((id) => !dbIds.has(id));
  console.log(`[verify] db rows: ${rows.length} | static items: ${MENU.length}`);
  console.log(`[verify] orphaned in db (not in static): ${orphaned.length ? orphaned.join(", ") : "none"}`);
  console.log(`[verify] missing from db: ${missing.length ? missing.join(", ") : "none"}`);
  for (const id of ["crispy-chicken", "brisket-lab-burger", "double", "creamy-mushroom-burger", "tacos-brisket", "tacos-mr-bacon", "tacos-chicken-parm", "nashville-hot-chicken", "philly-cheesesteak", "sup-raclette", "sup-oeuf-brouille", "sup-mozza"]) {
    const r = rows.find((x) => x.id === id);
    console.log(`[verify] ${id}: ${r ? `${r.price} verified=${r.priceVerified}` : "MISSING"}`);
  }
}

main().finally(() => db.$disconnect());
