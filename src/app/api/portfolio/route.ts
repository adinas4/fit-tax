import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";

    const where: Prisma.PortfolioItemWhereInput = {};
    if (category && category !== "Semua") {
      where.category = category;
    }

    const items = await db.portfolioItem.findMany({
      where,
      orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
    });

    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error("Portfolio list error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat portofolio" },
      { status: 500 }
    );
  }
}
