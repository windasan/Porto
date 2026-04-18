"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export async function createProject(data: Omit<Project, "id" | "created_at" | "updated_at">) {
  // Paksa sebagai any agar tidak error 'never'
  const supabase = createClient() as any; 
  
  const { error } = await supabase
    .from("projects")
    .insert({ ...data, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);
  
  revalidatePath("/work");
  revalidatePath("/admin/dashboard/work");
}

export async function updateProject(id: string, data: Partial<Project>) {
  // Paksa sebagai any agar tidak error 'never'
  const supabase = createClient() as any;
  
  const { error } = await supabase
    .from("projects")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/work");
  revalidatePath("/admin/dashboard/work");
}

export async function deleteProject(id: string) {
  // Paksa sebagai any agar tidak error 'never'
  const supabase = createClient() as any;
  
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/work");
  revalidatePath("/admin/dashboard/work");
}