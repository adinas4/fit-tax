"use client";

import { useEffect, useState } from "react";
import { Building2, Calendar, ArrowRight, Tag, X } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { PORTFOLIO_CATEGORIES } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  industry: string;
  year: string;
  challenge: string;
  approach: string;
  result: string;
  image: string | null;
  isExample: boolean;
}

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [active, setActive] = useState<PortfolioItem | null>(null);
  const [category, setCategory] = useState("Semua");
  const [reqVersion, setReqVersion] = useState(1);
  const [loadedVersion, setLoadedVersion] = useState(0);
  const loading = reqVersion !== loadedVersion;

  useEffect(() => {
    let mounted = true;
    const qs =
      category !== "Semua" ? `?category=${encodeURIComponent(category)}` : "";
    fetch(`/api/portfolio${qs}`)
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success) setItems(d.items);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadedVersion(reqVersion);
      });
    return () => {
      mounted = false;
    };
  }, [category, reqVersion]);

  const handleCategory = (c: string) => {
    setCategory(c);
    setReqVersion((v) => v + 1);
  };

  const categories = ["Semua", ...PORTFOLIO_CATEGORIES];

  return (
    <section id="portofolio" className="section-pad bg-mist">
      <div className="container-x">
        <SectionHeading
          eyebrow="Portofolio"
          title="Pengalaman & Studi Kasus"
          description="Ilustrasi pendekatan kerja kami dalam berbagai kategori layanan perpajakan. Ditampilkan sebagai contoh tampilan, bukan klaim proyek tertentu."
        />

        {/* Category filter */}
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => handleCategory(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                category === c
                  ? "bg-navy-gradient text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-royal/40 hover:text-royal"
              )}
            >
              {c}
            </button>
          ))}
        </Reveal>

        {/* Grid */}
        {loading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[380px] animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 3) * 80}>
                <Card
                  onClick={() => setActive(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(item);
                    }
                  }}
                  className="group h-full cursor-pointer overflow-hidden border border-slate-200 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={`Ilustrasi ${item.title}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-navy-gradient" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                    <Badge className="absolute left-3 top-3 border-0 bg-gold-gradient text-[10px] font-bold uppercase tracking-wide text-navy">
                      Contoh Tampilan
                    </Badge>
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="border-0 bg-white/90 text-[11px] font-semibold text-navy">
                        {item.category}
                      </Badge>
                      <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {item.industry}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.year}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-royal transition-colors group-hover:text-gold">
                      Detail
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        {items.length === 0 && !loading && (
          <p className="mt-12 text-center text-sm text-slate-500">
            Belum ada portofolio pada kategori ini.
          </p>
        )}
      </div>

      {/* Detail dialog */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto scroll-elegant rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
              {active.image ? (
                <img
                  src={active.image}
                  alt={`Ilustrasi ${active.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-navy-gradient" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <button
                onClick={() => setActive(null)}
                aria-label="Tutup"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow-md transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-0 bg-gold-gradient text-[10px] font-bold uppercase tracking-wide text-navy">
                    Contoh Tampilan
                  </Badge>
                  <Badge className="border-0 bg-white/90 text-[11px] font-semibold text-navy">
                    {active.category}
                  </Badge>
                </div>
                <h3 className="mt-2 text-xl font-bold leading-snug text-white md:text-2xl">
                  {active.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-200">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {active.industry}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Tahun {active.year}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
              <DetailBlock
                icon={<Tag className="h-4 w-4" />}
                label="Tantangan"
                text={active.challenge}
              />
              <DetailBlock
                icon={<ArrowRight className="h-4 w-4" />}
                label="Pendekatan"
                text={active.approach}
              />
              <DetailBlock
                icon={<Calendar className="h-4 w-4" />}
                label="Ringkasan Hasil"
                text={active.result}
                accent
              />
            </div>

            <div className="border-t border-slate-100 bg-mist/60 px-6 py-5 md:px-8">
              <Button asChild className="w-full bg-navy-gradient text-white hover:opacity-90 sm:w-auto">
                <a href="#kontak">Konsultasikan Kebutuhan Serupa</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailBlock({
  icon,
  label,
  text,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-4",
        accent ? "bg-navy-gradient text-white" : "bg-mist"
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide",
          accent ? "text-gold" : "text-royal"
        )}
      >
        {icon}
        {label}
      </span>
      <p
        className={cn(
          "mt-2.5 text-sm leading-relaxed",
          accent ? "text-slate-200" : "text-slate-700"
        )}
      >
        {text}
      </p>
    </div>
  );
}
