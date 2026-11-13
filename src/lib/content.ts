// Central content for FIT-TAX Cakrawala Sinergi
// Static editorial content lives here. Dynamic content (services, team, settings)
// is stored in the database and managed via the admin panel.

import type { LucideIcon } from "lucide-react";
import {
  Scale,
  Calculator,
  GraduationCap,
  ShieldCheck,
  ClipboardCheck,
  Lock,
  Clock,
  BadgePercent,
  Users,
  Handshake,
  ScrollText,
  MessagesSquare,
  Phone,
  Mail,
  MapPin,
  Clock as ClockIcon,
  MessageCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

// Default company/contact values (also seeded to SiteSetting DB table).
// The public site reads live values from /api/settings; these are fallbacks.
export const COMPANY = {
  name: "FIT-TAX Cakrawala Sinergi",
  shortName: "FIT-TAX",
  tagline: "Konsultan Pajak Profesional, Aman, Cepat, dan Transparan.",
  legalForm: "Jasa Konsultan Pajak dan Akuntansi",
  description:
    "FIT-TAX Cakrawala Sinergi adalah konsultan pajak yang berpengalaman dalam perpajakan dan akuntansi. Dengan jaringan partner yang tersebar di berbagai kota di Indonesia, kami berkomitmen memberikan layanan perpajakan yang profesional, aman, cepat, dan transparan.",
  contact: {
    phone: "024-3583379",
    whatsappDisplay: "+62 812 1317 5541",
    whatsappNumber: "6281213175541",
    email: "Fittaxcakrawalasinergi@gmail.com",
    address:
      "Jl. Dokter Cipto No. 20 Bugangan, Kota Semarang, Provinsi Jawa Tengah 50126",
    addressShort: "Semarang, Jawa Tengah",
    operationalHours: [
      { day: "Senin – Jumat", hours: "08.00 – 17.00 WIB" },
      { day: "Sabtu", hours: "08.00 – 13.00 WIB" },
      { day: "Minggu & Hari Libur", hours: "Tutup" },
    ],
    mapsQuery: "Jl. Dokter Cipto No. 20 Bugangan Semarang Jawa Tengah",
  },
};

export const WHATSAPP_DEFAULT_TEXT =
  "Halo FIT-TAX Cakrawala Sinergi, saya tertarik untuk berkonsultasi mengenai kebutuhan perpajakan saya. Mohon informasinya lebih lanjut.";

export function waLink(text: string = WHATSAPP_DEFAULT_TEXT, number: string = COMPANY.contact.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const NAV_ITEMS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Layanan", href: "#layanan" },
  { label: "Tim Ahli", href: "#tim" },
  { label: "Portofolio", href: "#portofolio" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "FAQ", href: "#faq" },
  { label: "Insight", href: "#insight" },
  { label: "Kontak", href: "#kontak" },
];

// ---- Icon registry: maps DB iconName string -> Lucide component ----
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  ClipboardCheck,
  ShieldCheck,
  Scale,
  Calculator,
  GraduationCap,
  FileText: ClipboardCheck,
  MessageSquareText: MessagesSquare,
  CalendarClock: Clock,
  SearchCheck: ShieldCheck,
  BadgeCheck: ShieldCheck,
};

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICONS[name] ?? ClipboardCheck;
}

