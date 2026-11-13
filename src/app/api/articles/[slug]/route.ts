import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await db.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    const related = await db.article.findMany({
      where: {
        category: article.category,
        slug: { not: slug },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        readingMinutes: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({ success: true, article, related });
  } catch (error) {
    console.error("Article detail error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat artikel" },
      { status: 500 }
    );
  }
}
