import { db } from "@/lib/db";

// Default settings — used when DB has no value yet.
// These mirror content.ts so the public site works out of the box.
export const DEFAULT_SETTINGS: Record<string, string> = {
  "company.name": "FIT-TAX Cakrawala Sinergi",
  "company.shortName": "FIT-TAX",
  "company.tagline": "Konsultan Pajak Profesional, Aman, Cepat, dan Transparan.",
  "company.legalForm": "Jasa Konsultan Pajak dan Akuntansi",
  "company.description":
    "FIT-TAX Cakrawala Sinergi adalah konsultan pajak yang berpengalaman dalam perpajakan dan akuntansi. Dengan jaringan partner yang tersebar di berbagai kota di Indonesia, kami berkomitmen memberikan layanan perpajakan yang profesional, aman, cepat, dan transparan. Kami percaya bahwa kepercayaan klien adalah aset terbesar kami. Dengan dukungan tim konsultan pajak yang berpengalaman, kami siap memberikan solusi perpajakan terbaik yang sesuai dengan kebutuhan Anda.",
  "contact.phone": "024-3583379",
  "contact.whatsappDisplay": "+62 812 1317 5541",
  "contact.whatsappNumber": "6281213175541",
  "contact.email": "Fittaxcakrawalasinergi@gmail.com",
  // Address is intentionally kept as the existing Semarang address per user instruction.
  "contact.address": "Jl. Dokter Cipto No. 20 Bugangan, Kota Semarang, Provinsi Jawa Tengah 50126",
  "contact.addressShort": "Semarang, Jawa Tengah",
  "contact.mapsQuery": "Jl. Dokter Cipto No. 20 Bugangan Semarang Jawa Tengah",
  "social.facebook": "",
  "social.instagram": "",
  "social.linkedin": "",
  "seo.title": "FIT-TAX Cakrawala Sinergi | Konsultan Pajak Profesional",
  "seo.description":
    "FIT-TAX Cakrawala Sinergi — konsultan pajak profesional. Layanan compliance tax, pendampingan pemeriksaan pajak, banding & keberatan, jasa akuntansi, dan in-house training perpajakan.",
  "seo.ogImage": "",
};

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.siteSetting.findMany();
  const merged: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    merged[row.key] = row.value;
  }
  return merged;
}

export async function getSetting(key: string): Promise<string> {
  const row = await db.siteSetting.findUnique({ where: { key } });
  return row?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

export async function updateSettings(updates: Record<string, string>) {
  const operations = Object.entries(updates).map(([key, value]) =>
    db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
  );
  await Promise.all(operations);
}

export async function getSettingsObject() {
  const s = await getSettings();
  return {
    company: {
      name: s["company.name"],
      shortName: s["company.shortName"],
      tagline: s["company.tagline"],
      legalForm: s["company.legalForm"],
      description: s["company.description"],
    },
    contact: {
      phone: s["contact.phone"],
      whatsappDisplay: s["contact.whatsappDisplay"],
      whatsappNumber: s["contact.whatsappNumber"],
      email: s["contact.email"],
      address: s["contact.address"],
      addressShort: s["contact.addressShort"],
      mapsQuery: s["contact.mapsQuery"],
    },
    social: {
      facebook: s["social.facebook"],
      instagram: s["social.instagram"],
      linkedin: s["social.linkedin"],
    },
    seo: {
      title: s["seo.title"],
      description: s["seo.description"],
      ogImage: s["seo.ogImage"],
    },
  };
}
