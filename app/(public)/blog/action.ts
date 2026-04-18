"use server" // Wajib ada di paling atas

import { createClient } from "@/lib/supabase/server";

export async function createPost(data: any) {
  const supabase = createClient();
  // ... logika simpan ke database
}