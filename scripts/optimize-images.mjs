// Shrinks the site's photos in /public with sharp so pages load faster.
//
//   npm run images            optimise in place
//   npm run images -- --dry   only report what would change
//
// For every JPEG/PNG/WebP under public/ (logos and flags excluded):
// - resizes anything wider than MAX_WIDTH (keeps the aspect ratio),
// - re-encodes JPEGs with mozjpeg (progressive), PNGs with palette
//   compression, WebP at the same quality,
// - drops metadata (EXIF, GPS) but keeps the colour profile,
// - writes the new file only if it is smaller, under the same name, so no
//   code has to change. Safe to run again: already-optimised files are
//   left alone.
// next/image still serves sized WebP/AVIF on top of this; smaller sources
// make that faster too and help any plain <img>.

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public");
const SKIP = [/[\\/]brand[\\/]/, /[\\/]flags[\\/]/]; // logos and flags stay as they are
const MAX_WIDTH = 2000;
const QUALITY = 78;
const dry = process.argv.includes("--dry");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name) && !SKIP.some((r) => r.test(p))) yield p;
  }
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let before = 0;
let after = 0;
let changed = 0;

for await (const file of walk(ROOT)) {
  const input = await readFile(file);
  const size = (await stat(file)).size;
  before += size;

  const img = sharp(input, { failOn: "none" }).rotate(); // apply EXIF rotation, then drop EXIF
  const meta = await img.metadata();
  if ((meta.width ?? 0) > MAX_WIDTH) img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  img.keepIccProfile();

  const ext = path.extname(file).toLowerCase();
  const out =
    ext === ".png"
      ? await img.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
      : ext === ".webp"
        ? await img.webp({ quality: QUALITY }).toBuffer()
        : await img.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true }).toBuffer();

  if (out.length < size * 0.97) {
    if (!dry) await writeFile(file, out);
    after += out.length;
    changed += 1;
    console.log(`${path.relative(ROOT, file).padEnd(48)} ${kb(size).padStart(8)} → ${kb(out.length).padStart(8)}`);
  } else {
    after += size;
  }
}

console.log(
  `\n${dry ? "Would shrink" : "Shrank"} ${changed} file(s): ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB (${Math.round((1 - after / before) * 100)}% smaller)`,
);
