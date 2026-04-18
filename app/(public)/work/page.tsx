/**
 * app/(public)/work/page.tsx
 *
 * Server Component — fetches projects from Supabase and renders a
 * responsive grid with featured projects highlighted.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/lib/types";
import { ArrowUpRight, Github } from "lucide-react";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects and case studies from my portfolio.",
};

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("year",       { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Work] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as Project[];
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function WorkPage() {
  const projects  = await getProjects();
  const featured  = projects.filter((p) => p.featured);
  const rest      = projects.filter((p) => !p.featured);

  return (
    <div className="prose-layout py-16 md:py-24">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-14 animate-fade-up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          Portfolio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Work
        </h1>
        <p className="mt-3 text-base text-muted max-w-md">
          A selection of projects I've built — side projects, open-source tools,
          and client work.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-muted text-sm">No projects added yet.</p>
      ) : (
        <div className="space-y-16">

          {/* ── Featured projects ────────────────────────────────────── */}
          {featured.length > 0 && (
            <section aria-labelledby="featured-heading">
              <SectionLabel id="featured-heading">Featured</SectionLabel>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {featured.map((project, i) => (
                  <ProjectCard key={project.id} project={project} large={i === 0 && featured.length > 1} />
                ))}
              </div>
            </section>
          )}

          {/* ── All other projects ───────────────────────────────────── */}
          {rest.length > 0 && (
            <section aria-labelledby="other-heading">
              <SectionLabel id="other-heading">Other projects</SectionLabel>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-xs font-semibold uppercase tracking-widest text-muted"
    >
      {children}
    </h2>
  );
}

interface ProjectCardProps {
  project: Project;
  /** First featured card gets extra visual weight */
  large?:  boolean;
}

function ProjectCard({ project, large = false }: ProjectCardProps) {
  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden",
        "rounded-2xl border border-border bg-surface-raised",
        "transition-all duration-200",
        "hover:border-charcoal-600 hover:shadow-xl hover:shadow-black/10",
        "hover:-translate-y-0.5",
        large ? "sm:col-span-2" : "",
      ].join(" ")}
    >
      {/* ── Cover image ─────────────────────────────────────────────── */}
      {project.image_url && (
        <div
          className={[
            "relative w-full overflow-hidden bg-surface-overlay",
            large ? "h-56 sm:h-64" : "h-44",
          ].join(" ")}
        >
          <Image
            src={project.image_url}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      )}

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Year + title */}
        <div>
          <span className="text-2xs text-muted tabular-nums">{project.year}</span>
          <h3 className="mt-0.5 text-base font-semibold text-primary">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p className="flex-1 text-sm text-secondary leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pt-1">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "inline-flex items-center gap-1.5 text-xs font-medium text-secondary",
                "hover:text-primary transition-colors",
              ].join(" ")}
              aria-label={`Visit ${project.title}`}
            >
              Live site
              <ArrowUpRight size={12} strokeWidth={2} aria-hidden />
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "inline-flex items-center gap-1.5 text-xs font-medium text-muted",
                "hover:text-primary transition-colors",
              ].join(" ")}
              aria-label={`View ${project.title} source code`}
            >
              <Github size={12} strokeWidth={1.75} aria-hidden />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
