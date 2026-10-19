import { PrismaClient, Prisma } from "@prisma/client";
import { MENU } from "../data/menu";
import { HOURS } from "../data/hours";
import { RESTAURANT } from "../data/restaurant";
import { hashPassword } from "../lib/auth";
import { toDb } from "../lib/menu-map";

const db = new PrismaClient();

async function main() {
  // ---- Menu: upsert every static item (id-stable, so re-seeding is safe)
  for (const [i, item] of MENU.entries()) {
    await db.menuItem.upsert({
      where: { id: item.id },
      update: { ...toDb({ ...item, sort: i }) },
      create: { id: item.id, ...toDb({ ...item, sort: i }) },
    });
  }

  // ---- Prune items that are no longer on the restaurant's carte
  // (keeps the DB in sync with data/menu.ts after a carte change).
  const validIds = new Set(MENU.map((m) => m.id));
  const orphans = await db.menuItem.findMany({
    where: { id: { notIn: [...validIds] } },
    select: { id: true },
  });
  for (const o of orphans) {
    await db.menuItem.delete({ where: { id: o.id } });
    console.log(`[seed] removed stale item → ${o.id}`);
  }

  // ---- Settings (hours: create-only after first seed so admin edits survive reseeds)
  const hoursJson = HOURS as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({
    where: { key: "hours" },
    update: {},
    create: { key: "hours", value: hoursJson },
  });
  await db.setting.upsert({
    where: { key: "promo" },
    update: {},
    create: {
      key: "promo",
      value: { active: false, title: "", text: "" },
    },
  });
  await db.setting.upsert({
    where: { key: "restaurant" },
    update: {},
    create: {
      key: "restaurant",
      value: { rating: RESTAURANT.rating, reviewCount: RESTAURANT.reviewCount },
    },
  });

  // ---- Admin user (env or documented default; change after first login)
  const username = process.env.ADMIN_USERNAME || "labadmin";
  const password = process.env.ADMIN_PASSWORD || "lab-admin-2026";
  const existing = await db.adminUser.findUnique({ where: { username } });
  if (!existing) {
    await db.adminUser.create({
      data: { username, passwordHash: await hashPassword(password) },
    });
    console.log(`[seed] admin created → ${username}`);
  } else {
    console.log(`[seed] admin exists → ${username} (password unchanged)`);
  }

  const count = await db.menuItem.count();
  console.log(`[seed] menu items: ${count}`);
}

main()
  .catch((e) => {
    console.error("[seed] failed", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
