import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const items = await db.portfolioItem.findMany({ orderBy: [{ year: "desc" }, { publishedAt: "desc" }] });
  return NextResponse.json({ success: true, items });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { title, category, industry, year, challenge, approach, result, image, isExample, published } = body;
  if (!title || !category) return NextResponse.json({ success: false, message: "Judul dan kategori wajib" }, { status: 400 });
  const item = await db.portfolioItem.create({
    data: {
      title, category, industry: industry || "", year: year || String(new Date().getFullYear()),
      challenge: challenge || "", approach: approach || "", result: result || "",
      image: image || null, isExample: isExample ?? true, published: published ?? true,
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
  for (const key of ["title","category","industry","year","challenge","approach","result","image","isExample","published"]) {
    if (rest[key] !== undefined) data[key] = rest[key];
  }
  const item = await db.portfolioItem.update({ where: { id }, data });
  return NextResponse.json({ success: true, item });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  await db.portfolioItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
