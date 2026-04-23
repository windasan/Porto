import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Certificate } from "@/lib/types";
import { CertificateGallery } from "@/components/CertificateGallery"; // <-- Import komponen baru

export const metadata: Metadata = {
  title: "Certificates",
  description: "Professional licenses and certifications.",
};

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getCertificates(): Promise<Certificate[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("issued_at", { ascending: false });

  if (error) {
    console.error("[Certificates] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as Certificate[];
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="prose-layout py-16 md:py-20">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="mb-14 animate-fade-up">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
          Portfolio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Certificates
        </h1>
        <p className="mt-3 text-base text-muted max-w-md">
          A collection of my professional licenses, certifications, and achievements in web development and cybersecurity.
        </p>
      </header>

      {/* ── Konten Interaktif ─────────────────────────────────────────── */}
      {certificates.length === 0 ? (
        <p className="text-muted text-sm">No certificates added yet.</p>
      ) : (
        <CertificateGallery certificates={certificates} />
      )}
    </div>
  );
}