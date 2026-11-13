import sharp from "sharp";

// Build a square favicon from the new FIT-TAX logo:
// crop the distinctive golden stylised "x" from the end of the wordmark and
// place it on a navy rounded-square background.

const NAVY = "#102A43";

async function main() {
  const logo = sharp("public/images/logo-dark.png");
  const meta = await logo.metadata();
  const W = meta.width!;
  const H = meta.height!;

  // The wordmark "Fit-tax" sits in the upper band; the subtitle
  // "CAKRAWALA SINERGI" is in the lower band. Crop only the upper band's
  // rightmost portion to isolate the golden stylised "x".
  const bandTop = 6;
  const bandH = 48; // wordmark band only (avoid subtitle)
  const cropW = 78; // just the "x"
  const cropX = W - cropW - 30;

  const xMark = await logo
    .extract({ left: cropX, top: bandTop, width: cropW, height: bandH })
    .toBuffer();

  // Scale the "x" crop so it fits within the 128px square with margin.
  const targetH = 66;
  const scaledW = Math.round((cropW / bandH) * targetH); // ~107px, fits within 128

  const bg = await sharp({
    create: {
      width: 128,
      height: 128,
      channels: 4,
      background: NAVY,
    },
  })
    .png()
    .toBuffer();

  const out = await sharp(bg)
    .composite([
      {
        input: await sharp(xMark)
          .resize({ width: scaledW, height: targetH, fit: "fill" })
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();

  await sharp(out).toFile("public/favicon.png");
  console.log("favicon written", { W, H, cropX, cropW, scaledW });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
