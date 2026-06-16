/**
 * One-off: rasterize the JukeNFC logo mark (SVG) into the launcher icon,
 * splash icon, and adaptive-icon foreground PNGs. Run: node scripts/gen-icons.mjs
 * (sharp is installed transiently — `npm install --no-save sharp`.)
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(here, '../../app-nfc-design/logos/logo-mark.svg');
const outDir = resolve(here, '../assets/images');
const svg = readFileSync(svgPath);

const PLUM = '#15121f';
const NIGHT = '#1c1830';

async function mark(size) {
  return sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function onBackground(canvas, bg, markSize, out) {
  const m = await mark(markSize);
  const offset = Math.round((canvas - markSize) / 2);
  await sharp({ create: { width: canvas, height: canvas, channels: 4, background: bg } })
    .composite([{ input: m, top: offset, left: offset }])
    .png()
    .toFile(resolve(outDir, out));
  console.log('wrote', out);
}

async function transparent(canvas, markSize, out) {
  const m = await mark(markSize);
  const offset = Math.round((canvas - markSize) / 2);
  await sharp({ create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: m, top: offset, left: offset }])
    .png()
    .toFile(resolve(outDir, out));
  console.log('wrote', out);
}

await onBackground(1024, PLUM, 660, 'icon.png');
await transparent(512, 360, 'splash-icon.png');
await onBackground(1024, NIGHT, 560, 'android-icon-foreground.png');
await transparent(1024, 700, 'favicon.png');
console.log('done');
