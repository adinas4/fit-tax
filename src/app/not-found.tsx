import Link from "next/link";
import { Home, MessageCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-gradient px-4 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]" />

      <div className="relative">
        <p className="gold-gradient-text text-[7rem] font-extrabold leading-none sm:text-[9rem]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          Silakan kembali ke beranda atau hubungi tim kami.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-navy shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <a
            href="https://wa.me/6281213175541"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Hubungi Kami
          </a>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke situs FIT-TAX Cakrawala Sinergi
        </Link>
      </div>
    </div>
  );
}
