/**
 * app/admin/dashboard/page.tsx
 *
 * Admin overview — summary stats + quick links to each section.
 * Server Component: data fetched with the Supabase server client.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Briefcase, FolderKanban, FileText, ArrowRight, Eye } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────
async function getStats() {
  const supabase = createClient();

  const [
    { count: experienceCount },
    { count: projectCount    },
    { count: postCount       },
    { count: publishedCount  },
  ] = await Promise.all([
    supabase.from("experiences").select("*", { count: "exact", head: true }),
    supabase.from("projects")  .select("*", { count: "exact", head: true }),
    supabase.from("posts")     .select("*", { count: "exact", head: true }),
    supabase.from("posts")     .select("*", { count: "exact", head: true }).eq("published", true),
  ]);

  return {
    experiences: experienceCount ?? 0,
    projects:    projectCount    ?? 0,
    posts:       postCount       ?? 0,
    published:   publishedCount  ?? 0,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const stats = await getStats();

  const SECTIONS = [
    {
      href:        "/admin/dashboard/experience",
      publicHref:  "/experience",
      label:       "Experience",
      description: "Manage work history and roles.",
      icon:        Briefcase,
      count:       stats.experiences,
      unit:        "entries",
    },
    {
      href:        "/admin/dashboard/work",
      publicHref:  "/work",
      label:       "Work",
      description: "Add and edit portfolio projects.",
      icon:        FolderKanban,
      count:       stats.projects,
      unit:        "projects",
    },
    {
      href:        "/admin/dashboard/blog",
      publicHref:  "/blog",
      label:       "Blog",
      description: `${stats.published} of ${stats.posts} posts published.`,
      icon:        FileText,
      count:       stats.posts,
      unit:        "posts",
    },
  ] as const;

  return (
    <div className="max-w-2xl">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your portfolio content at a glance.
        </p>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Experiences" value={stats.experiences} icon={Briefcase} />
        <StatCard label="Projects"    value={stats.projects}    icon={FolderKanban} />
        <StatCard label="Posts"       value={`${stats.published}/${stats.posts}`} icon={FileText} />
      </div>

      {/* ── Section cards ──────────────────────────────────────────────── */}
      <div className="mt-8 space-y-3">
        {SECTIONS.map(({ href, publicHref, label, description, icon: Icon, count, unit }) => (
          <div
            key={href}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface-raised px-5 py-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-muted">
                <Icon size={15} strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">{label}</p>
                <p className="text-xs text-muted">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Public view link */}
              <Link
                href={publicHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted hover:text-primary hover:border-primary transition-all"
                aria-label={`View public ${label} page`}
                title="View public page"
              >
                <Eye size={13} strokeWidth={1.75} aria-hidden />
              </Link>
              {/* Edit link */}
              <Link
                href={href}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-primary transition-all"
              >
                Manage
                <ArrowRight size={11} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon:  React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{label}</p>
        <Icon size={13} strokeWidth={1.75} className="text-muted" aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-primary">
        {value}
      </p>
    </div>
  );
}