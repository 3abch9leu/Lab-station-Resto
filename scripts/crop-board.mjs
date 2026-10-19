/**
 * Crop real dish photos out of the restaurant's in-store menu board photos.
 *
 * USAGE
 *   1. Save the two board photos (as taken, full resolution) into `public/board/`:
 *        public/board/tacos-board.jpg
 *        public/board/burgers-board.jpg
 *   2. Run:  npm run photos:board
 *   3. The cropped dish photos land in `public/photos/` and the script prints the
 *      exact `data/menu.ts` image mapping to paste in.
 *
 * The board layout is a regular grid, so the crop boxes are expressed as
 * fractions of the source image (resolution independent).
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd());
const BOARD_DIR = path.join(ROOT, "public", "board");
const OUT_DIR = path.join(ROOT, "public", "photos");

// Fractions: [left, top, width, height] of the source image.
const TACOS = {
  "tacos-classic": [0.115, 0.225, 0.115, 0.16],
  "tacos-crispy": [0.355, 0.225, 0.115, 0.16],
  "tacos-super-spicy": [0.6, 0.225, 0.115, 0.16],
  "tacos-creamy-mushroom": [0.845, 0.225, 0.115, 0.16],
  "tacos-full-cheese": [0.115, 0.6, 0.115, 0.16],
  "tacos-viande-hachee": [0.365, 0.6, 0.115, 0.16],
  "tacos-brisket": [0.605, 0.6, 0.115, 0.16],
  "tacos-ribs": [0.85, 0.6, 0.115, 0.16],
};

const BURGERS = {
  "crispy-chicken": [0.075, 0.13, 0.085, 0.12],
  classic: [0.265, 0.16, 0.085, 0.12],
  double: [0.46, 0.185, 0.085, 0.12],
  triple: [0.645, 0.21, 0.085, 0.12],
  "scrambled-eggs": [0.815, 0.23, 0.085, 0.12],
  "mr-bacon": [0.11, 0.385, 0.085, 0.12],
  "texas-ribs": [0.305, 0.4, 0.085, 0.12],
  "cent-pourcent-meat": [0.54, 0.47, 0.085, 0.12],
  "brisket-lab-burger": [0.74, 0.485, 0.085, 0.12],
  "creamy-mushroom-burger": [0.055, 0.64, 0.085, 0.12],
  "monto-cinto": [0.235, 0.645, 0.085, 0.12],
  "spicy-super-spicy": [0.43, 0.66, 0.085, 0.12],
  truffle: [0.615, 0.685, 0.085, 0.12],
  "full-cheese-burger": [0.8, 0.69, 0.085, 0.12],
};

async function cropBoard(file, boxes, label) {
  const src = path.join(BOARD_DIR, file);
  if (!existsSync(src)) {
    console.log(`[skip] ${label}: ${file} not found in public/board/`);
    return [];
  }
  const img = sharp(src);
  const { width, height } = await img.metadata();
  const out = [];
  for (const [id, [l, t, w, h]] of Object.entries(boxes)) {
    const left = Math.round(l * width);
    const top = Math.round(t * height);
    const cw = Math.round(w * width);
    const ch = Math.round(h * height);
    if (cw < 20 || ch < 20) continue;
    const dest = path.join(OUT_DIR, `${id}.jpg`);
    await sharp(src)
      .extract({ left, top, width: cw, height: ch })
      .resize(900, 900, { fit: "cover", position: "attention" })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(dest);
    out.push({ id, file: `/photos/${id}.jpg` });
    console.log(`[ok] ${id} -> public/photos/${id}.jpg (${cw}x${ch} from ${width}x${height})`);
  }
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const results = [
    ...(await cropBoard("tacos-board.jpg", TACOS, "TACOS")),
    ...(await cropBoard("burgers-board.jpg", BURGERS, "BURGERS")),
  ];
  if (results.length) {
    const map = results.map((r) => `  ${r.id}: "${r.file}",`).join("\n");
    const file = path.join(OUT_DIR, "MAPPING.txt");
    await writeFile(file, `Paste into data/menu.ts (LOCAL_PHOTOS):\n\n${map}\n`, "utf8");
    console.log(`\nMapping written to public/photos/MAPPING.txt`);
  } else {
    console.log("\nNo board photos found. Put the two board JPGs in public/board/ and re-run.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
