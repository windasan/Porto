/**
 * components/Navbar.tsx
 *
 * Public-facing navigation bar.
 *
 * Features:
 *  - Logo / name link (left)
 *  - Nav links: Home, Experience, Work, Blog, Contact (center/right)
 *  - Theme Toggle button (far right)
 *  - Mobile hamburger menu (Sheet/drawer pattern without Radix dependency)
 *  - Scroll-aware: adds a subtle backdrop blur + border when user scrolls down
 *  - Active route highlighting via `usePathname()`
 *
 * This is a Client Component because it needs:
 *  - `usePathname` (router state)
 *  - `useState` (mobile menu open/close)
 *  - scroll event listener
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ── Nav links definition ───────────────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/",           label: "Home"       },
  { href: "/experience", label: "Experience" },
  { href: "/work",       label: "Work"       },
  { href: "/blog",       label: "Blog"       },
  { href: "/contact",    label: "Contact"    },
] as const;

/* ── Component ──────────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname    = usePathname();
  const [open, setOpen]       = useState(false);      // mobile menu
  const [scrolled, setScrolled] = useState(false);    // scroll state
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Scroll listener ─────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile menu when route changes ────────────────────────────────
  useEffect(() => setOpen(false), [pathname]);

  // ── Close mobile menu on outside click ──────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Lock body scroll when mobile menu is open ───────────────────────────
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── Active link helper ──────────────────────────────────────────────────
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Main navbar ─────────────────────────────────────────────────── */}
      <header
        className={[
          // Position & layout
          "fixed top-0 left-0 right-0 z-50",
          "flex h-14 items-center",
          // Scroll-aware style
          scrolled
            ? "border-b border-border bg-surface/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
          "transition-all duration-300 ease-in-out",
        ].join(" ")}
        role="banner"
      >
        <nav
          className="wide-layout flex w-full items-center justify-between"
          aria-label="Main navigation"
        >

          {/* ── Logo / Name ───────────────────────────────────────────── */}
         <Link
            href="/"
            className={[
              // 1. Ubah gap-2 menjadi gap-0 (atau hapus class gap sepenuhnya)
              "group flex items-center gap-0.5", 
              "text-sm font-semibold tracking-tight text-primary",
              "transition-opacity duration-150 hover:opacity-70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "rounded-md",
            ].join(" ")}
            aria-label="Go to homepage"
          >
            {/* Monogram mark */}
            <span
              className={[
                // 2. Jika kotaknya dirasa mengganggu kedempetan teks, 
                // kamu bisa mengatur padding atau merubah tampilan kotak ini.
                // Tapi untuk sekarang, kita biarkan saja format kotaknya.
                "flex h-6 w-6 items-center justify-center rounded-md",
                "bg-primary text-surface text-s font-bold",
                "transition-transform duration-200 group-hover:scale-95",
              ].join(" ")}
              aria-hidden
            >
              Cy
            </span>
            <span className="hidden sm:inline">borged</span>
          </Link>

          {/* ── Desktop nav links ─────────────────────────────────────── */}
          <ul
            className="hidden md:flex items-center gap-1"
            role="list"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "relative px-3 py-1.5 rounded-md text-sm transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive(href)
                      ? "text-primary font-medium"
                      : "text-muted hover:text-primary hover:bg-surface-raised",
                  ].join(" ")}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  {label}
                  {/* Active underline indicator */}
                  {isActive(href) && (
                    <span
                      className="absolute inset-x-3 -bottom-px h-px bg-primary rounded-full"
                      aria-hidden
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right actions ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              className={[
                "md:hidden flex h-8 w-8 items-center justify-center rounded-lg",
                "text-muted hover:text-primary hover:bg-surface-raised",
                "border border-transparent hover:border-border",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              ].join(" ")}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open
                ? <X size={15} strokeWidth={1.75} />
                : <Menu size={15} strokeWidth={1.75} />
              }
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu overlay ──────────────────────────────────────────── */}
      {/*
       * Full-screen drawer that slides in from the top on mobile.
       * Uses a simple CSS transition — no Radix/Dialog dependency.
       */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={[
          // Position
          "fixed inset-0 z-40 md:hidden",
          // Background
          "bg-surface/95 backdrop-blur-lg",
          // Transition
          "transition-all duration-300 ease-in-out",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* Spacer — pushes links below the navbar */}
        <div className="h-14" />

        <ul
          className="flex flex-col gap-1 px-4 pt-6"
          role="list"
        >
          {NAV_LINKS.map(({ href, label }, i) => (
            <li
              key={href}
              // Staggered slide-in animation
              style={{ animationDelay: `${i * 40}ms` }}
              className={open ? "animate-fade-up" : ""}
            >
              <Link
                href={href}
                className={[
                  "flex items-center px-4 py-3 rounded-xl text-base",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive(href)
                    ? "text-primary font-semibold bg-surface-raised"
                    : "text-secondary hover:text-primary hover:bg-surface-raised",
                ].join(" ")}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Navbar spacer — prevents content from hiding under fixed navbar */}
      <div className="h-14" aria-hidden />
    </>
  );
}
