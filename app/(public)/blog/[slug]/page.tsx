/**
 * app/(public)/blog/[slug]/page.tsx
 *
 * Server Component — fetches a single published post by slug and renders
 * the Markdown content. Uses `next-mdx-remote` for rendering.
 *
 * Install: npm install next-mdx-remote
 */
export const dynamic = "force-dynamic";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Post } from "@/lib/types";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// ── Static params for build-time pre-rendering ─────────────────────────────
export async function generateStaticParams() {
  // Gunakan client standar TANPA cookies, khusus untuk proses build
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true);

  return (data ?? []).map((post) => ({ slug: post.slug }));
}
// ── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Not found" };

  return {
    title:       post.title,
    description: post.excerpt,
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      type:        "article",
      publishedTime: post.published_at ?? undefined,
      tags:        post.tags,
    },
  };
}

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getPost(slug: string): Promise<Post | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return data as Post;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="prose-layout py-16 md:py-24">

      {/* ── Back link ──────────────────────────────────────────────────── */}
      <Link
        href="/blog"
        className={[
          "mb-10 inline-flex items-center gap-1.5",
          "text-xs text-muted hover:text-primary transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",
        ].join(" ")}
      >
        <ArrowLeft size={12} strokeWidth={2} aria-hidden />
        Back to blog
      </Link>

      {/* ── Article header ─────────────────────────────────────────────── */}
      <header className="mb-10 animate-fade-up">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-3 text-lg text-muted leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted">
          {post.published_at && (
            <div className="flex items-center gap-1.5">
              <Calendar size={12} strokeWidth={1.75} aria-hidden />
              <time dateTime={post.published_at}>
                {formatDate(post.published_at, { month: "long", day: "numeric", year: "numeric" })}
              </time>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={12} strokeWidth={1.75} aria-hidden />
            <span>{post.reading_time} min read</span>
          </div>
        </div>
      </header>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="divider" />

      {/* ── MDX content ────────────────────────────────────────────────── */}
      {/*
       * The `prose` classes require @tailwindcss/typography plugin.
       * Install: npm install -D @tailwindcss/typography
       * Add to tailwind.config.ts plugins: [require('@tailwindcss/typography')]
       */}
      <article
        className={[
          "mt-10 animate-fade-up",
          // Tailwind Typography prose styles — override colors to match theme
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-a:text-primary prose-a:underline-offset-4",
          "prose-code:font-mono prose-code:text-sm",
          "prose-pre:bg-surface-raised prose-pre:border prose-pre:border-border",
        ].join(" ")}
      >
        <MDXRemote source={post.content} />
      </article>

      {/* ── Footer nav ─────────────────────────────────────────────────── */}
      <div className="divider" />
      <div className="flex justify-between text-sm">
        <Link
          href="/blog"
          className="text-muted hover:text-primary transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} strokeWidth={1.75} aria-hidden />
          All posts
        </Link>
      </div>

    </div>
  );
}
