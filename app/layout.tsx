/**
 * app/layout.tsx — Root Layout untuk Portofolio Edwinda Santosa
 * * Pastikan Anda memiliki file berikut di folder /public:
 * 1. /public/favicon.ico      (Ikon tab browser)
 * 2. /public/logo.png         (Logo utama)
 * 3. /public/og-image.png     (Gambar thumbnail share 1200x630)
 */

import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@/app/globals.css";

/* ── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Edwinda Santosa — Full-stack Developer & Cyber Security Analyst",
    template: "%s · Edwinda Santosa",
  },
  description:
    "Portofolio profesional Edwinda Santosa (Cyborged1) — Full-stack Web Developer dan Cyber Security Analyst yang berfokus pada pengembangan aplikasi aman dan analisis data.",
  keywords: [
    "Edwinda Santosa",
    "Cyborged1",
    "Full-stack Developer",
    "Cyber Security Analyst",
    "Next.js",
    "TypeScript",
    "Web Security",
    "Forensics",
    "Portfolio"
  ],
  authors: [{ name: "Edwinda Santosa" }],
  creator: "Edwinda Santosa",

  // ── Icons (Favicon & Apple Touch Icon) ───────────────────────────────────
  icons: {
    icon: "/image/logo.png",
    shortcut: "/image/logo.png",
    apple: "/image/logo.png",
  },

  // ── Open Graph (Tampilan saat link dibagikan) ─────────────────────────────
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://cryed.cloud", // Ganti dengan domain asli Anda nanti
    siteName: "Edwinda Santosa",
    title: "Edwinda Santosa — IT Enthusiast",
    description: "Personal portfolio of Edwinda Santosa.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edwinda Santosa Portfolio Preview",
      },
    ],
  },

  // ── Twitter Card ────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Edwinda Santosa ",
    description: "Cyber Security Analyst & Web Developer Portfolio.",
    images: ["/og-image.png"],
    creator: "@cyborged1", // Ganti dengan handle Twitter Anda
  },

  // ── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#21252a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

/* ── Root Layout ─────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}