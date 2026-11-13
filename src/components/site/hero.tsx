"use client";

import { MessageCircle, ArrowRight, ShieldCheck, Clock, CheckCircle2, Lock, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VALUE_STATS } from "@/lib/content";
import { useSettings, useWaLink } from "@/hooks/use-settings";

export function Hero() {
  const settings = useSettings();
  const wa = useWaLink();

  return (
    <section
      id="beranda"
      className="relative isolate overflow-hidden bg-navy-gradient"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/office-tower.jpg"
          alt="Gedung perkantoran modern sebagai latar belakang FIT-TAX Cakrawala Sinergi"
          className="h-full w-full object-cover opacity-40"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="pointer-events-none absolute -right-32 top-24 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-royal/30 blur-[120px]" />

      <div className="container-x px-4 pb-24 pt-32 sm:px-6 md:pb-32 md:pt-40 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-gold backdrop-blur-sm">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-gold/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {settings.company.legalForm}
            </div>

            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Solusi Perpajakan Profesional untuk{" "}
              <span className="gold-gradient-text">
                Pertumbuhan Bisnis
              </span>{" "}
              Anda
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-200 sm:text-lg">
              {settings.company.name} hadir memberikan layanan perpajakan yang
              profesional, aman, cepat, dan transparan—didukung tim konsultan
              berpengalaman untuk kebutuhan individu maupun perusahaan.
            </p>

            <p className="mt-3 text-sm font-medium text-gold">
              “{settings.company.tagline}”
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="bg-gold-gradient text-navy shadow-lg shadow-gold/20 hover:opacity-90"
              >
                <a href={wa()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Hubungi Konsultan
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <a href="#layanan">
                  Jelajahi Layanan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Profesional &amp; aman
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-gold" />
                Data klien terjaga
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgePercent className="h-4 w-4 text-gold" />
                Transparansi biaya
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:ml-auto">
              <div className="glass-card animate-floaty rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20 text-gold">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Layanan Perpajakan Terpadu
                    </p>
                    <p className="text-xs text-slate-300">
                      Pendampingan individu &amp; badan usaha
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-5">
                  {VALUE_STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
                    >
                      <p className="gold-gradient-text text-3xl font-extrabold">
                        {s.value}
                      </p>
                      <p className="mt-1 text-xs leading-tight text-slate-300">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-navy-deep/60 px-4 py-3 ring-1 ring-white/10">
                  <span className="text-xs text-slate-300">
                    Hubungi tim kami
                  </span>
                  <a
                    href={wa()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-light"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {settings.contact.whatsappDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 1440 80"
          className="block h-12 w-full fill-white sm:h-16"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,80 L0,32 C240,72 480,72 720,48 C960,24 1200,24 1440,40 L1440,80 Z" />
        </svg>
      </div>
    </section>
  );
}
