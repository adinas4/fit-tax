"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { getServiceIcon, waLink } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IS_GITHUB_PREVIEW,
  PREVIEW_SERVICES,
} from "@/lib/github-preview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  short: string;
  benefits: string[];
  details: string[];
  iconName: string;
}

export function Services() {
  const [services, setServices] = useState<ServiceItem[]>(
    IS_GITHUB_PREVIEW ? PREVIEW_SERVICES : []
  );
  const [loading, setLoading] = useState(!IS_GITHUB_PREVIEW);
  const [active, setActive] = useState<ServiceItem | null>(null);

  useEffect(() => {
    if (IS_GITHUB_PREVIEW) return;
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setServices(d.services);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="layanan" className="section-pad bg-mist">
      <div className="container-x">
        <SectionHeading
          eyebrow="Layanan Kami"
          title="Solusi Perpajakan yang Menyeluruh"
          description="Layanan konsultasi perpajakan dan akuntansi yang dirancang untuk mendampingi kebutuhan individu maupun badan usaha, dari pemenuhan kewajiban hingga pendampingan pemeriksaan dan pelatihan."
        />

        {loading ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = getServiceIcon(service.iconName);
              return (
                <Reveal key={service.id} delay={(i % 3) * 80}>
                  <Card
                    onClick={() => setActive(service)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(service);
                      }
                    }}
                    className="group h-full cursor-pointer border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl"
                  >
                    <div className="relative">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-gradient text-gold shadow-md transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="absolute -right-1 -top-1 text-xs font-bold text-slate-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-navy">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
                      {service.short}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-royal transition-colors group-hover:text-gold">
                      Lihat detail
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto scroll-elegant border-0 p-0 sm:rounded-2xl md:max-w-2xl">
          {active && (() => {
            const Icon = getServiceIcon(active.iconName);
            return (
              <>
                <div className="relative bg-navy-gradient px-6 py-8 text-white md:px-8">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
                  <DialogHeader className="gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold">
                      <Icon className="h-6 w-6" />
                    </span>
                    <DialogTitle className="text-2xl font-bold text-white">
                      {active.name}
                    </DialogTitle>
                    <DialogDescription className="text-slate-300">
                      {active.short}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="px-6 py-7 md:px-8">
                  <div className="grid gap-7 md:grid-cols-2">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-royal">
                        <CheckCircle2 className="h-4 w-4 text-gold" />
                        Manfaat Layanan
                      </h4>
                      <ul className="mt-4 space-y-2.5">
                        {active.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-royal">
                        <CheckCircle2 className="h-4 w-4 text-gold" />
                        Detail Layanan
                      </h4>
                      <ul className="mt-4 space-y-2.5">
                        {active.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-royal" />
                            <span className="leading-relaxed">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-7 rounded-xl bg-mist p-5">
                    <p className="text-sm font-semibold text-navy">
                      Butuh pendampingan untuk layanan ini?
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Konsultasikan kebutuhan Anda langsung dengan tim
                      FIT-TAX Cakrawala Sinergi melalui WhatsApp.
                    </p>
                    <Button
                      asChild
                      className="mt-4 w-full bg-gold-gradient text-navy hover:opacity-90 sm:w-auto"
                    >
                      <a
                        href={waLink(
                          `Halo FIT-TAX Cakrawala Sinergi, saya ingin berkonsultasi mengenai layanan "${active.name}". Mohon informasinya lebih lanjut.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Konsultasikan Kebutuhan Anda
                      </a>
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </section>
  );
}
