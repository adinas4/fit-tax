"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUp,
  Linkedin,
  Instagram,
  Facebook,
  Shield,
  FileText,
  Lock,
} from "lucide-react";
import { Logo } from "./logo";
import { NAV_ITEMS, waLink } from "@/lib/content";
import { useSettings } from "@/hooks/use-settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function Footer() {
  const settings = useSettings();
  const year = new Date().getFullYear();
  const [legalOpen, setLegalOpen] = useState<"privacy" | "terms" | null>(null);

  const socials = [
    { href: settings.social.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: settings.social.instagram, icon: Instagram, label: "Instagram" },
    { href: settings.social.facebook, icon: Facebook, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <footer className="relative mt-auto overflow-hidden bg-navy-deep text-slate-300">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-royal/20 blur-[120px]" />

      <div className="container-x relative px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              {settings.company.description}
            </p>
            <p className="mt-4 text-sm font-medium text-gold">
              “{settings.company.tagline}”
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={waLink(settings.company.name ? undefined : undefined, settings.contact.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Navigasi</h4>
            <span className="mt-3 block h-0.5 w-8 rounded-full bg-gold/60" />
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-slate-400 transition-colors hover:text-gold">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Layanan</h4>
            <span className="mt-3 block h-0.5 w-8 rounded-full bg-gold/60" />
            <ul className="mt-4 space-y-2.5">
              <li><a href="#layanan" className="text-sm text-slate-400 hover:text-gold">Jasa Perpajakan (Compliance Tax)</a></li>
              <li><a href="#layanan" className="text-sm text-slate-400 hover:text-gold">Pendampingan Pemeriksaan Pajak</a></li>
              <li><a href="#layanan" className="text-sm text-slate-400 hover:text-gold">Jasa Banding &amp; Keberatan Pajak</a></li>
              <li><a href="#layanan" className="text-sm text-slate-400 hover:text-gold">Jasa Akuntansi</a></li>
              <li><a href="#layanan" className="text-sm text-slate-400 hover:text-gold">In-house Training Perpajakan</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">Kontak</h4>
            <span className="mt-3 block h-0.5 w-8 rounded-full bg-gold/60" />
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-slate-400">{settings.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${settings.contact.phone.replace(/[^0-9]/g, "")}`} className="text-slate-400 hover:text-gold">
                  {settings.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-gold" />
                <a href={waLink(undefined, settings.contact.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-gold">
                  {settings.contact.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${settings.contact.email}`} className="break-all text-slate-400 hover:text-gold">
                  {settings.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-center text-xs text-slate-500 md:text-left">
            © {year} {settings.company.name}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setLegalOpen("privacy")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-gold"
            >
              <Shield className="h-3.5 w-3.5" />
              Privacy Policy
            </button>
            <button
              onClick={() => setLegalOpen("terms")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-gold"
            >
              <FileText className="h-3.5 w-3.5" />
              Terms &amp; Conditions
            </button>
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-gold"
            >
              <Lock className="h-3.5 w-3.5" />
              Admin
            </a>
          </div>
        </div>
      </div>

      <a
        href="#beranda"
        aria-label="Kembali ke atas"
        className="group absolute bottom-6 right-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient text-navy shadow-lg transition-transform hover:-translate-y-1"
      >
        <ArrowUp className="h-5 w-5" />
      </a>

      <Dialog open={!!legalOpen} onOpenChange={(o) => !o && setLegalOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto scroll-elegant border-0 p-0 sm:rounded-2xl md:max-w-xl">
          <div className="bg-navy-gradient px-6 py-6 text-white md:px-8">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
                {legalOpen === "privacy" ? (
                  <><Shield className="h-5 w-5 text-gold" /> Kebijakan Privasi</>
                ) : (
                  <><FileText className="h-5 w-5 text-gold" /> Syarat &amp; Ketentuan</>
                )}
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {settings.company.name}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-6 text-sm leading-relaxed text-slate-600 md:px-8">
            {legalOpen === "privacy" ? <PrivacyContent /> : <TermsContent />}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-4">
      <p>
        Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan,
        dan melindungi informasi pribadi yang Anda sampaikan melalui situs ini.
      </p>
      <h4 className="font-semibold text-navy">1. Pengumpulan Data</h4>
      <p>
        Kami mengumpulkan data yang Anda sampaikan secara sukarela melalui formulir
        konsultasi, meliputi nama, nama perusahaan, email, nomor WhatsApp, jenis
        layanan, dan pesan kebutuhan konsultasi.
      </p>
      <h4 className="font-semibold text-navy">2. Penggunaan Data</h4>
      <p>
        Data digunakan semata-mata untuk merespons permintaan konsultasi Anda,
        memberikan layanan perpajakan, serta komunikasi terkait layanan kami.
      </p>
      <h4 className="font-semibold text-navy">3. Kerahasiaan</h4>
      <p>
        Kerahasiaan data klien adalah prioritas utama kami. Setiap informasi
        diperlakukan secara rahasia dan dikelola sesuai komitmen menjaga
        kepercayaan.
      </p>
      <h4 className="font-semibold text-navy">4. Keamanan</h4>
      <p>
        Kami menerapkan langkah-langkah teknis dan organisasi untuk melindungi data
        Anda dari akses tidak sah.
      </p>
      <h4 className="font-semibold text-navy">5. Perubahan Kebijakan</h4>
      <p>
        Kebijakan ini dapat diperbarui dari waktu ke waktu. Perubahan akan
        diinformasikan melalui situs ini.
      </p>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-4">
      <p>
        Dengan mengakses dan menggunakan situs ini, Anda menyetujui syarat dan
        ketentuan berikut.
      </p>
      <h4 className="font-semibold text-navy">1. Layanan</h4>
      <p>
        Situs ini menyediakan informasi mengenai layanan konsultasi perpajakan dan
        akuntansi. Konten edukatif bersifat umum dan bukan nasihat pajak formal.
      </p>
      <h4 className="font-semibold text-navy">2. Tidak Ada Jaminan Hasil</h4>
      <p>
        Kami tidak menjanjikan hasil pajak tertentu. Setiap rekomendasi disusun
        dengan mengedepankan kepatuhan terhadap peraturan perundang-undangan yang
        berlaku.
      </p>
      <h4 className="font-semibold text-navy">3. Tanggung Jawab Pengguna</h4>
      <p>
        Anda bertanggung jawab atas keakuratan data yang disampaikan melalui
        formulir konsultasi.
      </p>
      <h4 className="font-semibold text-navy">4. Hak Kekayaan Intelektual</h4>
      <p>
        Seluruh konten pada situs ini merupakan milik FIT-TAX Cakrawala Sinergi dan
        dilindungi hak cipta.
      </p>
      <h4 className="font-semibold text-navy">5. Hukum yang Berlaku</h4>
      <p>
        Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia.
      </p>
    </div>
  );
}
