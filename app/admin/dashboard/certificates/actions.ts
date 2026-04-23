"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Certificate } from "@/lib/types";

export async function createCertificate(data: Omit<Certificate, "id" | "created_at" | "updated_at">) {
  // Paksa sebagai any agar tidak error 'never'
  const supabase = createClient() as any; 
  
  const { error } = await supabase
    .from("certificates")
    .insert({ ...data, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);
  
  // Revalidasi halaman yang menampilkan sertifikat
  revalidatePath("/"); // Halaman utama (Home)
  revalidatePath("/certificates"); // Halaman daftar semua sertifikat
  revalidatePath("/admin/dashboard/certificates"); // Halaman admin
}

export async function updateCertificate(id: string, data: Partial<Certificate>) {
  // Paksa sebagai any agar tidak error 'never'
  const supabase = createClient() as any;
  
  const { error } = await supabase
    .from("certificates")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/certificates");
  revalidatePath("/admin/dashboard/certificates");
}

export async function deleteCertificate(id: string) {
  // Paksa sebagai any agar tidak error 'never'
  const supabase = createClient() as any;
  
  const { error } = await supabase
    .from("certificates")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  revalidatePath("/certificates");
  revalidatePath("/admin/dashboard/certificates");
}

// ─── FUNGSI BARU UNTUK UPLOAD GAMBAR KE SUPABASE STORAGE ─────────────────────

export async function uploadCertificateImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("File gambar tidak ditemukan.");

  const supabase = createClient() as any;
  
  // Buat nama file yang unik agar tidak bentrok (format: certificates/123456789-random.jpg)
  const fileExt = file.name.split('.').pop();
  const fileName = `certificates/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  // Upload ke bucket bernama 'portfolio'
  const { error } = await supabase.storage
    .from("portfolio")
    .upload(fileName, file);

  if (error) throw new Error("Gagal mengunggah gambar: " + error.message);

  // Ambil link URL publik dari gambar yang baru saja diunggah
  const { data } = supabase.storage
    .from("portfolio")
    .getPublicUrl(fileName);

  return data.publicUrl;
}