export interface WhyChooseItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const WHY_CHOOSE: WhyChooseItem[] = [
  {
    icon: Lock,
    title: "Data Aman & Terjaga",
    description:
      "Kerahasiaan data klien adalah prioritas utama kami. Setiap informasi diperlakukan secara rahasia dan dikelola sesuai komitmen menjaga kepercayaan.",
  },
  {
    icon: Users,
    title: "Tim Ahli Berpengalaman",
    description:
      "Tim konsultan pajak yang berpengalaman di bidang perpajakan dan akuntansi, siap memberikan solusi terbaik yang sesuai dengan kebutuhan Anda.",
  },
  {
    icon: ClockIcon,
    title: "Ketepatan Waktu",
    description:
      "Kami berkomitmen pada ketepatan waktu dalam setiap pelayanan perpajakan, memastikan kewajiban Anda terpenuhi sesuai jadwal yang berlaku.",
  },
  {
    icon: BadgePercent,
    title: "Transparansi Biaya",
    description:
      "Transparansi biaya tanpa biaya tambahan. Setiap biaya layanan disampaikan secara terbuka di awal, sehingga Anda memiliki kepastian.",
  },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const PROCESS: ProcessStep[] = [
  {
    number: "01",
    title: "Konsultasi Awal",
    description:
      "Memahami profil, kebutuhan, serta kondisi perpajakan klien secara menyeluruh sebelum langkah selanjutnya ditentukan.",
  },
  {
    number: "02",
    title: "Analisis & Penilaian",
    description:
      "Mengidentifikasi kewajiban, potensi risiko, serta area yang memerlukan perhatian berdasarkan ketentuan yang berlaku.",
  },
  {
    number: "03",
    title: "Penyusunan Strategi",
    description:
      "Menyusun rencana pemenuhan kewajiban perpajakan yang terstruktur, sesuai regulasi, dan relevan dengan kebutuhan klien.",
  },
  {
    number: "04",
    title: "Pelaksanaan & Pendampingan",
    description:
      "Melaksanakan rencana kerja serta mendampingi pemenuhan kewajiban perpajakan secara terdokumentasi dan tepat waktu.",
  },
  {
    number: "05",
    title: "Evaluasi Berkala",
    description:
      "Melakukan tinjauan berkala untuk memastikan kepatuhan tetap terjaga dan menyesuaikan dengan perubahan ketentuan.",
  },
];

export interface ValueStat {
  value: string;
  label: string;
}

export const VALUE_STATS: ValueStat[] = [
  { value: "5", label: "Layanan Utama" },
  { value: "3", label: "Tim Konsultan" },
  { value: "6", label: "Kategori Portofolio" },
  { value: "7", label: "Topik Edukasi" },
];

export const VISION =
  "Menjadi konsultan pajak terpercaya di Indonesia yang memberikan solusi terbaik dan berintegritas tinggi dalam setiap layanan perpajakan.";

export const MISSION: string[] = [
  "Memberikan pelayanan perpajakan yang profesional dan akurat.",
  "Menjadi mitra strategis bagi klien dalam pengelolaan pajak dan akuntansi.",
  "Mengedepankan integritas, etika, dan kerahasiaan data klien.",
  "Mendukung edukasi perpajakan melalui layanan konsultasi dan pelatihan.",
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "Layanan apa saja yang ditawarkan FIT-TAX Cakrawala Sinergi?",
    answer:
      "Kami menawarkan layanan perpajakan (compliance tax), pendampingan pemeriksaan pajak (tax audit), jasa banding & keberatan pajak, jasa akuntansi, serta in-house training perpajakan untuk perusahaan, UMKM, dan organisasi.",
  },
  {
    question: "Bagaimana cara memulai konsultasi dengan tim Anda?",
    answer:
      "Anda dapat menghubungi kami melalui formulir konsultasi di halaman kontak, WhatsApp, email, atau telepon. Tim kami akan menghubungi Anda untuk memahami kebutuhan perpajakan Anda dan menjelaskan langkah selanjutnya.",
  },
  {
    question: "Apakah informasi dan data saya dirahasiakan?",
    answer:
      "Ya. Kerahasiaan data klien adalah prioritas utama kami. Setiap informasi yang Anda sampaikan diperlakukan secara rahasia dan dikelola sesuai komitmen menjaga kepercayaan.",
  },
  {
    question: "Berapa biaya layanan konsultasi perpajakan?",
    answer:
      "Biaya layanan disesuaikan dengan jenis dan ruang lingkup kebutuhan Anda. Kami menerapkan transparansi biaya tanpa biaya tambahan—setiap biaya disampaikan secara terbuka di awal sebelum pekerjaan dimulai.",
  },
  {
    question: "Apakah layanan tersedia untuk UMKM dan perorangan?",
    answer:
      "Ya. Kami melayani Wajib Pajak badan usaha, UMKM, maupun perorangan. Pendekatan kami disesuaikan dengan profil dan kebutuhan masing-masing klien.",
  },
  {
    question: "Apakah tim konsultan memiliki kredensial profesional?",
    answer:
      "Tim kami terdiri dari konsultan dengan latar belakang di bidang perpajakan dan akuntansi. Detail kredensial setiap anggota tim dapat dilihat pada bagian Tim Ahli Kami.",
  },
];

export interface ContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export const ARTICLE_CATEGORIES = [
  "Regulasi Pajak",
  "Pajak Perusahaan",
  "Pajak Orang Pribadi",
  "SPT Tahunan",
  "PPN dan PPh",
  "Tips Kepatuhan Pajak",
  "Edukasi Perpajakan",
];

export const PORTFOLIO_CATEGORIES = [
  "Compliance Tax",
  "Konsultasi Pajak Individu",
  "Pendampingan Pelaporan Pajak",
  "Tax Review",
  "Pendampingan Administrasi Pajak",
  "In-house Training",
];

// Icons re-exported for convenience
export {
  Scale,
  Calculator,
  GraduationCap,
  ShieldCheck,
  ClipboardCheck,
  Lock,
  ClockIcon,
  BadgePercent,
  Users,
  Handshake,
  ScrollText,
  MessagesSquare,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  HelpCircle,
  ChevronDown,
};
