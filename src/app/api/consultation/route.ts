import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const consultationSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap wajib diisi").max(120),
  company: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z
    .string()
    .min(8, "Nomor WhatsApp tidak valid")
    .max(20, "Nomor WhatsApp tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
  serviceType: z.string().min(2, "Jenis layanan wajib dipilih"),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
  agreement: z.literal(true, {
    message: "Anda harus menyetujui kebijakan privasi",
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = consultationSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? "Data yang dikirim tidak valid";
      return NextResponse.json(
        { success: false, message: firstError, errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const record = await db.consultationRequest.create({
      data: {
        fullName: data.fullName.trim(),
        company: data.company?.trim() || null,
        email: data.email.trim().toLowerCase(),
        whatsapp: data.whatsapp.trim(),
        serviceType: data.serviceType,
        message: data.message.trim(),
        agreement: true,
        status: "new",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Permintaan konsultasi Anda telah kami terima. Tim FIT-TAX Cakrawala Sinergi akan menghubungi Anda segera.",
        id: record.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan pada server. Silakan coba lagi atau hubungi kami langsung melalui WhatsApp.",
      },
      { status: 500 }
    );
  }
}
