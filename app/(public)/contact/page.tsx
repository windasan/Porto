/**
 * app/(public)/contact/page.tsx
 *
 * Contact page — clean form + social links.
 * Uses a React Server Action (Next.js 14) for form submission so the page
 * works without any client-side JavaScript bundle.
 *
 * For the contact form backend, use Resend (https://resend.com) or
 * Supabase Edge Functions. The `sendMessage` action below is wired to
 * Resend as an example — swap in your preferred email provider.
 */

import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — I'm always open to interesting conversations.",
};

const SOCIAL_LINKS = [
  {
    href:  "mailto:you@example.com",
    label: "Email",
    handle:"you@example.com",
    icon:  Mail,
  },
  {
    href:  "https://github.com/yourusername",
    label: "GitHub",
    handle:"@yourusername",
    icon:  Github,
  },
  {
    href:  "https://twitter.com/yourhandle",
    label: "Twitter / X",
    handle:"@yourhandle",
    icon:  Twitter,
  },
  {
    href:  "https://linkedin.com/in/yourname",
    label: "LinkedIn",
    handle:"linkedin.com/in/yourname",
    icon:  Linkedin,
  },
] as const;

export default function ContactPage() {
  return (
    <div className="prose-layout py-16 md:py-24">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-14 animate-fade-up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          Get in touch
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Contact
        </h1>
        <p className="mt-3 text-base text-muted max-w-md">
          Whether you have a project in mind, a question, or just want to say
          hello — my inbox is always open.
        </p>
      </header>

      <div className="grid gap-12 md:grid-cols-[1fr_280px]">

        {/* ── Contact form ─────────────────────────────────────────────── */}
        <ContactForm />

        {/* ── Social links ─────────────────────────────────────────────── */}
        <aside>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
            Find me elsewhere
          </h2>
          <ul className="space-y-3">
            {SOCIAL_LINKS.map(({ href, label, handle, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={[
                    "group flex items-center gap-3 rounded-xl p-3 -mx-3",
                    "text-secondary hover:text-primary hover:bg-surface-raised",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  ].join(" ")}
                >
                  <span className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    "border border-border bg-surface text-muted",
                    "group-hover:text-primary group-hover:border-primary transition-colors",
                  ].join(" ")}>
                    <Icon size={14} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-medium text-primary">
                      {label}
                    </span>
                    <span className="block text-xs text-muted truncate max-w-[160px]">
                      {handle}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </div>
  );
}
