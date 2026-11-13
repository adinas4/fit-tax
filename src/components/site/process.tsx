"use client";

import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { PROCESS } from "@/lib/content";
import { ArrowRight } from "lucide-react";

export function Process() {
  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Alur Konsultasi"
          title="Proses Kerja yang Terstruktur"
          description="Setiap pendampingan kami jalankan melalui tahapan yang sistematis untuk memastikan kebutuhan perpajakan Anda ditangani dengan tepat."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-5">
          {PROCESS.map((step, i) => (
            <Reveal key={step.number} delay={i * 90} className="relative">
              <div className="group h-full rounded-2xl border border-slate-200 bg-mist/50 p-6 transition-all duration-300 hover:border-gold/50 hover:bg-white hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="gold-gradient-text text-4xl font-extrabold">
                    {step.number}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-gold/40 transition-colors group-hover:bg-gold" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
              {i < PROCESS.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 md:block" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
