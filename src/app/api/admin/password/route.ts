import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
});

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 }
    );
  }
  const user = await db.adminUser.findUnique({ where: { id: session.user.id } });
  if (!user || !verifyPassword(parsed.data.currentPassword, user.passwordHash)) {
    return NextResponse.json(
      { success: false, message: "Password saat ini salah" },
      { status: 400 }
    );
  }
  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: hashPassword(parsed.data.newPassword) },
  });
  return NextResponse.json({ success: true, message: "Password berhasil diubah" });
}
