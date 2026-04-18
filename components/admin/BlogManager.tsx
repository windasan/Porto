/**
 * components/admin/BlogManager.tsx
 *
 * Full CRUD + publish/unpublish interface for blog posts.
 * Key difference from ExperienceManager: includes a large Markdown
 * content textarea and a publish toggle with live status badge.
 */

"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { Button }   from "@/components/ui/Button";
import { Badge }    from "@/components/ui/Badge";
import { formatDate, slugify } from "@/lib/utils";
import type { Post } from "@/lib/types";

/* ── Types ───────────────────────────────────────────────────────────────── */
type PostInput = Omit<Post, "id" | "created_at" | "updated_at">;

interface Props {
  posts:           Post[];
  onCreate:        (data: PostInput) => Promise<void>;
  onUpdate:        (id: string, data: Partial<Post>) => Promise<void>;
  onDelete:        (id: string) => Promise<void>;
  onTogglePublish: (id: string, current: boolean, slug: string) => Promise<void>;
}

const EMPTY: PostInput = {
  slug:         "",
  title:        "",
  excerpt:      "",
  content:      "",
  cover_url:    undefined,
  tags:         [],
  published:    false,
  published_at: null,
  reading_time: 1,
};

/* ── Component ───────────────────────────────────────────────────────────── */
export function BlogManager({ posts, onCreate, onUpdate, onDelete, onTogglePublish }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen]    = useState(false);
  const [editing, setEditing]        = useState<Post | null>(null);
  const [form, setForm]              = useState<PostInput>(EMPTY);
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

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      slug:         post.slug,
      title:        post.title,
      excerpt:      post.excerpt,
      content:      post.content,
      cover_url:    post.cover_url,
      tags:         post.tags,
      published:    post.published,
      published_at: post.published_at,
      reading_time: post.reading_time,
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
  const set = (key: keyof PostInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setTitle = (title: string) => {
    set("title", title);
    if (autoSlug) set("slug", slugify(title));
    // Estimate reading time (avg 200 wpm)
    const words = form.content.split(/\s+/).length;
    set("reading_time", Math.max(1, Math.ceil(words / 200)));
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
    tagRef.current?.focus();
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      setError("Title, slug, excerpt, and content are required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        editing ? await onUpdate(editing.id, form) : await onCreate(form);
        closePanel();
        router.refresh();
      } catch (e) {
        setError((e as Error).message);
      }
    });
  };

  // ── Toggle publish ────────────────────────────────────────────────────────
  const handleToggle = (post: Post) => {
    startTransition(async () => {
      try {
        await onTogglePublish(post.id, post.published, post.slug);
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    });
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    startTransition(async () => {
      await onDelete(id);
      setDeleteId(null);
      router.refresh();
    });
  };

  const fc = [
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm",
    "text-primary placeholder:text-muted outline-none",
    "focus:border-accent focus:ring-1 focus:ring-accent",
    "transition-colors duration-150 disabled:opacity-50",
  ].join(" ");

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Blog</h1>
          <p className="mt-1 text-sm text-muted">
            {posts.filter((p) => p.published).length} published · {posts.length} total
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={14} strokeWidth={2} aria-hidden />
          New post
        </Button>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted">No posts yet.</p>
          <Button onClick={openCreate} variant="secondary" size="sm" className="mt-4">
            Write your first post
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="rounded-2xl border border-border bg-surface-raised px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-primary">{post.title}</p>
                    <Badge variant={post.published ? "success" : "outline"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
                    <span>/{post.slug}</span>
                    {post.published_at && (
                      <time>{formatDate(post.published_at, { month: "short", day: "numeric", year: "numeric" })}</time>
                    )}
                    <span>{post.reading_time} min read</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {deleteId === post.id ? (
                    <>
                      <span className="text-xs text-muted">Delete?</span>
                      <Button variant="danger" size="sm" loading={isPending} onClick={() => handleDelete(post.id)}>Yes</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>No</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(post)}
                        loading={isPending}
                        aria-label={post.published ? "Unpublish" : "Publish"}
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published
                          ? <EyeOff size={13} strokeWidth={1.75} className="text-amber-400" />
                          : <Eye    size={13} strokeWidth={1.75} className="text-green-400" />
                        }
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(post)} aria-label="Edit">
                        <Pencil size={13} strokeWidth={1.75} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(post.id)} aria-label="Delete">
                        <Trash2 size={13} strokeWidth={1.75} className="text-red-400" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Slide-in panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={closePanel} aria-hidden />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-surface animate-fade-in" aria-label="Post form">

            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-primary">
                {editing ? "Edit post" : "New post"}
              </h2>
              <Button variant="ghost" size="icon" onClick={closePanel} aria-label="Close">
                <X size={15} strokeWidth={1.75} />
              </Button>
            </div>

            <div className="flex-1 space-y-5 p-6">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-secondary">Title *</label>
                <input className={fc} value={form.title} onChange={(e) => setTitle(e.target.value)} placeholder="My post title" />
              </div>

              {/* Slug */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-medium text-secondary">Slug *</label>
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
                  placeholder="my-post-title"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-secondary">Excerpt *</label>
                <textarea className={[fc, "resize-none"].join(" ")} rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short description shown in the post list" />
              </div>

              {/* Content (Markdown) */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-secondary">
                  Content * <span className="text-muted font-normal">(Markdown)</span>
                </label>
                <textarea
                  className={[fc, "resize-y font-mono text-xs leading-relaxed"].join(" ")}
                  rows={14}
                  value={form.content}
                  onChange={(e) => {
                    set("content", e.target.value);
                    set("reading_time", Math.max(1, Math.ceil(e.target.value.split(/\s+/).length / 200)));
                  }}
                  placeholder="# My Post&#10;&#10;Write your content in Markdown here…"
                />
                <p className="mt-1 text-right text-2xs text-muted">
                  ~{form.reading_time} min read
                </p>
              </div>

              {/* Cover URL */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-secondary">Cover image URL</label>
                <input type="url" className={fc} value={form.cover_url ?? ""} onChange={(e) => set("cover_url", e.target.value || undefined)} placeholder="https://..." />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-secondary">Tags</label>
                <div className="flex gap-2">
                  <input ref={tagRef} className={fc} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="next.js (press Enter)" />
                  <Button variant="secondary" size="md" onClick={addTag} type="button">Add</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.tags.map((t) => (
                      <button key={t} onClick={() => set("tags", form.tags.filter((x) => x !== t))} className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-raised px-2 py-0.5 text-2xs text-secondary hover:text-red-400 transition-colors">
                        {t} <X size={9} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
              )}
            </div>

            {/* Panel footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <Button variant="ghost" onClick={closePanel} disabled={isPending}>Cancel</Button>
              <Button loading={isPending} onClick={handleSubmit}>
                {editing ? "Save changes" : "Create draft"}
              </Button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
