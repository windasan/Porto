/**
 * app/(public)/experience/page.tsx
 *
 * Server Component — fetches experience data from Supabase and renders
 * a clean vertical timeline.
 */

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Experience } from "@/lib/types";
import { MapPin, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Experience",
  description: "My professional background and work history.",
};

// ── Data fetching ────────────────────────────────────────────────────────────
async function getExperiences(): Promise<Experience[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("[Experience] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as Experience[];
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="prose-layout py-16 md:py-24">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-14 animate-fade-up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          Career
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Experience
        </h1>
        <p className="mt-3 text-base text-muted max-w-md">
          A chronological look at the companies and roles that shaped how I
          think about building software.
        </p>
      </header>

      {/* ── Timeline ───────────────────────────────────────────────────── */}
      {experiences.length === 0 ? (
        <p className="text-muted text-sm">No experiences added yet.</p>
      ) : (
        <ol className="relative space-y-0" aria-label="Work experience timeline">
          {experiences.map((exp, index) => (
            <TimelineItem key={exp.id} exp={exp} isLast={index === experiences.length - 1} />
          ))}
        </ol>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface TimelineItemProps {
  exp:    Experience;
  isLast: boolean;
}

function TimelineItem({ exp, isLast }: TimelineItemProps) {
  const startLabel = formatDate(exp.start_date);
  const endLabel   = exp.is_current ? "Present" : exp.end_date ? formatDate(exp.end_date) : "";

  return (
    <li className="relative flex gap-6 pb-12 animate-fade-up">

      {/* ── Vertical line + dot ─────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center" aria-hidden>
        {/* Dot */}
        <div
          className={[
            "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2",
            exp.is_current
              ? "border-primary bg-primary"
              : "border-border bg-surface",
          ].join(" ")}
        />
        {/* Connecting line */}
        {!isLast && (
          <div className="mt-1 w-px flex-1 bg-border" />
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 pb-2">
        {/* Date range */}
        <time className="text-xs text-muted tabular-nums">
          {startLabel} — {endLabel}
        </time>

        {/* Role + Company */}
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <h2 className="text-base font-semibold text-primary">
            {exp.role}
          </h2>
          <span className="text-sm text-muted">·</span>
          {exp.company_url ? (
            <a
              href={exp.company_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-secondary hover:text-primary transition-colors"
            >
              {exp.company}
              <ExternalLink size={11} strokeWidth={1.75} aria-hidden />
            </a>
          ) : (
            <span className="text-sm text-secondary">{exp.company}</span>
          )}
        </div>

        {/* Location */}
        {exp.location && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted">
            <MapPin size={11} strokeWidth={1.75} aria-hidden />
            {exp.location}
          </div>
        )}

        {/* Description */}
        <p className="mt-3 text-sm text-secondary leading-relaxed max-w-lg">
          {exp.description}
        </p>

        {/* Tags */}
        {exp.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {exp.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
