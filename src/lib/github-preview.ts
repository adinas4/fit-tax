export const IS_GITHUB_PREVIEW =
  process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

export function previewAsset(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${path}`;
}

export const PREVIEW_SERVICES = [
  {
    id: "compliance-tax",
    name: "Jasa Perpajakan (Compliance Tax)",
    slug: "jasa-perpajakan-compliance-tax",
    short:
      "Pendampingan penyusunan dan pelaporan pajak sesuai peraturan yang berlaku.",
    benefits: [
      "Pemenuhan kewajiban perpajakan tepat waktu",
      "Pelaporan sesuai peraturan yang berlaku",
      "Minimisasi risiko sanksi administratif",
    ],
    details: [
      "Penyusunan dan pelaporan SPT Masa serta SPT Tahunan.",
      "Pencatatan dan penyiapan dokumen pendukung pelaporan.",
      "Pendampingan pemenuhan kewajiban perpajakan berkala.",
    ],
    iconName: "ClipboardCheck",
  },
  {
    id: "tax-audit",
    name: "Pendampingan Pemeriksaan Pajak (Tax Audit)",
    slug: "pendampingan-pemeriksaan-pajak",
    short:
      "Membantu klien menghadapi pemeriksaan pajak dengan strategi dan dokumentasi yang tepat.",
    benefits: [
      "Persiapan dokumen yang lengkap dan terstruktur",
      "Pendampingan selama proses pemeriksaan",
      "Strategi klarifikasi yang sesuai ketentuan",
    ],
    details: [
      "Bantuan penyiapan dokumen dan data untuk pemeriksaan.",
      "Pendampingan komunikasi dengan fiskus.",
      "Analisis atas temuan pemeriksaan untuk klarifikasi.",
    ],
    iconName: "ShieldCheck",
  },
  {
    id: "tax-appeal",
    name: "Jasa Banding & Keberatan Pajak",
    slug: "jasa-banding-keberatan-pajak",
    short:
      "Pendampingan proses keberatan hingga banding untuk menjaga hak-hak perpajakan Anda.",
    benefits: [
      "Pendampingan proses keberatan pajak",
      "Penjagaan hak-hak Wajib Pajak",
      "Penyusunan dokumen pendukung",
    ],
    details: [
      "Penyiapan dokumen keberatan atas ketetapan pajak.",
      "Pendampingan proses keberatan sesuai ketentuan.",
      "Pendampingan proses banding bila diperlukan.",
    ],
    iconName: "Scale",
  },
  {
    id: "accounting",
    name: "Jasa Akuntansi",
    slug: "jasa-akuntansi",
    short:
      "Penyusunan laporan keuangan dan pembukuan profesional untuk kebutuhan bisnis.",
    benefits: [
      "Laporan keuangan tersusun secara profesional",
      "Pembukuan yang rapi dan terdokumentasi",
      "Dasar pengambilan keputusan bisnis",
    ],
    details: [
      "Penyusunan laporan keuangan periodik.",
      "Pembukuan dan pencatatan transaksi.",
      "Rekonsiliasi data akuntansi.",
    ],
    iconName: "Calculator",
  },
  {
    id: "training",
    name: "In-house Training Perpajakan",
    slug: "in-house-training-perpajakan",
    short: "Pelatihan perpajakan untuk perusahaan, UMKM, dan organisasi.",
    benefits: [
      "Peningkatan pemahaman tim internal",
      "Materi disesuaikan kebutuhan organisasi",
      "Praktik administrasi perpajakan",
    ],
    details: [
      "Penyusunan materi pelatihan sesuai kebutuhan.",
      "Sesi edukasi kewajiban perpajakan.",
      "Pendampingan penerapan pada proses kerja.",
    ],
    iconName: "GraduationCap",
  },
];

export const PREVIEW_TEAM = [
  {
    id: "rohmah-arsiyah",
    name: "Rohmah Arsiyah, S.A.P., M.A., CTAP, BKP",
    role: "Founder",
    credentials: "S.A.P., M.A., CTAP, BKP",
    bio: "Founder CV Cakrawala Inti Teknik dengan pengalaman di bidang perpajakan dan akuntansi.",
    photoUrl: "/images/team/rohmah-arsiyah.png",
  },
  {
    id: "hermawati-arum",
    name: "Hermawati Nurciptaning Arum, S.Ak., M.Ak, CA, Akt",
    role: "Partner",
    credentials: "S.Ak., M.Ak, CA, Akt",
    bio: "Partner dengan keahlian di bidang akuntansi dan perpajakan.",
    photoUrl: "/images/team/hermawati-arum.png",
  },
  {
    id: "dian-ardianto",
    name: "Dian Ardianto, S.E., M.Ak",
    role: "Partner",
    credentials: "S.E., M.Ak",
    bio: "Partner dengan pengalaman dalam konsultasi perpajakan dan akuntansi.",
    photoUrl: "/images/team/dian-ardianto.png",
  },
];

export const PREVIEW_PORTFOLIO = [
  {
    id: "compliance-business",
    title: "Penataan Kewajiban Pajak Badan Usaha Jasa",
    category: "Compliance Tax",
    industry: "Jasa Profesional",
    year: "2024",
    challenge:
      "Perusahaan jasa memerlukan pemetaan kewajiban perpajakan yang sesuai dengan kegiatan usahanya.",
    approach:
      "Tinjauan kegiatan usaha, struktur transaksi, dan administrasi untuk menyusun kerangka pemenuhan kewajiban yang terstruktur.",
    result:
      "Kerangka administrasi dan pelaporan yang lebih tertib serta peningkatan pemahaman tim internal.",
    image: "/images/consult-discussion.jpg",
    isExample: true,
  },
  {
    id: "individual-tax",
    title: "Konsultasi Pajak untuk Wajib Pajak Orang Pribadi",
    category: "Konsultasi Pajak Individu",
    industry: "Individu",
    year: "2024",
    challenge:
      "Wajib Pajak dengan sumber penghasilan beragam memerlukan pemahaman atas kewajiban pelaporan.",
    approach:
      "Pemetaan sumber penghasilan, perhitungan kewajiban, dan penyiapan dokumen pendukung SPT Tahunan.",
    result:
      "Pelaporan sesuai profil penghasilan dan dokumentasi yang lebih tertata.",
    image: "/images/consult-strategy.jpg",
    isExample: true,
  },
  {
    id: "tax-reporting",
    title: "Pendampingan Pelaporan Pajak Berkala",
    category: "Pendampingan Pelaporan Pajak",
    industry: "Perdagangan",
    year: "2023",
    challenge:
      "Perusahaan dagang memerlukan pelaporan SPT Masa berkala yang akurat dan tepat waktu.",
    approach:
      "Penyusunan jadwal, rekonsiliasi data transaksi, dan pendampingan pelaporan.",
    result:
      "Pelaporan lebih tertib dan administrasi dokumen lebih rapi.",
    image: "/images/tax-calculator.jpg",
    isExample: true,
  },
  {
    id: "tax-review",
    title: "Tax Review Administrasi Perpajakan",
    category: "Tax Review",
    industry: "Manufaktur",
    year: "2024",
    challenge:
      "Tinjauan administrasi perpajakan diperlukan untuk mengidentifikasi area perbaikan.",
    approach:
      "Review pencatatan transaksi, faktur pajak, dan konsistensi pembukuan dengan laporan perpajakan.",
    result:
      "Daftar area perbaikan dan rekomendasi untuk peningkatan kepatuhan.",
    image: "/images/finance-review.jpg",
    isExample: true,
  },
  {
    id: "tax-administration",
    title: "Pendampingan Administrasi Pengukuhan PKP",
    category: "Pendampingan Administrasi Pajak",
    industry: "Startup / Teknologi",
    year: "2023",
    challenge:
      "Perusahaan rintisan memerlukan pendampingan administrasi perpajakan dan pengukuhan PKP.",
    approach:
      "Penyiapan dokumen, pendampingan administrasi, dan penjelasan kewajiban setelah pengukuhan.",
    result:
      "Administrasi perpajakan lebih jelas dan tim internal memahami kewajibannya.",
    image: "/images/consult-handshake.jpg",
    isExample: true,
  },
  {
    id: "in-house-training",
    title: "In-house Training Perpajakan untuk Tim Internal",
    category: "In-house Training",
    industry: "Multi Industri",
    year: "2024",
    challenge:
      "Perusahaan memerlukan peningkatan pemahaman tim internal atas kewajiban perpajakan.",
    approach:
      "Materi pelatihan disusun sesuai kebutuhan, mencakup konsep, pelaporan, dan administrasi.",
    result:
      "Pemahaman tim meningkat dan panduan administrasi praktis tersusun.",
    image: "/images/team-boardroom.jpg",
    isExample: true,
  },
];

const previewDate = "2025-01-01T00:00:00.000Z";

export const PREVIEW_ARTICLES = [
  {
    id: "coretax",
    title: "Memahami Coretax: Sistem Administrasi Perpajakan Terintegrasi DJP",
    slug: "memahami-coretax-sistem-administrasi-perpajakan-djp",
    excerpt:
      "Coretax merupakan sistem administrasi perpajakan terintegrasi yang dikembangkan DJP. Pahami ruang lingkup dan implikasinya bagi Wajib Pajak.",
    category: "Regulasi Pajak",
    coverImage: "/images/tax-documents.jpg",
    author: "FIT-TAX Cakrawala Sinergi",
    readingMinutes: 6,
    isPopular: true,
    publishedAt: previewDate,
    updatedAt: previewDate,
    tags: "Coretax, DJP, administrasi perpajakan",
    seoTitle: null,
    seoDescription: null,
    content:
      "## Mengenal Coretax\n\nCoretax merupakan sistem administrasi perpajakan terintegrasi yang dikembangkan Direktorat Jenderal Pajak sebagai bagian dari modernisasi administrasi perpajakan.\n\n## Implikasi bagi Wajib Pajak\n\nKonsolidasi data dan layanan digital membuat kelengkapan dokumen serta konsistensi informasi semakin penting.\n\nArtikel ini bersifat edukatif dan bukan nasihat pajak formal. Rujuk informasi resmi Direktorat Jenderal Pajak untuk pembaruan terkini.",
  },
  {
    id: "umkm",
    title: "PPh Final UMKM: Memahami PP 55 Tahun 2022",
    slug: "pph-final-umkm-pp-55-tahun-2022",
    excerpt:
      "Peraturan Pemerintah Nomor 55 Tahun 2022 mengatur Pajak Penghasilan Final UMKM. Simak ringkasan ketentuannya.",
    category: "Pajak Perusahaan",
    coverImage: "/images/accounting-ledger.jpg",
    author: "FIT-TAX Cakrawala Sinergi",
    readingMinutes: 7,
    isPopular: true,
    publishedAt: previewDate,
    updatedAt: previewDate,
    tags: "PPh Final, UMKM, PP 55/2022",
    seoTitle: null,
    seoDescription: null,
    content:
      "## Skema PPh Final UMKM\n\nPP 55 Tahun 2022 mengatur skema PPh Final bagi Wajib Pajak tertentu dengan peredaran bruto sesuai ketentuan.\n\nKetentuan dapat berubah dan penerapannya bergantung pada profil Wajib Pajak. Rujuk teks resmi peraturan dan berkonsultasilah untuk kasus spesifik.",
  },
];
