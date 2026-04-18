import { createClient } from "@/lib/supabase/server";
import { BlogManager } from "@/components/admin/BlogManager";
import type { Post } from "@/lib/types";

// Ambil fungsinya dari file actions yang baru dibuat
import { createPost, updatePost, deletePost, togglePublish } from "./actions";

async function getPosts(): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Post[];
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <BlogManager
      posts={posts}
      onCreate={createPost}
      onUpdate={updatePost}
      onDelete={deletePost}
      onTogglePublish={togglePublish}
    />
  );
}