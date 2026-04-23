/**
 * components/admin/CertificateManager.tsx
 *
 * Full CRUD client component for portfolio certificates.
 * Features: create / edit / delete + Image File Upload with preview.
 */

"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { Certificate } from "@/lib/types";

/* ── Types ───────────────────────────────────────────────────────────────── */
type CertificateInput = Omit<Certificate, "id" | "created_at" | "updated_at">;

interface Props {
  certificates: Certificate[];
  onCreate: (data: CertificateInput) => Promise<void>;
  onUpdate: (id: string, data: Partial<Certificate>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUploadImage: (formData: FormData) => Promise<string>;
}

const DEFAULT_FORM: CertificateInput = {
  title: "",
  issuer: "",
  issued_at: new Date().toISOString().split("T")[0],
  description: "", // Tambahkan ini
  credential_url: "",
  image_url: "",
};
/* ── Main Component ──────────────────────────────────────────────────────── */
export function CertificateManager({ certificates, onCreate, onUpdate, onDelete, onUploadImage }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificateInput>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);

  // State khusus untuk upload gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Actions ─────────────────────────────────────────────────────────────
  function openPanel(cert?: Certificate) {
    if (cert) {
      setEditingId(cert.id);
      setFormData({
        title: cert.title,
        issuer: cert.issuer,
        issued_at: cert.issued_at,
        description: cert.description || "", // Tambahkan ini
        credential_url: cert.credential_url || "",
        image_url: cert.image_url || "",
      });
      setPreviewUrl(cert.image_url || null);
    } else {
      setEditingId(null);
      setFormData(DEFAULT_FORM);
      setPreviewUrl(null);
    }
    setImageFile(null);
    setError(null);
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData(DEFAULT_FORM);
      setImageFile(null);
      setPreviewUrl(null);
      setError(null);
    }, 200); // Wait for transition
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    startTransition(async () => {
      try {
        await onDelete(id);
      } catch (err: any) {
        alert(err.message);
      }
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function handleSubmit() {
    setError(null);
    if (!formData.title || !formData.issuer || !formData.issued_at) {
      setError("Title, Issuer, and Issue Date are required.");
      return;
    }

    startTransition(async () => {
      try {
        let finalImageUrl = formData.image_url;

        // Jika ada file baru yang dipilih, upload ke Supabase Storage dulu
        if (imageFile) {
          const fileData = new FormData();
          fileData.append("file", imageFile);
          finalImageUrl = await onUploadImage(fileData);
        }

        const dataToSave = { ...formData, image_url: finalImageUrl };

        if (editingId) {
          await onUpdate(editingId, dataToSave);
        } else {
          await onCreate(dataToSave);
        }
        closePanel();
      } catch (err: any) {
        setError(err.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manage Certificates</h1>
          <p className="text-sm text-muted">Add, edit, or remove your professional certifications.</p>
        </div>
        <Button onClick={() => openPanel()}>
          <Plus size={16} className="mr-2" /> Add Certificate
        </Button>
      </div>

      {/* ── Table/List ───────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
        {certificates.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">No certificates found. Add one above.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-overlay border-b border-border text-muted uppercase text-[10px] tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Certificate</th>
                <th className="px-6 py-4">Issuer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-surface-overlay/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">
                    <div className="flex items-center gap-3">
                      {cert.image_url && cert.image_url.startsWith('http') ? (
                        <div className="relative h-8 w-8 rounded overflow-hidden bg-surface-overlay shrink-0">
                          <Image src={cert.image_url} alt="Thumbnail" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-overlay text-muted shrink-0">
                          <Award size={14} />
                        </div>
                      )}
                      <span className="line-clamp-1">{cert.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted whitespace-nowrap">{cert.issuer}</td>
                  <td className="px-6 py-4 text-muted whitespace-nowrap">{formatDate(cert.issued_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openPanel(cert)}
                        disabled={isPending}
                        className="p-2 text-muted hover:text-primary transition-colors disabled:opacity-50"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        disabled={isPending}
                        className="p-2 text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Slide-over Panel ─────────────────────────────────────────────── */}
      {isPanelOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" onClick={closePanel} />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface-raised shadow-2xl border-l border-border animate-slide-in-right overflow-y-auto">
            
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-primary">
                {editingId ? "Edit Certificate" : "New Certificate"}
              </h2>
              <button onClick={closePanel} className="text-muted hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 space-y-5 p-6">
              
              <Field label="Certificate Title *">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Google Cybersecurity Professional"
                  className="w-full rounded-md border border-border bg-surface-overlay px-3 py-2 text-sm text-primary outline-none focus:border-blue-500"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Issuer *">
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Coursera"
                    className="w-full rounded-md border border-border bg-surface-overlay px-3 py-2 text-sm text-primary outline-none focus:border-blue-500"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Jelaskan singkat tentang sertifikasi ini..."
                    rows={4}
                    className="w-full rounded-md border border-border bg-surface-overlay px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 resize-none"
                  />
                </Field>

                <Field label="Issue Date *">
                  <input
                    type="date"
                    value={formData.issued_at}
                    onChange={(e) => setFormData({ ...formData, issued_at: e.target.value })}
                    className="w-full rounded-md border border-border bg-surface-overlay px-3 py-2 text-sm text-primary outline-none focus:border-blue-500"
                  />
                </Field>
              </div>

              <Field label="Credential URL (Verification Link)">
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://www.coursera.org"
                  className="w-full rounded-md border border-border bg-surface-overlay px-3 py-2 text-sm text-primary outline-none focus:border-blue-500"
                />
              </Field>

              <Field label="Certificate Image">
                {/* Input File */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-primary/90 outline-none mb-3"
                />
                
                {/* Image Preview */}
                {previewUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-surface-overlay">
                     <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-border bg-surface-overlay/50 text-xs text-muted">
                    No image selected
                  </div>
                )}
              </Field>

              {/* Error Message */}
              {error && (
                <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Panel Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 mt-auto">
              <Button variant="ghost" onClick={closePanel} disabled={isPending}>Cancel</Button>
              <Button loading={isPending} onClick={handleSubmit}>
                {editingId ? "Save changes" : "Add certificate"}
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
      <label className="mb-1.5 block text-xs font-semibold text-muted uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}