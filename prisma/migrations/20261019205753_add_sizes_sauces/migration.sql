-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "variant" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "ingredients" JSONB NOT NULL DEFAULT [],
    "price" REAL,
    "priceVerified" BOOLEAN NOT NULL DEFAULT false,
    "sizes" JSONB NOT NULL DEFAULT [],
    "sauces" JSONB NOT NULL DEFAULT [],
    "image" TEXT NOT NULL DEFAULT '',
    "tags" JSONB NOT NULL DEFAULT [],
    "spicyLevel" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "code" TEXT NOT NULL DEFAULT '',
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MenuItem" ("available", "category", "code", "createdAt", "description", "featured", "id", "image", "ingredients", "name", "price", "priceVerified", "sort", "spicyLevel", "tags", "updatedAt", "variant") SELECT "available", "category", "code", "createdAt", "description", "featured", "id", "image", "ingredients", "name", "price", "priceVerified", "sort", "spicyLevel", "tags", "updatedAt", "variant" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
