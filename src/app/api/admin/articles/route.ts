import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `art-${Date.now()}`;
}

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const items = await db.article.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json({ success: true, items });
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { title, excerpt, content, category, tags, coverImage, readingMinutes, isPopular, published, seoTitle, seoDescription } = body;
  if (!title || !excerpt || !content || !category) {
    return NextResponse.json({ success: false, message: "Field wajib belum lengkap" }, { status: 400 });
  }
  const slug = body.slug ? slugify(body.slug) : slugify(title);
  const item = await db.article.create({
    data: {
      title, slug, excerpt, content, category,
      tags: tags || "",
      coverImage: coverImage || null,
      readingMinutes: readingMinutes || 4,
      isPopular: isPopular ?? false,
      published: published ?? true,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      author: "Tim FIT-TAX Cakrawala Sinergi",
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
  for (const key of ["title","excerpt","content","category","tags","coverImage","readingMinutes","isPopular","published","seoTitle","seoDescription"]) {
    if (rest[key] !== undefined) data[key] = rest[key];
  }
  const item = await db.article.update({ where: { id }, data });
  return NextResponse.json({ success: true, item });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  await db.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
