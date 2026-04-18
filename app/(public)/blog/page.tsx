/**
 * app/(public)/blog/page.tsx
 *
 * Halaman daftar blog dengan pengelompokan berdasarkan tahun.
 */

// 1. TAMBAHKAN INI: Agar tidak error 'cookies' saat build
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Edi",
  description: "Writing on engineering, security, and building things.",
};

// Definisi tipe agar tidak 'never'
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  published_at: string;
  reading_time: number;
}

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getPosts(): Promise<Post[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, tags, published_at, reading_time")
    .eq("published", true)
    // Menggunakan created_at jika published_at kosong di database
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[Blog] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as Post[];
}

// Helper format tanggal lokal jika utils/formatDate bermasalah
function localFormatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPage() {
  const posts = await getPosts();

  // Kelompokkan post berdasarkan tahun
  const byYear = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = post.published_at
      ? new Date(post.published_at).getFullYear().toString()
      : "No Date";
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="prose-layout py-16 md:py-24">
      <header className="mb-14 animate-fade-up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          Writing
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-base text-muted max-w-md leading-relaxed">
          Kumpulan tulisan seputar engineering, cybersecurity, dan hal-hal menarik lainnya yang saya pelajari.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center animate-fade-up">
          <p className="text-muted text-sm">Belum ada artikel yang dipublikasikan.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {years.map((year) => (
            <section key={year} className="animate-fade-up">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-muted/50">
                {year}
              </h2>

              <div className="space-y-1 divide-y divide-border/50">
                {byYear[year].map((post) => (
                  <PostRow key={post.id} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PostRow({ post }: { post: Post }) {
  return (
    <div className="group relative py-6 transition-all">
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-lg font-medium text-primary group-hover:text-blue-500 transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-1 text-sm text-muted line-clamp-2 max-w-xl">
              {post.excerpt}
            </p>
          )}
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-surface-raised border border-border px-2 py-0.5 text-[10px] text-secondary">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 mt-2 sm:mt-0">
          <time className="text-xs text-muted tabular-nums">
            {localFormatDate(post.published_at || new Date().toISOString())}
          </time>
          <div className="flex items-center gap-1 text-[10px] font-medium text-muted/60 uppercase tracking-tight">
            <Clock size={10} />
            <span>{post.reading_time || 5} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}