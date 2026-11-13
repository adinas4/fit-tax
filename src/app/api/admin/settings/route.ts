import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getSettingsObject, updateSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS } from "@/lib/settings";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const settings = await getSettingsObject();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const flat: Record<string, string> = {};
  flat["company.name"] = body.company?.name ?? DEFAULT_SETTINGS["company.name"];
  flat["company.shortName"] = body.company?.shortName ?? DEFAULT_SETTINGS["company.shortName"];
  flat["company.tagline"] = body.company?.tagline ?? DEFAULT_SETTINGS["company.tagline"];
  flat["company.legalForm"] = body.company?.legalForm ?? DEFAULT_SETTINGS["company.legalForm"];
  flat["company.description"] = body.company?.description ?? DEFAULT_SETTINGS["company.description"];
  flat["contact.phone"] = body.contact?.phone ?? DEFAULT_SETTINGS["contact.phone"];
  flat["contact.whatsappDisplay"] = body.contact?.whatsappDisplay ?? DEFAULT_SETTINGS["contact.whatsappDisplay"];
  flat["contact.whatsappNumber"] = body.contact?.whatsappNumber ?? DEFAULT_SETTINGS["contact.whatsappNumber"];
  flat["contact.email"] = body.contact?.email ?? DEFAULT_SETTINGS["contact.email"];
  flat["contact.address"] = body.contact?.address ?? DEFAULT_SETTINGS["contact.address"];
  flat["contact.addressShort"] = body.contact?.addressShort ?? DEFAULT_SETTINGS["contact.addressShort"];
  flat["contact.mapsQuery"] = body.contact?.mapsQuery ?? DEFAULT_SETTINGS["contact.mapsQuery"];
  flat["social.facebook"] = body.social?.facebook ?? "";
  flat["social.instagram"] = body.social?.instagram ?? "";
  flat["social.linkedin"] = body.social?.linkedin ?? "";
  flat["seo.title"] = body.seo?.title ?? DEFAULT_SETTINGS["seo.title"];
  flat["seo.description"] = body.seo?.description ?? DEFAULT_SETTINGS["seo.description"];
  flat["seo.ogImage"] = body.seo?.ogImage ?? "";

  await updateSettings(flat);
  return NextResponse.json({ success: true, message: "Pengaturan disimpan" });
}
