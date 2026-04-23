/**
 * app/admin/dashboard/certificates/page.tsx
 */

import { createClient } from "@/lib/supabase/server";
import { CertificateManager } from "@/components/admin/CertificateManager"; 
import type { Certificate } from "@/lib/types";

// 1. PASTIKAN uploadCertificateImage DI-IMPORT DI SINI
import { 
  createCertificate, 
  updateCertificate, 
  deleteCertificate, 
  uploadCertificateImage 
} from "./actions";

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getCertificates(): Promise<Certificate[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .order("issued_at", { ascending: false }); 
  return (data ?? []) as Certificate[];
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminCertificatesPage() {
  const certificates = await getCertificates();

  return (
    <CertificateManager
      certificates={certificates}
      onCreate={createCertificate}
      onUpdate={updateCertificate}
      onDelete={deleteCertificate}
      onUploadImage={uploadCertificateImage} /* 2. PASTIKAN BARIS INI ADA */
    />
  );
}