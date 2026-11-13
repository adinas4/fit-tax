import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const services = await db.service.findMany({
      where: { published: true },
      orderBy: { position: "asc" },
    });
    const mapped = services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      short: s.short,
      benefits: JSON.parse(s.benefits || "[]") as string[],
      details: JSON.parse(s.details || "[]") as string[],
      iconName: s.iconName,
    }));
    return NextResponse.json({ success: true, services: mapped });
  } catch (error) {
    console.error("Services list error:", error);
    return NextResponse.json(
      { success: false, services: [] },
      { status: 500 }
    );
  }
}
