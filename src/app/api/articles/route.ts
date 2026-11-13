import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "recent"; // recent | popular
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const where: Prisma.ArticleWhereInput = {};
    if (category && category !== "Semua") {
      where.category = category;
    }
    if (search.trim()) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const orderBy =
      sort === "popular"
        ? [{ isPopular: "desc" as const }, { publishedAt: "desc" as const }]
        : { publishedAt: "desc" as const };

    const articles = await db.article.findMany({
      where,
      orderBy,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        coverImage: true,
        author: true,
        readingMinutes: true,
        isPopular: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, count: articles.length, articles });
  } catch (error) {
    console.error("Articles list error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat artikel" },
      { status: 500 }
    );
  }
}
