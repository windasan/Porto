"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export async function createPost(data: Omit<Post, "id" | "created_at" | "updated_at">) {
  // 1. Tambahkan 'as any' di sini (Nuclear Option)
  const supabase = createClient() as any; 
  
  const { error } = await supabase
    .from("posts")
    .insert({ ...data, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin/dashboard/blog");
}

export async function updatePost(id: string, data: Partial<Post>) {
  // 1. Tambahkan 'as any' di sini juga
  const supabase = createClient() as any;
  
  const { error } = await supabase
    .from("posts")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug ?? ""}`);
  revalidatePath("/admin/dashboard/blog");
}

export async function deletePost(id: string) {
  const supabase = createClient() as any;
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath("/admin/dashboard/blog");
}

export async function togglePublish(id: string, currentState: boolean, slug: string) {
  const supabase = createClient() as any;
  const { error } = await supabase
    .from("posts")
    .update({
      published: !currentState,
      published_at: !currentState ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/dashboard/blog");
}