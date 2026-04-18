/**
 * components/admin/ExperienceManager.tsx
 *
 * Client Component — renders the full CRUD interface for experiences.
 * Receives Server Actions as props (they're just async functions).
 *
 * UX:
 *  - Table rows show company, role, date range, and action buttons
 *  - "New experience" or clicking Edit opens an inline slide-in panel
 *  - Delete shows an inline confirmation to prevent accidental deletion
 */

"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, MapPin, ExternalLink } from "lucide-react";
import { Button }   from "@/components/ui/Button";
import { Badge }    from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Experience } from "@/lib/types";

/* ── Types ───────────────────────────────────────────────────────────────── */
type ExperienceInput = Omit<Experience, "id" | "created_at" | "updated_at">;

interface Props {
  experiences: Experience[];
  onCreate: (data: ExperienceInput) => Promise<void>;
  onUpdate: (id: string, data: Partial<Experience>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

// ── Empty form state ──────────────────────────────────────────────────────────
const EMPTY: ExperienceInput = {
  company:     "",
  role:        "",
  description: "",
  start_date:  "",
  end_date:    null,
  is_current:  false,
  location:    "",
  company_url: "",
  tags:        [],
};

/* ── Component ───────────────────────────────────────────────────────────── */
export function ExperienceManager({ experiences, onCreate, onUpdate, onDelete }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen]    = useState(false);
  const [editing, setEditing]        = useState<Experience | null>(null);
  const [form, setForm]              = useState<ExperienceInput>(EMPTY);
  const [deleteId, setDeleteId]      = useState<string | null>(null);
  const [error, setError]            = useState<string | null>(null);
  const [tagInput, setTagInput]      = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  // ── Open panel ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setPanelOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditing(exp);
    setForm({
      company:     exp.company,
      role:        exp.role,
      description: exp.description,
      start_date:  exp.start_date,
      end_date:    exp.end_date,
      is_current:  exp.is_current,
      location:    exp.location ?? "",
      company_url: exp.company_url ?? "",
      tags:        exp.tags,
    });
    setError(null);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditing(null);
    setTagInput("");
  };

  // ── Field helper ────────────────────────────────────────────────────────
  const set = (key: keyof ExperienceInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ── Tag helpers ─────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  };
  const removeTag = (tag: string) =>
    set("tags", form.tags.filter((t) => t !== tag));

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.company || !form.role || !form.start_date || !form.description) {
      setError("Company, role, start date, and description are required.");
      return;
    }
    setError(null);

    const payload: ExperienceInput = {
      ...form,
      end_date:    form.is_current ? null : form.end_date || null,
      location:    form.location    || undefined as unknown as string,
      company_url: form.company_url || undefined as unknown as string,
    };

    startTransition(async () => {
      try {
        if (editing) {
          await onUpdate(editing.id, payload);
        } else {
          await onCreate(payload);
        }
        closePanel();
        router.refresh();
      } catch (e) {
        setError((e as Error).message ?? "Something went wrong.");
      }
    });
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await onDelete(id);
        setDeleteId(null);
        router.refresh();
      } catch (e) {
        setError((e as Error).message ?? "Delete failed.");
      }
    });
  };

  // ── Field class ─────────────────────────────────────────────────────────
  const fc = [
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm",
    "text-primary placeholder:text-muted",
    "outline-none focus:border-accent focus:ring-1 focus:ring-accent",
    "transition-colors duration-150 disabled:opacity-50",
  ].join(" ");

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Experience</h1>
          <p className="mt-1 text-sm text-muted">{experiences.length} entries</p>
        </div>
        <Button onClick={openCreate} size="md">
          <Plus size={14} strokeWidth={2} aria-hidden />
          New entry
        </Button>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      {experiences.length === 0 ? (
        <div className="rounded-2xl border border-border border-dashed p-12 text-center">
          <p className="text-sm text-muted">No experiences yet.</p>
          <Button onClick={openCreate} variant="secondary" size="sm" className="mt-4">
            Add your first entry
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="rounded-2xl border border-border bg-surface-raised px-5 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="font-medium text-primary">{exp.role}</p>
                    <span className="text-sm text-muted">·</span>
                    <p className="text-sm text-secondary">{exp.company}</p>
                    {exp.is_current && (
                      <Badge variant="success" className="ml-1">Current</Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <time>
                      {formatDate(exp.start_date)} —{" "}
                      {exp.is_current ? "Present" : exp.end_date ? formatDate(exp.end_date) : "—"}
                    </time>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} aria-hidden /> {exp.location}
                      </span>
                    )}
                    {exp.company_url && (
                      <a
                        href={exp.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <ExternalLink size={10} aria-hidden /> Website
                      </a>
                    )}
                  </div>
                  {exp.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {exp.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {deleteId === exp.id ? (
                    <>
                      <span className="text-xs text-muted mr-1">Delete?</span>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={isPending}
                        onClick={() => handleDelete(exp.id)}
                      >
                        Yes
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
                        No
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(exp)} aria-label="Edit">
                        <Pencil size={13} strokeWidth={1.75} aria-hidden />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(exp.id)} aria-label="Delete">
                        <Trash2 size={13} strokeWidth={1.75} className="text-red-400" aria-hidden />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── Slide-in form panel ───────────────────────────────────────── */}
      {panelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closePanel}
            aria-hidden
          />

          {/* Panel */}
          <aside
            className={[
              "fixed inset-y-0 right-0 z-50 w-full max-w-md",
              "flex flex-col bg-surface border-l border-border",
              "overflow-y-auto",
              "animate-fade-in",
            ].join(" ")}
            aria-label="Experience form"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-primary">
                {editing ? "Edit experience" : "New experience"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closePanel} aria-label="Close panel">
                <X size={15} strokeWidth={1.75} aria-hidden />
              </Button>
            </div>

            {/* Form fields */}
            <div className="flex-1 space-y-5 p-6">

              <Field label="Company *">
                <input className={fc} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Corp" />
              </Field>

              <Field label="Role *">
                <input className={fc} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Senior Engineer" />
              </Field>

              <Field label="Description *">
                <textarea className={[fc, "resize-none"].join(" ")} rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What did you do here?" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Start date *">
                  <input type="date" className={fc} value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
                </Field>
                <Field label="End date">
                  <input type="date" className={fc} value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value || null)} disabled={form.is_current} />
                </Field>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_current}
                  onChange={(e) => set("is_current", e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-secondary">Currently working here</span>
              </label>

              <Field label="Location">
                <input className={fc} value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA (optional)" />
              </Field>

              <Field label="Company URL">
                <input type="url" className={fc} value={form.company_url ?? ""} onChange={(e) => set("company_url", e.target.value)} placeholder="https://company.com (optional)" />
              </Field>

              {/* Tags */}
              <Field label="Tags">
                <div className="flex gap-2">
                  <input
                    ref={tagInputRef}
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
                        onClick={() => removeTag(t)}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised px-2 py-0.5 text-2xs text-secondary hover:text-red-400 hover:border-red-400/30 transition-colors"
                      >
                        {t}
                        <X size={9} strokeWidth={2} aria-hidden />
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
                {editing ? "Save changes" : "Create"}
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
