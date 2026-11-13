import sharp from "sharp";

// The uploaded logo: white background, navy text + gold "x" accent + gold underline.
// We produce two transparent-background variants:
//
//  - logo-dark.png : keeps the ORIGINAL colors (navy text + gold x) — for LIGHT backgrounds
//  - logo-light.png: navy text → WHITE, gold accents (the "x" + underline) STAY GOLD — for DARK backgrounds
//
// The light variant preserves the signature golden "x" so the brand accent
// remains visible on navy/dark headers (instead of becoming all-white).

const SRC = "upload/pasted_image_1794302828935.png";

// Classify a pixel as "gold" (yellow-ish) vs "navy" (blue-ish / dark).
// Gold ~ (212,175,55):  R high, R > G > B,  R - B large.
// Navy ~ (16,42,67):    R low,  B > G > R.
function isGold(r: number, g: number, b: number): boolean {
  return r > 130 && r - b > 70 && r > g;
}

async function main() {
  const raw = await sharp(SRC)
    .flatten({ background: "#ffffff" })
    .resize({ width: 480, withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = raw;
  const w = info.width;
  const h = info.height;

  const dark = Buffer.alloc(w * h * 4); // RGBA — original colors
  const light = Buffer.alloc(w * h * 4); // RGBA — navy→white, gold stays

  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    const min = Math.min(r, g, b);

    // alpha: white(255) -> 0 (transparent background), dark/gold -> opaque
    let a = 255 - min;
    a = Math.min(255, Math.round(a * 1.08));

    // --- dark variant: keep original RGB ---
    dark[i * 4] = r;
    dark[i * 4 + 1] = g;
    dark[i * 4 + 2] = b;
    dark[i * 4 + 3] = a;

    // --- light variant: gold stays gold, everything else becomes white ---
    if (a > 8 && isGold(r, g, b)) {
      // Keep the gold accent (slightly boosted for contrast on navy).
      light[i * 4] = Math.min(255, Math.round(r * 1.0));
      light[i * 4 + 1] = Math.min(255, Math.round(g * 1.0));
      light[i * 4 + 2] = Math.min(255, Math.round(b * 1.0));
      light[i * 4 + 3] = a;
    } else {
      light[i * 4] = 255;
      light[i * 4 + 1] = 255;
      light[i * 4 + 2] = 255;
      light[i * 4 + 3] = a;
    }
  }

  await sharp(dark, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile("public/images/logo-dark.png");

  await sharp(light, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile("public/images/logo-light.png");

  console.log("Done. Wrote logo-dark.png and logo-light.png", w, "x", h);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
