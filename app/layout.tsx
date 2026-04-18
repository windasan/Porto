/**
 * app/layout.tsx  — Root Layout
 *
 * Responsibilities:
 *  1. Set <html> metadata (lang, font CSS variables)
 *  2. Wrap the entire app in <ThemeProvider> from next-themes
 *     - defaultTheme: "dark"   → brand dark charcoal default
 *     - attribute: "class"     → Tailwind `dark` class strategy
 *  3. Import global styles
 *
 * NOTE: This is a pure Server Component. No "use client" here.
 * The ThemeProvider wrapper IS a Client Component (see providers/ThemeProvider.tsx).
 */

import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@/app/globals.css";

/* ── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default:  "Your Name — Developer & Designer",
    template: "%s · Your Name",
  },
  description:
    "Personal portfolio of [Your Name] — full-stack developer specialising in " +
    "web applications, open-source, and clean user interfaces.",
  keywords: ["developer", "portfolio", "next.js", "typescript", "full-stack"],
  authors:  [{ name: "Your Name", url: "https://yoursite.com" }],
  creator:  "Your Name",

  // ── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type:      "website",
    locale:    "en_US",
    url:       "https://yoursite.com",
    siteName:  "Your Name",
    title:     "Your Name — Developer & Designer",
    description:
      "Personal portfolio of [Your Name] — full-stack developer.",
  },

  // ── Twitter Card ────────────────────────────────────────────────────────
  twitter: {
    card:    "summary_large_image",
    creator: "@yourhandle",
    title:   "Your Name — Developer & Designer",
  },

  // ── Robots ──────────────────────────────────────────────────────────────
  robots: {
    // Keep /admin paths unindexed — belt-and-suspenders alongside middleware
    index:           true,
    follow:          true,
    googleBot: {
      index:  true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#21252a" },
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
    /*
     * suppressHydrationWarning is required on <html> when using next-themes.
     * next-themes injects the theme class synchronously via a script tag to
     * avoid FOUC, which causes a React hydration mismatch warning without it.
     */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
