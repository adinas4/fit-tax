"use client";

import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { WHY_CHOOSE, waLink } from "@/lib/content";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhyChooseUs() {
  return (
    <section id="keunggulan" className="relative section-pad overflow-hidden bg-navy-gradient">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-royal/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gold/15 blur-[120px]" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Keunggulan Kami"
          title="Mengapa Memilih FIT-TAX Cakrawala Sinergi"
          description="Kami berkomitmen memberikan layanan perpajakan yang profesional, aman, cepat, dan transparan—dengan mengedepankan kerahasiaan data dan kepercayaan klien."
          light
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 90}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-base font-bold text-white">
                  {item.title}
                </h3>
                <span className="mt-2 block h-0.5 w-10 rounded-full bg-gold/60" />
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-bold text-white">
              Siap memulai konsultasi perpajakan bersama kami?
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Tim FIT-TAX Cakrawala Sinergi siap mendampingi kebutuhan Anda.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 bg-gold-gradient text-navy shadow-lg hover:opacity-90"
          >
            <a href={waLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Hubungi Konsultan
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
