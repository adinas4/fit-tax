// Seed data for CV CAKRAWALA INTI TEKNIK
// Run: bun run scripts/seed.ts
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";
import { DEFAULT_SETTINGS } from "../src/lib/settings";

const IMG = (n: string) => `/images/${n}`;

const services = [
  {
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
    position: 1,
  },
  {
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
    position: 2,
  },
  {
    name: "Jasa Banding & Keberatan Pajak",
    slug: "jasa-banding-keberatan-pajak",
    short:
      "Pendampingan proses keberatan hingga banding untuk menjaga hak-hak perpajakan Anda.",
    benefits: [
      "Pendampingan proses keberatan pajak",
      "Penjagaan hak-hak Wajib Pajak",
      "Penyusunan dokumen pendukbandingan",
    ],
    details: [
      "Penyiapan dokumen keberatan atas ketetapan pajak.",
      "Pendampingan proses keberatan sesuai ketentuan.",
      "Pendampingan proses banding bila diperlukan.",
    ],
    iconName: "Scale",
    position: 3,
  },
  {
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
    position: 4,
  },
  {
    name: "In-house Training Perpajakan",
    slug: "in-house-training-perpajakan",
    short:
      "Pelatihan perpajakan untuk perusahaan, UMKM, dan organisasi.",
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
    position: 5,
  },
];

const team = [
  {
    name: "Rohmah Arsiyah, S.A.P., M.A., CTAP, BKP",
    role: "Founder",
    credentials: "S.A.P., M.A., CTAP, BKP",
    bio: "Founder CV Cakrawala Inti Teknik dengan pengalaman di bidang perpajakan dan akuntansi.",
    position: 1,
  },
  {
    name: "Hermawati Nurciptaning Arum, S.Ak., M.Ak, CA, Akt",
    role: "Partner",
    credentials: "S.Ak., M.Ak, CA, Akt",
    bio: "Partner dengan keahlian di bidang akuntansi dan perpajakan.",
    position: 2,
  },
  {
    name: "Dian Ardianto, S.E., M.Ak",
    role: "Partner",
    credentials: "S.E., M.Ak",
    bio: "Partner dengan pengalaman dalam konsultasi perpajakan dan akuntansi.",
    position: 3,
  },
];

