"use client";

import { useState } from "react";
import { useForm, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { COMPANY, waLink } from "@/lib/content";
import { useSettings, useWaLink } from "@/hooks/use-settings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { IS_GITHUB_PREVIEW } from "@/lib/github-preview";

const schema = z.object({
  fullName: z.string().min(2, "Nama lengkap wajib diisi"),
  company: z.string().optional(),
  email: z.string().email("Format email tidak valid"),
  whatsapp: z
    .string()
    .min(8, "Nomor WhatsApp tidak valid")
    .regex(/^[0-9+\-\s]+$/, "Hanya angka, +, -, spasi"),
  serviceType: z.string().min(2, "Jenis layanan wajib dipilih"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  agreement: z.literal(true, {
    message: "Anda harus menyetujui kebijakan privasi",
  }),
});

type FormValues = z.infer<typeof schema>;

const SERVICE_OPTIONS = [
  "Jasa Perpajakan (Compliance Tax)",
  "Pendampingan Pemeriksaan Pajak (Tax Audit)",
  "Jasa Banding & Keberatan Pajak",
  "Jasa Akuntansi",
  "In-house Training Perpajakan",
  "Lainnya",
];

export function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const settings = useSettings();
  const wa = useWaLink();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      whatsapp: "",
      serviceType: "",
      message: "",
      agreement: false as unknown as true,
    },
  });

  const agreement = useWatch({ control, name: "agreement" });
  const serviceType = useWatch({ control, name: "serviceType" });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        reset();
        toast({ title: "Permintaan terkirim", description: data.message });
      } else {
        toast({
          title: "Gagal mengirim",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Gagal mengirim",
        description: "Terjadi kesalahan jaringan. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const contact = settings.contact;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    contact.mapsQuery || COMPANY.contact.mapsQuery
  )}&output=embed`;

  const contactItems = [
    { icon: Phone, label: "Telepon", value: contact.phone, href: `tel:${contact.phone.replace(/[^0-9]/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: contact.whatsappDisplay, href: wa() },
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: "Alamat Kantor", value: contact.address, href: "#kontak" },
    { icon: Clock, label: "Jam Operasional", value: "Senin–Jumat 08.00–17.00 WIB · Sabtu 08.00–13.00 WIB" },
  ];

  return (
    <section id="kontak" className="section-pad bg-mist">
      <div className="container-x">
        <SectionHeading
          eyebrow="Hubungi Kami"
          title="Konsultasikan Kebutuhan Pajak Anda"
          description="Sampaikan kebutuhan perpajakan Anda melalui formulir di bawah ini, atau hubungi kami langsung melalui WhatsApp, telepon, dan email."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col gap-4">
              <Card className="border-0 bg-navy-gradient text-white shadow-xl">
                <CardContent className="p-7">
                  <h3 className="text-lg font-bold text-white">
                    {settings.company.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {settings.company.legalForm}
                  </p>
                  <span className="divider-gold mt-4" />
                  <ul className="mt-5 space-y-4">
                    {contactItems.map((c) => (
                      <li key={c.label} className="flex items-start gap-3">
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                          <c.icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {c.label}
                          </p>
                          {c.href ? (
                            <a
                              href={c.href}
                              target={c.href.startsWith("http") ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="text-sm text-white transition-colors hover:text-gold break-words"
                            >
                              {c.value}
                            </a>
                          ) : (
                            <p className="text-sm text-slate-200">{c.value}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                      Jam Operasional
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {COMPANY.contact.operationalHours.map((h) => (
                        <li key={h.day} className="flex items-center justify-between text-xs text-slate-200">
                          <span>{h.day}</span>
                          <span className="font-medium text-white">{h.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild className="mt-6 w-full bg-gold-gradient text-navy hover:opacity-90">
                    <a href={wa()} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat via WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex-1 overflow-hidden border border-slate-200 p-0">
                <iframe
                  title="Lokasi Kantor FIT-TAX Cakrawala Sinergi"
                  src={mapsEmbed}
                  className="h-64 w-full border-0 lg:h-full min-h-[256px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </Card>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-3">
            <Card className="h-full border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 md:p-8">
                {IS_GITHUB_PREVIEW ? (
                  <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                    <a
                      href={wa()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat via WhatsApp"
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold"
                    >
                      <MessageCircle className="h-8 w-8" />
                    </a>
                    <h3 className="mt-5 text-xl font-bold text-navy">
                      Ini adalah Preview Website
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-slate-600">
                      Formulir konsultasi tidak aktif pada preview GitHub Pages.
                      Silakan hubungi tim FIT-TAX melalui WhatsApp.
                    </p>
                    <Button asChild className="mt-6 bg-gold-gradient text-navy hover:opacity-90">
                      <a href={wa()} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat via WhatsApp
                      </a>
                    </Button>
                  </div>
                ) : submitted ? (
                  <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-navy">
                      Permintaan Konsultasi Terkirim
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-slate-600">
                      Terima kasih telah menghubungi kami. Tim CV Cakrawala Inti
                      Teknik akan segera menghubungi Anda. Untuk respon lebih
                      cepat, hubungi kami via WhatsApp.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="bg-gold-gradient text-navy hover:opacity-90">
                        <a href={wa()} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Hubungi via WhatsApp
                        </a>
                      </Button>
                      <Button variant="outline" onClick={() => setSubmitted(false)}>
                        Kirim Permintaan Lain
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Nama Lengkap" required error={errors.fullName?.message}>
                        <Input placeholder="Nama lengkap Anda" {...register("fullName")} />
                      </Field>
                      <Field label="Nama Perusahaan" hint="Opsional" error={errors.company?.message}>
                        <Input placeholder="Nama perusahaan (jika ada)" {...register("company")} />
                      </Field>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Email" required error={errors.email?.message}>
                        <Input type="email" placeholder="email@contoh.com" {...register("email")} />
                      </Field>
                      <Field label="Nomor WhatsApp" required error={errors.whatsapp?.message}>
                        <Input placeholder="08xxxxxxxxxx" {...register("whatsapp")} />
                      </Field>
                    </div>

                    <Field label="Jenis Layanan" required error={errors.serviceType?.message}>
                      <Select
                        value={(serviceType as string) || ""}
                        onValueChange={(v) => setValue("serviceType", v, { shouldValidate: true })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih jenis layanan" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label="Pesan / Kebutuhan Konsultasi" required error={errors.message?.message}>
                      <Textarea rows={5} placeholder="Jelaskan kebutuhan konsultasi perpajakan Anda..." {...register("message")} />
                    </Field>

                    <div>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-mist/40 p-3.5">
                        <Checkbox
                          checked={!!agreement}
                          onCheckedChange={(v) => setValue("agreement", v as true, { shouldValidate: true })}
                          className="mt-0.5"
                        />
                        <span className="text-xs leading-relaxed text-slate-600">
                          Saya menyetujui kebijakan privasi dan memberikan
                          persetujuan untuk dihubungi oleh tim CV Cakrawala Inti
                          Teknik terkait permintaan konsultasi ini. Data yang saya
                          sampaikan akan diperlakukan secara rahasia.
                        </span>
                      </label>
                      {errors.agreement && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                          {errors.agreement.message as string}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-navy-gradient text-white shadow-lg hover:opacity-90 disabled:opacity-60"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Kirim Permintaan Konsultasi
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-slate-500">
                      Dengan mengirim formulir ini, Anda menyetujui untuk dihubungi
                      oleh tim kami. Informasi Anda diperlakukan secara rahasia.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Tiny helper retained for compatibility (no longer used inline).

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-navy">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </Label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
