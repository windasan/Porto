/**
 * app/(public)/page.tsx  — Home Page
 *
 * Hero section + Pop-out Profile + 3 Latest Blog Cards + About snippet.
 */

export const dynamic = "force-dynamic"; // Mencegah error Next.js static build

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Github, Twitter, Linkedin, Calendar, Image as ImageIcon } from "lucide-react";



interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_url: string; // atau cover_url, sesuaikan dengan database kamu
  created_at: string;
}

const SOCIAL_LINKS = [
  { href: "https://github.com/windasan",   label: "GitHub",   icon: Github   },
  { href: "https://twitter.com/",    label: "Twitter",  icon: Twitter  },
  { href: "https://linkedin.com/in/",  label: "LinkedIn", icon: Linkedin },
] as const;

// ── Data Fetching dari Supabase ───────────────────────────────────────────────
async function getLatestPosts() {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  // Paksa TypeScript menganggap data ini sebagai array dari Post
  return (data as Post[]) ?? [];
}

// ── Helper Formatter ──────────────────────────────────────────────────────────
function formatDate(dateString: string) {
  if (!dateString) return "No date";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const recentPosts = await getLatestPosts();

  return (
    <div className="prose-layout flex flex-col justify-center py-12 md:py-12 lg:py-22">

      {/* ── Hero & Pop-out Avatar ──────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="animate-fade-up">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-12 sm:gap-8">
          
          {/* Kolom Teks */}
          <div className="flex-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden />
              <span className="text-xs text-muted">Available for new projects</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Edwinda Santosa
            </h1>

            <p className="mt-4 max-w-xl text-lg text-muted leading-relaxed">
             Dedicated to crafting unique, high-performance web applications. I focus on utility and experience—here is a prime example of my work. {" "}
              <a
                href="https://cyborged.web.id"
                className="text-primary underline decoration-border underline-offset-4 hover:decoration-primary transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                cyborged.web.id
              </a>
              .
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-surface hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                View my work
                <ArrowRight size={14} strokeWidth={2} aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary hover:text-primary hover:border-primary hover:bg-surface-raised transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Get in touch
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4" aria-label="Social profiles">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted hover:text-primary transition-colors duration-150"
                >
                  <Icon size={17} strokeWidth={1.75} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Kolom Foto (Pop-out Avatar) */}
    <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 mb-4 sm:mb-0 self-start sm:self-center mt-8 sm:mt-0">
  {/* 1. Lingkaran Background (Sama) */}
  <div className="absolute bottom-1 w-full h-full rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent border border-black/10 dark:border-white/10" />

  {/* --- Wadah untuk Gambar (Tanpa Shadow) --- */}
  <div
    className={[
      "absolute bottom-0 left-1/2 -translate-x-1/2 max-w-none object-contain",
      "hover:scale-105 transition-transform duration-500", // Hover effect tetap di sini
      // Responsive Scaling (Sama)
      "w-[115%] h-[120%]",
      "sm:w-[130%] sm:h-[145%]"
    ].join(" ")}
  >
    {/* 2. Foto Profil (Image element) */}
   <Image
      src="/image/profil_pic.png"
      alt="Profile Photo"
      width={400}
      height={400}
      priority
      className={[
        "absolute inset-0 w-full h-full object-contain",
        
        // Pilihan 1: Pakai bawaan Tailwind (Lebih praktis, bayangan cukup besar dan tebal)
        // "drop-shadow-2xl", 

        // Pilihan 2: Jika masih kurang pas, matikan baris di atas, 
        // dan nyalakan (uncomment) baris di bawah ini untuk custom yang lebih tebal:
        "drop-shadow-[4px_8px_8px_rgba(0,0,0,0.6)]", 
      ].join(" ")}
    />
  </div>
</div>

        </div>
      </section>

      <div className="divider my-16" />

        {/* ── About snippet ────────────────────────────────────────────────── */}
      <section className="animate-fade-up" style={{ animationDelay: "200ms" }}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          About
        </h2>
        <p className="max-w-xl text-base text-secondary leading-relaxed text-justify">
          I specialize in bridging the gap between modern web development and cybersecurity. I build high-performance web applications with a strong focus on Next.js, secure data management, and resilient system architecture. Guided by the analytical mindset of a cybersecurity professional, I ensure that every detail from user experience to backend security is executed to the highest standards. Security is not just a feature; it is the foundation of everything I create.
        </p>
        <Link
          href="/experience"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
        >
          View experience <ArrowRight size={12} strokeWidth={2} aria-hidden />
        </Link>
      </section>

            <div className="divider my-16" />



      {/* ── Latest Blog Section (Card Format) ──────────────────────────────── */}
      <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Latest Articles</h2>
            <p className="text-sm text-muted mt-1">Thoughts on security, dev, and design.</p>
          </div>
          <Link
            href="/blog"
            className="group hidden sm:flex items-center gap-1 text-sm font-medium text-secondary hover:text-primary"
          >
            View all
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted">Belum ada artikel yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5"
              >
                {/* Area Foto Blog */}
                <div className="relative aspect-[16/10] w-full border-b border-border bg-surface-overlay overflow-hidden">
                  {post.cover_url ? (
                    <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted">
                      <ImageIcon size={32} opacity={0.5} />
                    </div>
                  )}
                </div>

                {/* Area Teks Blog */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={12} />
                    <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                  </div>
                  <h3 className="mb-2 text-base font-semibold leading-snug text-primary group-hover:text-blue-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 mt-auto">
                    {post.description || "Baca selengkapnya mengenai artikel ini..."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <Link
          href="/blog"
          className="group mt-6 flex sm:hidden items-center justify-center gap-1 text-sm font-medium text-secondary hover:text-primary"
        >
          View all articles
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>
     
    </div>
  );
}