const articles = [
  {
    title: "Memahami Coretax: Sistem Administrasi Perpajakan Terintegrasi DJP",
    slug: "memahami-coretax-sistem-administrasi-perpajakan-djp",
    excerpt:
      "Coretax merupakan sistem administrasi perpajakan terintegrasi yang dikembangkan Direktorat Jenderal Pajak. Pahami ruang lingkup dan implikasinya bagi Wajib Pajak.",
    category: "Regulasi Pajak",
    tags: "Coretax, DJP, administrasi perpajakan, sistem perpajakan",
    coverImage: IMG("tax-documents.jpg"),
    readingMinutes: 6,
    isPopular: true,
    seoTitle: "Memahami Coretax: Sistem Administrasi Perpajakan DJP",
    seoDescription:
      "Penjelasan ruang lingkup Coretax sebagai sistem administrasi perpajakan terintegrasi DJP dan implikasinya bagi Wajib Pajak.",
    content: `## Apa Itu Coretax?

Coretax merupakan sistem administrasi perpajakan terintegrasi yang dikembangkan oleh Direktorat Jenderal Pajak (DJP) sebagai bagian dari modernisasi administrasi perpajakan nasional. Sistem ini mengintegrasikan berbagai layanan perpajakan ke dalam satu platform tunggal, mulai dari pendaftaran, pencatatan transaksi, pembayaran, hingga pelaporan dan pemeriksaan.

> Catatan: Detail teknis dan jadwal penerapan Coretax dapat berubah. Selalu rujuk informasi resmi pada situs Direktorat Jenderal Pajak (pajak.go.id) untuk pembaruan terkini.

## Ruang Lingkup Coretax

Secara umum, Coretax mencakup modul-modul utama administrasi perpajakan berikut:

1. **Registrasi Wajib Pajak** — pengelolaan data Wajib Pajak termasuk NPWP.
2. **Pencatatan dan Pelaporan** — penyampaian SPT dan dokumen pelaporan lainnya.
3. **Pembayaran** — administrasi pembayaran pajak dan rekonsiliasi.
4. **Restitusi dan Kompenasi** — pengelolaan permohonan pengembalian kelebihan bayar.
5. **Pemeriksaan dan Penagihan** — dukungan proses pemeriksaan hingga penagihan pajak.

## Implikasi bagi Wajib Pajak

Bagi Wajib Pajak, kehadiran sistem terintegrasi membawa sejumlah konsekuensi administratif:

- **Konsolidasi data:** seluruh data perpajakan Wajib Pajak berada dalam satu profil terpadu.
- **Pelaporan digital:** pelaporan dilakukan secara elektronik melalui sistem yang disediakan DJP.
- **Kepatuhan dokumen:** kelengkapan dan konsistensi dokumen pendukung menjadi semakin penting.

## Penutup

Coretax merupakan bagian dari upaya modernisasi administrasi perpajakan yang bertujuan meningkatkan kepatuhan dan efisiensi. Pemahaman atas sistem ini membantu Wajib Pajak dalam memenuhi kewajibannya secara tertib.

Artikel ini bersifat edukatif dan tidak menggantikan nasihat pajak formal. Untuk informasi resmi, silakan merujuk pada situs Direktorat Jenderal Pajak.`,
  },
  {
    title: "PPh Final UMKM: Memahami PP 55 Tahun 2022",
    slug: "pph-final-umkm-pp-55-tahun-2022",
    excerpt:
      "Peraturan Pemerintah Nomor 55 Tahun 2022 mengatur Pajak Penghasilan Final atas pendapatan bruto UMKM dengan tarif progresif. Simak penjelasannya.",
    category: "Pajak Perusahaan",
    tags: "PPh Final, UMKM, PP 55/2022, pajak UMKM",
    coverImage: IMG("accounting-ledger.jpg"),
    readingMinutes: 7,
    isPopular: true,
    seoTitle: "PPh Final UMKM PP 55 Tahun 2022: Tarif dan Ketentuan",
    seoDescription:
      "Penjelasan Pajak Penghasilan Final UMKM berdasarkan PP 55 Tahun 2022, termasuk tarif progresif dan batas omzet.",
    content: `## Pengantar

Usaha Mikro, Kecil, dan Menengah (UMKM) memiliki skema perpajakan khusus berupa Pajak Penghasilan (PPh) Final. Pengaturan terbaru atas skema ini tertuang dalam **Peraturan Pemerintah Nomor 55 Tahun 2022** yang mulai berlaku per 1 Januari 2023, menggantikan PP Nomor 23 Tahun 2018.

## Tarif Progresif

PP 55 Tahun 2022 memperkenalkan tarif yang bersifat progresif berdasarkan peredaran bruto tahunan:

1. **Peredaran bruto sampai dengan Rp 500.000.000** dalam setahun — tarif 0,5%.
2. **Peredaran bruto di atas Rp 500.000.000 sampai dengan Rp 4.800.000.000** — tarif 0,6% untuk bagian di atas Rp 500.000.000.
3. **Peredaran bruto di atas Rp 4.800.000.000** — tarif 0,75% berlaku atas seluruh peredaran bruto.

> Catatan: Angka batas dan tarif di atas merupakan ringkasan kerangka ketentuan. Selalu verifikasi pada teks resmi PP 55 Tahun 2022 dan perubahannya.

## Batas Peredaran Bruto

Skema PPh Final UMKM berlaku untuk Wajib Pajak yang memiliki peredaran bruto **paling tinggi Rp 4.800.000.000** dalam satu tahun pajak. Apabila peredaran bruto melampaui batas tersebut, Wajib Pajak wajib menggunakan tarif umum PPh.

## Penutup

PP 55 Tahun 2022 memberikan skema yang lebih proporsional bagi UMKM melalui tarif progresif. Pemahaman atas ketentuan ini penting agar Wajib Pajak dapat memenuhi kewajibannya dengan tepat.

Artikel ini bersifat edukatif. Untuk penerapan terhadap kasus spesifik, disarankan berkonsultasi dengan konsultan pajak dan merujuk pada teks resmi peraturan.`,
  },
  {
    title: "Panduan Pelaporan SPT Tahunan Orang Pribadi",
    slug: "panduan-pelaporan-spt-tahunan-orang-pribadi",
    excerpt:
      "Pelaporan SPT Tahunan Orang Pribadi merupakan kewajiban tahunan Wajib Pajak. Pahami jenis formulir, batas waktu, dan langkah pelaporannya.",
    category: "SPT Tahunan",
    tags: "SPT Tahunan, SPT Orang Pribadi, pelaporan pajak",
    coverImage: IMG("tax-paperwork.jpg"),
    readingMinutes: 6,
    isPopular: true,
    seoTitle: "Panduan Pelaporan SPT Tahunan Orang Pribadi",
    seoDescription:
      "Jenis formulir, batas waktu, dan langkah pelaporan SPT Tahunan Orang Pribadi untuk pemenuhan kewajiban perpajakan.",
    content: `## Apa Itu SPT Tahunan?

Surat Pemberitahuan (SPT) Tahunan merupakan laporan formal Wajib Pajak kepada Direktorat Jenderal Pajak mengenai penghasilan yang diperoleh selama satu tahun pajak. Untuk Wajib Pajak orang pribadi, SPT Tahunan disampaikan paling lambat **31 Maret** tahun berikutnya.

## Jenis Formulir SPT Tahunan Orang Pribadi

1. **SPT 1770** — untuk Wajib Pajak dengan penghasilan dari lebih dari satu pemberi kerja, usaha, atau penghasilan lainnya.
2. **SPT 1770 S** — untuk Wajib Pajak dengan penghasilan dari satu pemberi kerja atau lebih, tanpa usaha.
3. **SPT 1770 SS** — formulir ringkas untuk Wajib Pajak dengan penghasilan bruto tahunan di bawah batas tertentu.

## Langkah Pelaporan

1. Siapkan dokumen pendukung — bukti potong PPh dan lampiran pendapatan.
2. Hitung penghasilan neto dan PPh terutang.
3. Hitung jumlah PPh yang telah dipotong sebagai kredit pajak.
4. Lakukan pelaporan melalui sistem elektronik yang disediakan DJP.

## Penutup

Pelaporan SPT Tahunan merupakan kewajiban penting yang sebaiknya dilakukan secara tertib dan tepat waktu. Untuk kasus spesifik, disarankan merujuk pada peraturan resmi dan berkonsultasi dengan konsultan pajak.`,
  },
  {
    title: "PPh Pasal 21: Dasar Pemotongan dan Kewajiban Pemberi Kerja",
    slug: "pph-pasal-21-dasar-pemotongan-dan-kewajiban",
    excerpt:
      "Pajak Penghasilan Pasal 21 dipotong atas penghasilan sehubungan dengan pekerjaan. Pahami dasar pemotongan dan kewajiban pemberi kerja.",
    category: "PPN dan PPh",
    tags: "PPh 21, pajak penghasilan, pemotongan pajak, pemberi kerja",
    coverImage: IMG("team-presentation.jpg"),
    readingMinutes: 6,
    isPopular: false,
    seoTitle: "PPh Pasal 21: Dasar Pemotongan dan Kewajiban Pemberi Kerja",
    seoDescription:
      "Penjelasan Pajak Penghasilan Pasal 21, objek pemotongan, dan kewajiban pemberi kerja sebagai pemotong pajak.",
    content: `## Pengertian PPh Pasal 21

Pajak Penghasilan (PPh) Pasal 21 merupakan pajak yang dipotong atas penghasilan sehubungan dengan pekerjaan, jasa, atau kegiatan orang pribadi.

## Kewajiban Pemberi Kerja

Sebagai pemotong PPh Pasal 21, pemberi kerja memiliki kewajiban:

- Melakukan pemotongan PPh Pasal 21 setiap kali membayarkan penghasilan.
- Menyetorkan PPh yang dipotong ke kas negara sesuai jadwal.
- Melaporkan pemotongan melalui SPT Masa PPh Pasal 21 setiap bulan.
- Menerbitkan bukti potong kepada penerima penghasilan.

## Penutup

PPh Pasal 21 merupakan komponen penting dalam pemenuhan kewajiban perpajakan pemberi kerja. Untuk penerapan spesifik, rujuk peraturan resmi dan berkonsultasilah dengan konsultan pajak.`,
  },
  {
    title: "Pajak Pertambahan Nilai (PPN): Konsep Dasar dan Penerapannya",
    slug: "pajak-pertambahan-nilai-ppn-konsep-dasar",
    excerpt:
      "Pajak Pertambahan Nilai merupakan pajak atas konsumsi barang dan jasa. Pahami konsep dasar, subjek, dan mekanisme pemungutannya.",
    category: "Edukasi Perpajakan",
    tags: "PPN, pajak pertambahan nilai, PKP, kredit pajak",
    coverImage: IMG("finance-review.jpg"),
    readingMinutes: 7,
    isPopular: true,
    seoTitle: "Pajak Pertambahan Nilai (PPN): Konsep Dasar dan Penerapan",
    seoDescription:
      "Penjelasan konsep dasar Pajak Pertambahan Nilai, subjek pajak, PKP, dan mekanisme kredit pajak.",
    content: `## Apa Itu Pajak Pertambahan Nilai?

Pajak Pertambahan Nilai (PPN) merupakan pajak tidak langsung yang dikenakan atas konsumsi Barang Kena Pajak (BKP) maupun Jasa Kena Pajak (JKP).

## Mekanisme Kredit Pajak

- **PPN Keluaran** — PPN yang dipungut atas penyerahan BKP/JKP.
- **PPN Masukan** — PPN yang dibayar atas perolehan BKP/JKP.
- **PPN Terutang** — selisih antara PPN Keluaran dan PPN Masukan.

## Penutup

Pemahaman konsep dasar PPN membantu pengusaha dalam memenuhi kewajiban perpajakannya secara tertib. Untuk penerapan spesifik, rujuk peraturan resmi dan berkonsultasilah dengan konsultan pajak.`,
  },
  {
    title: "Tips Kepatuhan Pajak untuk Perusahaan",
    slug: "tips-kepatuhan-pajak-untuk-perusahaan",
    excerpt:
      "Kepatuhan perpajakan yang tertib membantu perusahaan menghindari risiko administratif. Simak tips praktis untuk menjaga kepatuhan pajak.",
    category: "Tips Kepatuhan Pajak",
    tags: "kepatuhan pajak, tips pajak, administrasi pajak perusahaan",
    coverImage: IMG("tax-calculator.jpg"),
    readingMinutes: 5,
    isPopular: false,
    seoTitle: "Tips Kepatuhan Pajak untuk Perusahaan",
    seoDescription:
      "Tips praktis menjaga kepatuhan perpajakan perusahaan: administrasi, pelaporan, dan dokumentasi.",
    content: `## Pentingnya Kepatuhan Perpajakan

Kepatuhan perpajakan merupakan aspek penting dalam tata kelola perusahaan yang baik.

## Tips Menjaga Kepatuhan Pajak

1. Tata administrasi dan pencatatan transaksi secara rapi.
2. Kelola dokumen pendukung seperti faktur pajak dan bukti potong.
3. Patuhi jadwal pelaporan SPT Masa dan SPT Tahunan.
4. Periksa konsistensi data antara pembukuan dan laporan perpajakan.
5. Pantau perubahan regulasi perpajakan.
6. Lakukan pelatihan tim internal secara berkala.

## Penutup

Kepatuhan perpajakan bukan sekadar kewajiban, melainkan bagian dari tata kelola perusahaan yang sehat. Untuk penerapan spesifik, rujuk peraturan resmi dan berkonsultasilah dengan konsultan pajak.`,
  },
  {
    title: "NPWP: Pengertian dan Kewajiban Mendaftar sebagai Wajib Pajak",
    slug: "npwp-pengertian-dan-kewajiban-mendaftar-wajib-pajak",
    excerpt:
      "Nomor Pokok Wajib Pajak merupakan identitas Wajib Pajak. Pahami pengertian, fungsi, dan kewajiban pendaftaran NPWP.",
    category: "Pajak Orang Pribadi",
    tags: "NPWP, Wajib Pajak, registrasi pajak, identitas pajak",
    coverImage: IMG("consult-strategy.jpg"),
    readingMinutes: 5,
    isPopular: false,
    seoTitle: "NPWP: Pengertian dan Kewajiban Mendaftar sebagai Wajib Pajak",
    seoDescription:
      "Penjelasan Nomor Pokok Wajib Pajak, fungsi, dan kewajiban pendaftaran bagi Wajib Pajak orang pribadi maupun badan.",
    content: `## Apa Itu NPWP?

Nomor Pokok Wajib Pajak (NPWP) merupakan nomor identitas yang diberikan oleh Direktorat Jenderal Pajak kepada Wajib Pajak.

## Kewajiban Mendaftar

Setiap Wajib Pajak yang telah memenuhi persyaratan subjektif dan objektif sesuai ketentuan wajib mendaftarkan diri untuk memperoleh NPWP.

## Penutup

NPWP merupakan fondasi administrasi perpajakan bagi setiap Wajib Pajak. Untuk panduan teknis pendaftaran, rujuk situs resmi DJP dan berkonsultasilah dengan konsultan pajak bila diperlukan.`,
  },
];

