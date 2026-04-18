/**
 * components/admin/WorkManager.tsx
 *
 * Full CRUD client component for portfolio projects.
 * Features: create / edit / delete + featured toggle + image URL preview.
 *
 * Wire up in app/admin/dashboard/work/page.tsx exactly as ExperienceManager:
 *
 *   import { WorkManager } from "@/components/admin/WorkManager";
 *   ...
 *   <WorkManager
 *     projects={projects}
 *     onCreate={createProject}
 *     onUpdate={updateProject}
 *     onDelete={deleteProject}
 *   />
 */

"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, X, Star, StarOff, ExternalLink, Github,
} from "lucide-react";
import { Button }    from "@/components/ui/Button";
import { Badge }     from "@/components/ui/Badge";
import { slugify }   from "@/lib/utils";
import type { Project } from "@/lib/types";

/* ── Types ───────────────────────────────────────────────────────────────── */
type ProjectInput = Omit<Project, "id" | "created_at" | "updated_at">;

interface Props {
  projects: Project[];
  onCreate: (data: ProjectInput) => Promise<void>;
  onUpdate: (id: string, data: Partial<Project>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const currentYear = new Date().getFullYear().toString();

const EMPTY: ProjectInput = {
  slug:        "",
  title:       "",
  description: "",
  url:         undefined,
  repo_url:    undefined,
  image_url:   undefined,
  tags:        [],
  featured:    false,
  year:        currentYear,
};

/* ── Component ───────────────────────────────────────────────────────────── */
export function WorkManager({ projects, onCreate, onUpdate, onDelete }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen]    = useState(false);
  const [editing, setEditing]        = useState<Project | null>(null);
  const [form, setForm]              = useState<ProjectInput>(EMPTY);
  const [deleteId, setDeleteId]      = useState<string | null>(null);
  const [error, setError]            = useState<string | null>(null);
  const [tagInput, setTagInput]      = useState("");
  const [autoSlug, setAutoSlug]      = useState(true);
  const tagRef = useRef<HTMLInputElement>(null);

  // ── Panel helpers ────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setAutoSlug(true);
    setError(null);
    setPanelOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      slug:        project.slug,
      title:       project.title,
      description: project.description,
      url:         project.url,
      repo_url:    project.repo_url,
      image_url:   project.image_url,
      tags:        project.tags,
      featured:    project.featured,
      year:        project.year,
    });
    setAutoSlug(false);
    setError(null);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditing(null);
    setTagInput("");
  };

  // ── Field helpers ────────────────────────────────────────────────────────
  const set = (key: keyof ProjectInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setTitle = (title: string) => {
    set("title", title);
    if (autoSlug) set("slug", slugify(title));
  };

  // ── Tag helpers ─────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
    tagRef.current?.focus();
  };

  // ── Featured toggle (quick action from table) ────────────────────────────
  const toggleFeatured = (project: Project) => {
    startTransition(async () => {
      await onUpdate(project.id, { featured: !project.featured });
      router.refresh();
    });
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.title || !form.slug || !form.description || !form.year) {
      setError("Title, slug, description, and year are required.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        editing
          ? await onUpdate(editing.id, form)
          : await onCreate(form);
        closePanel();
        router.refresh();
      } catch (e) {
        setError((e as Error).message ?? "Something went wrong.");
      }
    });
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await onDelete(id);
        setDeleteId(null);
        router.refresh();
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  // ── Field class ──────────────────────────────────────────────────────────
  const fc = [
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm",
    "text-primary placeholder:text-muted outline-none",
    "focus:border-accent focus:ring-1 focus:ring-accent",
    "transition-colors duration-150 disabled:opacity-50",
  ].join(" ");

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Work</h1>
          <p className="mt-1 text-sm text-muted">
            {projects.filter((p) => p.featured).length} featured · {projects.length} total
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={14} strokeWidth={2} aria-hidden />
          New project
        </Button>
      </div>

      {/* ── Project list ────────────────────────────────────────────── */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted">No projects yet.</p>
          <Button onClick={openCreate} variant="secondary" size="sm" className="mt-4">
            Add your first project
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface-raised"
            >
              <div className="flex items-stretch">

                {/* ── Cover thumbnail (if image) ───────────────────── */}
                {project.image_url && (
                  <div className="relative hidden sm:block w-24 shrink-0 bg-surface-overlay">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}

                {/* ── Content ─────────────────────────────────────── */}
                <div className="flex flex-1 items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-primary">{project.title}</p>
                      <span className="text-2xs text-muted tabular-nums">{project.year}</span>
                      {project.featured && (
                        <Badge variant="warning">Featured</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted line-clamp-1 max-w-sm">
                      {project.description}
                    </p>
                    {project.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.tags.slice(0, 4).map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-2xs text-muted self-center">
                            +{project.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Actions ─────────────────────────────────────── */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    {deleteId === project.id ? (
                      <>
                        <span className="text-xs text-muted mr-1">Delete?</span>
                        <Button
                          variant="danger" size="sm"
                          loading={isPending}
                          onClick={() => handleDelete(project.id)}
                        >Yes</Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>No</Button>
                      </>
                    ) : (
                      <>
                        {/* External link */}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted hover:text-primary hover:border-border transition-all"
                            aria-label="Open live site"
                          >
                            <ExternalLink size={12} strokeWidth={1.75} />
                          </a>
                        )}
                        {/* Repo link */}
                        {project.repo_url && (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted hover:text-primary hover:border-border transition-all"
                            aria-label="Open repository"
                          >
                            <Github size={12} strokeWidth={1.75} />
                          </a>
                        )}
                        {/* Toggle featured */}
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => toggleFeatured(project)}
                          loading={isPending}
                          aria-label={project.featured ? "Remove from featured" : "Mark as featured"}
                          title={project.featured ? "Remove featured" : "Mark as featured"}
                        >
                          {project.featured
                            ? <Star    size={13} strokeWidth={1.75} className="text-amber-400 fill-amber-400" />
                            : <StarOff size={13} strokeWidth={1.75} />
                          }
                        </Button>
                        {/* Edit */}
                        <Button variant="ghost" size="icon" onClick={() => openEdit(project)} aria-label="Edit project">
                          <Pencil size={13} strokeWidth={1.75} />
                        </Button>
                        {/* Delete */}
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(project.id)} aria-label="Delete project">
                          <Trash2 size={13} strokeWidth={1.75} className="text-red-400" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── Slide-in form panel ───────────────────────────────────────── */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={closePanel} aria-hidden />

          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-border bg-surface animate-fade-in"
            aria-label="Project form"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-primary">
                {editing ? "Edit project" : "New project"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closePanel} aria-label="Close">
                <X size={15} strokeWidth={1.75} />
              </Button>
            </div>

            {/* Fields */}
            <div className="flex-1 space-y-5 p-6">

              {/* Title */}
              <Field label="Title *">
                <input className={fc} value={form.title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Project" />
              </Field>

              {/* Slug */}
              <Field label="Slug *">
                <div className="mb-1 flex items-center justify-between">
                  <span />
                  <button
                    type="button"
                    onClick={() => { setAutoSlug(!autoSlug); if (!autoSlug) set("slug", slugify(form.title)); }}
                    className="text-2xs text-muted hover:text-primary transition-colors"
                  >
                    {autoSlug ? "Auto-generating" : "Manual — click to auto"}
                  </button>
                </div>
                <input
                  className={fc}
                  value={form.slug}
                  onChange={(e) => { setAutoSlug(false); set("slug", e.target.value); }}
                  placeholder="my-awesome-project"
                />
              </Field>

              {/* Description */}
              <Field label="Description *">
                <textarea
                  className={[fc, "resize-none"].join(" ")}
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="A short description of what this project does."
                />
              </Field>

              {/* Year */}
              <Field label="Year *">
                <input
                  className={fc}
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  placeholder={currentYear}
                  maxLength={4}
                />
              </Field>

              {/* URLs */}
              <Field label="Live URL">
                <input type="url" className={fc} value={form.url ?? ""} onChange={(e) => set("url", e.target.value || undefined)} placeholder="https://myproject.com" />
              </Field>

              <Field label="Repository URL">
                <input type="url" className={fc} value={form.repo_url ?? ""} onChange={(e) => set("repo_url", e.target.value || undefined)} placeholder="https://github.com/you/repo" />
              </Field>

              {/* Cover image URL + preview */}
              <Field label="Cover image URL">
                <input
                  type="url"
                  className={fc}
                  value={form.image_url ?? ""}
                  onChange={(e) => set("image_url", e.target.value || undefined)}
                  placeholder="https://..."
                />
                {form.image_url && (
                  <div className="relative mt-2 h-28 w-full overflow-hidden rounded-lg border border-border bg-surface-overlay">
                    <Image
                      src={form.image_url}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                      onError={() => set("image_url", undefined)}
                    />
                  </div>
                )}
              </Field>

              {/* Featured */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-secondary">Mark as featured project</span>
              </label>

              {/* Tags */}
              <Field label="Tags">
                <div className="flex gap-2">
                  <input
                    ref={tagRef}
                    className={fc}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="react (press Enter)"
                  />
                  <Button variant="secondary" size="md" onClick={addTag} type="button">Add</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => set("tags", form.tags.filter((x) => x !== t))}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised px-2 py-0.5 text-2xs text-secondary hover:text-red-400 hover:border-red-400/30 transition-colors"
                      >
                        {t} <X size={9} />
                      </button>
                    ))}
                  </div>
                )}
              </Field>

              {/* Error */}
              {error && (
                <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Panel footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button variant="ghost" onClick={closePanel} disabled={isPending}>Cancel</Button>
              <Button loading={isPending} onClick={handleSubmit}>
                {editing ? "Save changes" : "Create project"}
              </Button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

/* ── Field wrapper ───────────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-secondary">{label}</label>
      {children}
    </div>
  );
}
