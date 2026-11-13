import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const items = await db.teamMember.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ success: true, items });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { name, role, credentials, bio, photoUrl, position, published } = body;
  if (!name || !role) return NextResponse.json({ success: false, message: "Nama dan peran wajib" }, { status: 400 });
  const item = await db.teamMember.create({
    data: {
      name, role,
      credentials: credentials || null,
      bio: bio || null,
      photoUrl: photoUrl || null,
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
  for (const key of ["name","role","credentials","bio","photoUrl","position","published"]) {
    if (rest[key] !== undefined) data[key] = rest[key];
  }
  const item = await db.teamMember.update({ where: { id }, data });
  return NextResponse.json({ success: true, item });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  await db.teamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
