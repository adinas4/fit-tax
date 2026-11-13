import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUT_DIR = "public/images/team";
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

type Job = { name: string; file: string; prompt: string };

const jobs: Job[] = [
  {
    name: "Rohmah Arsiyah",
    file: "rohmah-arsiyah.png",
    prompt:
      "Professional corporate headshot photograph of an Indonesian woman in her early 40s, founder of a tax consulting firm. She wears an elegant dark navy blazer over a cream blouse, a subtle gold necklace. Shoulder-length black hair, warm confident smile, looking directly at camera. Soft studio lighting, clean out-of-focus warm beige office background. Square framing, head and shoulders centered. Photorealistic, sharp focus, high-end corporate photography, 85mm lens, shallow depth of field.",
  },
  {
    name: "Hermawati N. Arum",
    file: "hermawati-arum.png",
    prompt:
      "Professional corporate headshot photograph of an Indonesian woman in her late 30s, senior tax and accounting partner. She wears a tailored teal blazer over a white blouse, minimal gold stud earrings. Hair tied back neatly in a low bun, approachable professional smile, looking at camera. Soft studio lighting, clean out-of-focus light grey office background. Square framing, head and shoulders centered. Photorealistic, sharp focus, high-end corporate photography, 85mm lens, shallow depth of field.",
  },
  {
    name: "Dian Ardianto",
    file: "dian-ardianto.png",
    prompt:
      "Professional corporate headshot photograph of an Indonesian man in his late 30s, tax consulting partner. He wears a charcoal grey suit with a white shirt and a deep blue tie, clean shaven, short neat black hair. Confident friendly expression, slight smile, looking at camera. Soft studio lighting, clean out-of-focus dark blue office background. Square framing, head and shoulders centered. Photorealistic, sharp focus, high-end corporate photography, 85mm lens, shallow depth of field.",
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const job of jobs) {
    const out = path.join(OUT_DIR, job.file);
    if (fs.existsSync(out)) {
      console.log(`skip (exists): ${job.file}`);
      continue;
    }
    process.stdout.write(`Generating ${job.name}... `);
    try {
      const res = await zai.images.generations.create({
        prompt: job.prompt,
        size: "1024x1024",
      });
      const b64 = res.data[0].base64;
      fs.writeFileSync(out, Buffer.from(b64, "base64"));
      console.log(`OK -> ${out}`);
    } catch (e: any) {
      console.log(`FAILED: ${e.message}`);
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
