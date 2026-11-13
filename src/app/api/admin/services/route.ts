import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `svc-${Date.now()}`;
}

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const items = await db.service.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({
    success: true,
    items: items.map((s) => ({
      ...s,
      benefits: JSON.parse(s.benefits || "[]"),
      details: JSON.parse(s.details || "[]"),
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { name, short, benefits, details, iconName, position, published } = body;
  if (!name || !short) return NextResponse.json({ success: false, message: "Nama dan deskripsi wajib" }, { status: 400 });
  const slug = body.slug ? slugify(body.slug) : slugify(name);
  const item = await db.service.create({
    data: {
      name,
      slug,
      short,
      benefits: JSON.stringify(benefits || []),
      details: JSON.stringify(details || []),
      iconName: iconName || "ClipboardCheck",
      position: position || 0,
      published: published ?? true,
    },
  });
  return NextResponse.json({ success: true, item }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { id, ...rest } = body;
  if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  const data: any = {};
  if (rest.name !== undefined) data.name = rest.name;
  if (rest.short !== undefined) data.short = rest.short;
  if (rest.benefits !== undefined) data.benefits = JSON.stringify(rest.benefits);
  if (rest.details !== undefined) data.details = JSON.stringify(rest.details);
  if (rest.iconName !== undefined) data.iconName = rest.iconName;
  if (rest.position !== undefined) data.position = rest.position;
  if (rest.published !== undefined) data.published = rest.published;
  const item = await db.service.update({ where: { id }, data });
  return NextResponse.json({ success: true, item });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  await db.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