const portfolio = [
  {
    title: "Penataan Kewajiban Pajak Badan Usaha Jasa",
    category: "Compliance Tax",
    industry: "Jasa Profesional",
    year: "2024",
    image: IMG("consult-discussion.jpg"),
    challenge:
      "Perusahaan jasa memerlukan pemetaan kewajiban perpajakan yang sesuai dengan kegiatan usahanya, termasuk pengelolaan PPN dan PPh yang terutang atas penyerahan jasa.",
    approach:
      "Tim kami melakukan tinjauan atas kegiatan usaha, struktur transaksi, dan administrasi yang berjalan, kemudian menyusun kerangka pemenuhan kewajiban perpajakan yang terstruktur sesuai ketentuan yang berlaku.",
    result:
      "Disusunnya kerangka administrasi dan pelaporan perpajakan yang lebih tertib, serta peningkatan pemahaman tim internal terhadap kewajiban yang melekat pada kegiatan usaha.",
  },
  {
    title: "Konsultasi Pajak untuk Wajib Pajak Orang Pribadi",
    category: "Konsultasi Pajak Individu",
    industry: "Individu",
    year: "2024",
    image: IMG("consult-strategy.jpg"),
    challenge:
      "Wajib Pajak orang pribadi dengan sumber penghasilan beragam memerlukan pemahaman atas kewajiban pelaporan yang tepat sesuai profil penghasilannya.",
    approach:
      "Pendampingan dilakukan melalui pemetaan sumber penghasilan, perhitungan kewajiban, serta penyiapan dokumen pendukung untuk pelaporan SPT Tahunan.",
    result:
      "Tersusunnya pelaporan yang sesuai profil penghasilan dan terdokumentasinya informasi yang diperlukan untuk pemenuhan kewajiban tahunan.",
  },
  {
    title: "Pendampingan Pelaporan Pajak Berkala",
    category: "Pendampingan Pelaporan Pajak",
    industry: "Perdagangan",
    year: "2023",
    image: IMG("tax-calculator.jpg"),
    challenge:
      "Perusahaan dagang memerlukan pendampingan pelaporan SPT Masa secara berkala dengan tingkat akurasi dan ketepatan waktu yang tinggi.",
    approach:
      "Kami menyusun jadwal pelaporan, melakukan rekonsiliasi data transaksi, serta mendampingi penyampaian SPT Masa sesuai jadwal yang berlaku.",
    result:
      "Pelaporan SPT Masa tersampaikan secara tertib dan tepat waktu, dengan administrasi dokumen yang lebih rapi.",
  },
  {
    title: "Tax Review Administrasi Perpajakan",
    category: "Tax Review",
    industry: "Manufaktur",
    year: "2024",
    image: IMG("finance-review.jpg"),
    challenge:
      "Perusahaan manufaktur memerlukan tinjauan menyeluruh atas administrasi perpajakan untuk mengidentifikasi potensi risiko dan area perbaikan.",
    approach:
      "Tim melakukan review atas pencatatan transaksi, faktur pajak, dan konsistensi data antara pembukuan dengan laporan perpajakan, lalu menyusun rekomendasi perbaikan.",
    result:
      "Tersusunnya daftar area perbaikan administrasi serta rekomendasi yang dapat dijadikan dasar peningkatan kepatuhan ke depan.",
  },
  {
    title: "Pendampingan Administrasi Pengukuhan PKP",
    category: "Pendampingan Administrasi Pajak",
    industry: "Startup / Teknologi",
    year: "2023",
    image: IMG("consult-handshake.jpg"),
    challenge:
      "Perusahaan rintisan memerlukan pendampingan dalam pengelolaan administrasi perpajakan, termasuk pengukuhan status sebagai Pengusaha Kena Pajak.",
    approach:
      "Kami membantu penyiapan dokumen, pendampingan proses administrasi di sistem DJP, serta penjelasan kewajiban yang melekat pasca pengukuhan.",
    result:
      "Status administrasi perpajakan menjadi lebih jelas dan tim internal memahami kewajiban yang harus dipenuhi secara berkelanjutan.",
  },
  {
    title: "In-house Training Perpajakan untuk Tim Internal",
    category: "In-house Training",
    industry: "Multi Industri",
    year: "2024",
    image: IMG("team-boardroom.jpg"),
    challenge:
      "Perusahaan memerlukan peningkatan pemahaman tim internal terhadap kewajiban perpajakan dasar yang relevan dengan kegiatan operasionalnya.",
    approach:
      "Materi pelatihan disusun sesuai kebutuhan, mencakup konsep dasar perpajakan, kewajiban pelaporan, serta praktik administrasi yang tertib.",
    result:
      "Peningkatan pemahaman tim internal serta tersusunnya panduan praktis untuk mendukung kepatuhan administrasi sehari-hari.",
  },
];

