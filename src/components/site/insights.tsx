"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Clock,
  ArrowRight,
  TrendingUp,
  X,
  Share2,
  Facebook,
  Linkedin,
  Twitter,
  Link2,
  CalendarDays,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { ARTICLE_CATEGORIES } from "@/lib/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  author: string;
  readingMinutes: number;
  isPopular: boolean;
  publishedAt: string;
  updatedAt: string;
}

interface ArticleDetail extends ArticleSummary {
  content: string;
  tags: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function Insights() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [popular, setPopular] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [active, setActive] = useState<ArticleDetail | null>(null);
  const [related, setRelated] = useState<ArticleSummary[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { toast } = useToast();

  const categories = ["Semua", ...ARTICLE_CATEGORIES];

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // fetch articles
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "Semua") params.set("category", category);
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("sort", "recent");
    fetch(`/api/articles?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success) setArticles(d.articles);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [category, debouncedSearch]);

  // fetch popular (once)
  useEffect(() => {
    fetch(`/api/articles?sort=popular&limit=4`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPopular(d.articles);
      })
      .catch(() => {});
  }, []);

  const openArticle = useCallback(async (slug: string) => {
    setLoadingDetail(true);
    setActive(null);
    setRelated([]);
    try {
      const res = await fetch(`/api/articles/${slug}`);
      const d = await res.json();
      if (d.success) {
        setActive(d.article);
        setRelated(d.related || []);
        document.body.style.overflow = "hidden";
      }
    } catch {
      // ignore
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const closeArticle = useCallback(() => {
    setActive(null);
    setRelated([]);
    document.body.style.overflow = "";
  }, []);

  const share = (platform: "copy" | "facebook" | "twitter" | "linkedin") => {
    if (!active) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(active.title);
    if (platform === "copy") {
      navigator.clipboard?.writeText(url);
      toast({ title: "Tautan disalin", description: "Tautan artikel telah disalin ke clipboard." });
      return;
    }
    const map = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    window.open(map[platform], "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <section id="insight" className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Insight"
          title="Artikel & Edukasi Perpajakan"
          description="Wawasan edukatif seputar regulasi, kepatuhan, dan praktik perpajakan. Konten disusun sebagai bahan pembelajaran umum dan bukan nasihat pajak formal."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-4">
          {/* Main column */}
          <div className="lg:col-span-3">
            {/* Search + filters */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari artikel perpajakan..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-mist/50 pl-11 pr-10 text-sm text-navy placeholder:text-slate-400 outline-none transition-colors focus:border-royal focus:bg-white"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Hapus pencarian"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                      category === c
                        ? "bg-navy-gradient text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-royal/40 hover:text-royal"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Article grid */}
            {loading ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[300px] animate-pulse rounded-2xl bg-mist"
                  />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-mist/40 p-10 text-center">
                <p className="text-sm text-slate-500">
                  Tidak ada artikel yang sesuai. Coba kata kunci atau kategori lain.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {articles.map((a, i) => (
                  <Reveal key={a.id} delay={(i % 2) * 80}>
                    <Card
                      onClick={() => openArticle(a.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openArticle(a.slug);
                        }
                      }}
                      className="group h-full cursor-pointer overflow-hidden border border-slate-200 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {a.coverImage ? (
                          <img
                            src={a.coverImage}
                            alt={a.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full bg-navy-gradient" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                        <Badge className="absolute left-3 top-3 border-0 bg-white/90 text-[10px] font-semibold text-navy">
                          {a.category}
                        </Badge>
                        {a.isPopular && (
                          <Badge className="absolute right-3 top-3 border-0 bg-gold-gradient text-[10px] font-bold text-navy">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Populer
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(a.publishedAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {a.readingMinutes} mnt baca
                          </span>
                        </div>
                        <h3 className="mt-2.5 line-clamp-2 text-base font-bold leading-snug text-navy transition-colors group-hover:text-royal">
                          {a.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                          {a.excerpt}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-royal transition-colors group-hover:text-gold">
                          Baca selengkapnya
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* Popular sidebar */}
          <div className="lg:col-span-1">
            <Reveal>
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-mist/50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  Artikel Populer
                </h3>
                <span className="mt-3 block divider-gold" />
                <ul className="mt-4 space-y-4">
                  {popular.map((a, i) => (
                    <li key={a.id}>
                      <button
                        onClick={() => openArticle(a.slug)}
                        className="group flex w-full items-start gap-3 text-left"
                      >
                        <span className="gold-gradient-text text-2xl font-extrabold leading-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="line-clamp-2 text-sm font-semibold leading-snug text-navy transition-colors group-hover:text-royal">
                            {a.title}
                          </span>
                          <span className="mt-1 block text-[11px] text-slate-500">
                            {a.category} · {a.readingMinutes} mnt
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl bg-navy-gradient p-4 text-white">
                  <p className="text-sm font-semibold">
                    Butuh bantuan dengan pajak Anda?
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Konsultasikan langsung dengan tim kami.
                  </p>
                  <Button asChild size="sm" className="mt-3 w-full bg-gold-gradient text-navy hover:opacity-90">
                    <a href="#kontak">Konsultasi Sekarang</a>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Article detail modal */}
      {(active || loadingDetail) && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-navy-deep/80 p-0 backdrop-blur-sm sm:p-6"
          onClick={closeArticle}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative my-0 w-full max-w-3xl rounded-none bg-white shadow-2xl sm:my-4 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingDetail ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-royal" />
              </div>
            ) : active ? (
              <>
                {/* Cover */}
                <div className="relative aspect-[16/8] overflow-hidden rounded-t-2xl">
                  {active.coverImage ? (
                    <img
                      src={active.coverImage}
                      alt={active.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-navy-gradient" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />
                  <button
                    onClick={closeArticle}
                    aria-label="Tutup artikel"
                    className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow-md transition hover:bg-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 left-5 right-5">
                    <Badge className="border-0 bg-gold-gradient text-[11px] font-bold text-navy">
                      {active.category}
                    </Badge>
                    <h2 className="mt-2 text-balance text-2xl font-bold leading-tight text-white md:text-3xl">
                      {active.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-200">
                      <span>{active.author}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(active.publishedAt)}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {active.readingMinutes} menit baca
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3 backdrop-blur md:px-8">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Share2 className="h-4 w-4" />
                    Bagikan artikel
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ShareBtn label="Facebook" onClick={() => share("facebook")}>
                      <Facebook className="h-4 w-4" />
                    </ShareBtn>
                    <ShareBtn label="Twitter / X" onClick={() => share("twitter")}>
                      <Twitter className="h-4 w-4" />
                    </ShareBtn>
                    <ShareBtn label="LinkedIn" onClick={() => share("linkedin")}>
                      <Linkedin className="h-4 w-4" />
                    </ShareBtn>
                    <ShareBtn label="Salin tautan" onClick={() => share("copy")}>
                      <Link2 className="h-4 w-4" />
                    </ShareBtn>
                  </div>
                </div>

                {/* Content */}
                <article className="article-prose px-5 py-7 md:px-8">
                  <ReactMarkdown>{active.content}</ReactMarkdown>

                  <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
                    {active.tags.split(",").map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="border-slate-200 text-xs font-normal text-slate-500"
                      >
                        #{t.trim()}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 rounded-xl bg-mist p-5 text-xs text-slate-500">
                    Diperbarui: {formatDate(active.updatedAt)}. Artikel ini bersifat edukatif umum dan bukan nasihat pajak formal. Untuk penerapan spesifik, rujuk peraturan resmi dan berkonsultasilah dengan konsultan pajak.
                  </div>
                </article>

                {/* Related */}
                {related.length > 0 && (
                  <div className="border-t border-slate-100 px-5 py-7 md:px-8">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
                      Artikel Terkait
                    </h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      {related.map((r) => (
                        <button
                          key={r.slug}
                          onClick={() => openArticle(r.slug)}
                          className="group text-left"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                            {r.coverImage ? (
                              <img
                                src={r.coverImage}
                                alt={r.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full bg-navy-gradient" />
                            )}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-navy transition-colors group-hover:text-royal">
                            {r.title}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

function ShareBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-royal hover:bg-royal hover:text-white"
    >
      {children}
    </button>
  );
}
