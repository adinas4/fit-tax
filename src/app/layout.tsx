import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.cakrawalaintiteknik.com"
  ),
  title: {
    default: "FIT-TAX Cakrawala Sinergi | Konsultan Pajak & Akuntansi Profesional",
    template: "%s | FIT-TAX Cakrawala Sinergi",
  },
  description:
    "FIT-TAX Cakrawala Sinergi — konsultan pajak profesional. Layanan compliance tax, pendampingan pemeriksaan pajak, banding & keberatan, jasa akuntansi, dan in-house training perpajakan.",
  keywords: [
    "konsultan pajak",
    "konsultan pajak Semarang",
    "jasa konsultasi perpajakan",
    "compliance tax",
    "pendampingan pemeriksaan pajak",
    "jasa akuntansi",
    "in-house training perpajakan",
    "CV Cakrawala Inti Teknik",
    "FIT-TAX Cakrawala Sinergi",
    "konsultan pajak perusahaan",
    "pajak Indonesia",
  ],
  authors: [{ name: "FIT-TAX Cakrawala Sinergi" }],
  creator: "FIT-TAX Cakrawala Sinergi",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: "FIT-TAX Cakrawala Sinergi | Konsultan Pajak & Akuntansi Profesional",
    description:
      "Konsultan pajak profesional, aman, cepat, dan transparan. Layanan compliance tax, tax audit, banding & keberatan, akuntansi, dan training perpajakan.",
    url: "https://www.cakrawalaintiteknik.com",
    siteName: "FIT-TAX Cakrawala Sinergi",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIT-TAX Cakrawala Sinergi | Konsultan Pajak Profesional",
    description:
      "Konsultan pajak profesional, aman, cepat, dan transparan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
