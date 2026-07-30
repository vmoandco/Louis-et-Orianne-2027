/**
 * Redimensionne et encode les photos en WebP.
 *
 * Usage : node scripts/optimize-images.mjs <dossier-source> [--out public]
 *
 * Le dossier source contient les photos d'origine (pleine résolution, telles
 * qu'elles sortent du téléphone) : `histoire-*.{jpg,jpeg,png}`, `photo-*.jpg`
 * et un sous-dossier `gifts/`. Les fichiers produits gardent le même nom de
 * base, avec l'extension `.webp`.
 */
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// Largeur max selon l'usage à l'écran, en tenant compte des écrans 2x.
const RULES = [
  // Mosaïque pleine largeur : conteneur de 1200 px.
  { match: /^histoire-(20|21)\./, width: 1800, quality: 80 },
  // Photos d'histoire : cadre de ~530 px au plus.
  { match: /^histoire-/, width: 1400, quality: 80 },
  // Photos d'accueil : colonnes de 22vw sur 29vw de haut.
  { match: /^photo-/, width: 1600, quality: 82 },
];

const GIFT_RULE = { width: 700, quality: 82 };

const ruleFor = (name) => RULES.find((r) => r.match.test(name));

async function convert(src, dest, { width, quality }) {
  const info = await sharp(src)
    .rotate() // applique l'orientation EXIF avant le redimensionnement
    .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
  return info.size;
}

const [, , sourceDir, ...rest] = process.argv;
if (!sourceDir) {
  console.error("Usage : node scripts/optimize-images.mjs <dossier-source> [--out public]");
  process.exit(1);
}
const outDir = rest.includes("--out") ? rest[rest.indexOf("--out") + 1] : "public";

let total = 0;
let count = 0;

// Photos de la racine
for (const name of await readdir(sourceDir)) {
  const rule = ruleFor(name);
  if (!rule) continue;
  const base = name.replace(/\.[^.]+$/, "");
  const size = await convert(path.join(sourceDir, name), path.join(outDir, `${base}.webp`), rule);
  console.log(`  ${base}.webp  ${(size / 1024).toFixed(0)} ko`);
  total += size;
  count++;
}

// Visuels de cadeaux
const giftSrc = path.join(sourceDir, "gifts");
if (existsSync(giftSrc)) {
  await mkdir(path.join(outDir, "gifts"), { recursive: true });
  for (const name of await readdir(giftSrc)) {
    if (!/\.(jpe?g|png)$/i.test(name)) continue;
    const base = name.replace(/\.[^.]+$/, "");
    const size = await convert(path.join(giftSrc, name), path.join(outDir, "gifts", `${base}.webp`), GIFT_RULE);
    total += size;
    count++;
  }
  console.log(`  gifts/ : ${count} visuels`);
}

console.log(`\n${count} images · ${(total / 1024 / 1024).toFixed(1)} Mo au total`);
