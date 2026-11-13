"use client";

import { Eye, Target, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { COMPANY, VISION, MISSION } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/card";
import { previewAsset } from "@/lib/github-preview";

const COMPETENCIES = [
  {
    icon: BadgeCheck,
    title: "Kepatuhan Regulasi",
    desc: "Pendekatan kerja yang mengedepankan kepatuhan terhadap peraturan perundang-undangan perpajakan yang berlaku.",
  },
  {
    icon: ShieldCheck,
    title: "Kerahasiaan Klien",
    desc: "Informasi dan data klien diperlakukan secara rahasia serta dikelola sesuai komitmen menjaga kepercayaan.",
  },
  {
    icon: Sparkles,
    title: "Pendekatan Terstruktur",
    desc: "Setiap penanganan dilakukan dengan metode yang sistematis dan disesuaikan dengan profil Wajib Pajak.",
  },
];

export function About() {
  return (
    <section id="tentang" className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Tentang Kami"
          title="Mengenal FIT-TAX Cakrawala Sinergi"
          description="Mitra konsultasi perpajakan yang berfokus pada pemenuhan kewajiban perpajakan secara terencana dan sesuai ketentuan yang berlaku."
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Narrative + image */}
          <Reveal className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-slate-200/70">
              <img
                src={previewAsset("/images/consult-strategy.jpg")}
                alt="Tim profesional FIT-TAX Cakrawala Sinergi dalam diskusi konsultasi perpajakan"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-2 shadow-md backdrop-blur">
                <p className="text-xs font-semibold text-navy">
                  {COMPANY.shortName}
                </p>
                <p className="text-[11px] text-slate-500">
                  {COMPANY.addressShort}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-6">
            <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">
              {COMPANY.description}
            </p>
            <p className="text-[15px] leading-relaxed text-slate-600 md:text-base">
              Kami hadir untuk membantu Wajib Pajak, baik individu maupun badan
              usaha, dalam memahami, mengelola, dan memenuhi kewajiban
              perpajakannya secara terencana—dengan mengedepankan kepatuhan,
              kerahasiaan, serta kerja sama jangka panjang.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {COMPETENCIES.map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-slate-200 bg-mist p-4 transition-colors hover:border-gold/50"
                >
                  <c.icon className="h-5 w-5 text-royal" />
                  <p className="mt-2 text-sm font-semibold text-navy">
                    {c.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Vision & Mission */}
        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <Card className="h-full overflow-hidden border-0 bg-navy-gradient text-white shadow-xl">
              <CardContent className="relative p-7 md:p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 text-gold">
                  <Eye className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-white">Visi</h3>
                <span className="divider-gold mt-3" />
                <p className="mt-4 text-[15px] leading-relaxed text-slate-200">
                  {VISION}
                </p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-3">
            <Card className="h-full border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-royal/10 text-royal">
                    <Target className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-navy">Misi</h3>
                    <p className="text-xs text-slate-500">
                      Komitmen kami dalam setiap pendampingan
                    </p>
                  </div>
                </div>
                <ol className="mt-5 space-y-3">
                  {MISSION.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-slate-100 bg-mist/60 p-3.5"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-navy">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-slate-700">
                        {m}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Tim & Kompetensi note */}
        <Reveal className="mt-12">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-mist/50 p-6 text-center md:p-8">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-navy">
                Profil konsultan, pengalaman, sertifikasi, dan izin praktik
              </span>{" "}
              kami kelola secara internal dan dapat diperbarui melalui admin.
              Informasi rinci tersedia atas permintaan dan sesuai ketentuan
              kerahasiaan yang berlaku.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
