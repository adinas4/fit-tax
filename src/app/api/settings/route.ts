import { NextResponse } from "next/server";
import { getSettingsObject } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSettingsObject();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json(
      { success: false, settings: null },
      { status: 500 }
    );
  }
}
