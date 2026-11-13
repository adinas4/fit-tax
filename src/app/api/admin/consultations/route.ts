import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "";
  const where: Prisma.ConsultationRequestWhereInput = {};
  if (status && status !== "all") where.status = status;

  const items = await db.consultationRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, items });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { id, status, adminNotes } = body;
  if (!id) {
    return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  }
  const updated = await db.consultationRequest.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  });
  return NextResponse.json({ success: true, item: updated });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, message: "ID wajib" }, { status: 400 });
  }
  await db.consultationRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
