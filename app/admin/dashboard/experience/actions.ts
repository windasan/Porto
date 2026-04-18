"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/lib/types";

export async function createExperience(data: Omit<Experience, "id" | "created_at" | "updated_at">) {
  // Tambahkan 'as any' di sini agar TypeScript tidak cerewet
  const supabase = createClient() as any; 
  
  const { error } = await supabase
    .from("experiences")
    .insert({ ...data, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/dashboard/experience");
  revalidatePath("/"); 
}

export async function updateExperience(id: string, data: Partial<Experience>) {
  // Tambahkan 'as any' di sini juga
  const supabase = createClient() as any;
  
  const { error } = await supabase
    .from("experiences")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/dashboard/experience");
  revalidatePath("/");
}

export async function deleteExperience(id: string) {
  const supabase = createClient() as any;
  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/dashboard/experience");
  revalidatePath("/");
}