async function main() {
  // Safety guard: in production it is dangerous to re-run the seed because it
  // wipes services / team / portfolio. Skip the destructive content seeding
  // when the database already has content, unless FORCE_SEED=1 is set.
  // The admin-user step below is always safe (it upserts / opt-in reset).
  const forceSeed = process.env.FORCE_SEED === "1";
  const existingServices = await db.service.count();
  const skipContent = existingServices > 0 && !forceSeed;

  if (skipContent) {
    console.log("Database already has content — skipping content seed.");
    console.log("Set FORCE_SEED=1 to re-seed (this will replace services/team/portfolio).");
  } else {
    console.log("Seeding site settings...");
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }

    console.log("Seeding services...");
    await db.service.deleteMany({});
    for (const s of services) {
      await db.service.create({
        data: {
          name: s.name,
          slug: s.slug,
          short: s.short,
          benefits: JSON.stringify(s.benefits),
          details: JSON.stringify(s.details),
          iconName: s.iconName,
          position: s.position,
          published: true,
        },
      });
      console.log("  -", s.slug);
    }

    console.log("Seeding team members...");
    await db.teamMember.deleteMany({});
    for (const t of team) {
      await db.teamMember.create({
        data: {
          name: t.name,
          role: t.role,
          credentials: t.credentials,
          bio: t.bio,
          position: t.position,
          published: true,
        },
      });
      console.log("  -", t.name);
    }

    console.log("Seeding articles...");
    for (const a of articles) {
      const existing = await db.article.findUnique({ where: { slug: a.slug } });
      const base = {
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        tags: a.tags,
        coverImage: a.coverImage,
        readingMinutes: a.readingMinutes,
        isPopular: a.isPopular,
        published: true,
        author: "Tim FIT-TAX Cakrawala Sinergi",
        seoTitle: a.seoTitle,
        seoDescription: a.seoDescription,
        publishedAt: new Date(),
      };
      if (existing) {
        await db.article.update({ where: { slug: a.slug }, data: base });
      } else {
        await db.article.create({ data: { slug: a.slug, ...base } });
      }
    }
    console.log("  Articles:", articles.length);

    console.log("Seeding portfolio...");
    await db.portfolioItem.deleteMany({});
    for (const p of portfolio) {
      await db.portfolioItem.create({
        data: {
          title: p.title,
          category: p.category,
          industry: p.industry,
          year: p.year,
          challenge: p.challenge,
          approach: p.approach,
          result: p.result,
          image: p.image,
          isExample: true,
          published: true,
        },
      });
    }
    console.log("  Portfolio:", portfolio.length);
  }

  console.log("Seeding admin user...");
  // Admin credentials are configurable via env vars for production deployments.
  // Falls back to the development defaults below.
  const adminEmail = process.env.ADMIN_EMAIL || "admin@cakrawalaintiteknik.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Administrator";
  const existingAdmin = await db.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await db.adminUser.create({
      data: {
        email: adminEmail,
        name: adminName,
        role: "admin",
        passwordHash: hashPassword(adminPassword),
      },
    });
    console.log("  Created admin:", adminEmail);
  } else {
    // Only reset the password if the admin explicitly opted in via RESET_ADMIN=1.
    // This avoids clobbering a password the operator may have already changed.
    if (process.env.RESET_ADMIN === "1") {
      await db.adminUser.update({
        where: { email: adminEmail },
        data: { passwordHash: hashPassword(adminPassword), name: adminName },
      });
      console.log("  Reset admin password for:", adminEmail);
    } else {
      console.log("  Admin already exists (skipped). Set RESET_ADMIN=1 to reset password.");
    }
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
