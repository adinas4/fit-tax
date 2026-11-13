import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const items = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ success: true, items });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { clientName, company, role, message, rating, approved } = body;
  if (!clientName || !message) return NextResponse.json({ success: false, message: "Nama dan pesan wajib" }, { status: 400 });
  const item = await db.testimonial.create({
    data: {
      clientName, company: company || null, role: role || null,
      message, rating: rating || 5, approved: approved ?? false,
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
  for (const key of ["clientName","company","role","message","rating","approved"]) {
    if (rest[key] !== undefined) data[key] = rest[key];
  }
  const item = await db.testimonial.update({ where: { id }, data });
  return NextResponse.json({ success: true, item });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  await db.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
