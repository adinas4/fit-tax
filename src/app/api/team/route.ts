import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const team = await db.teamMember.findMany({
      where: { published: true },
      orderBy: { position: "asc" },
    });
    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error("Team list error:", error);
    return NextResponse.json(
      { success: false, team: [] },
      { status: 500 }
    );
  }
}
