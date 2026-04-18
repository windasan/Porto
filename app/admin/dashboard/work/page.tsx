/**
 * app/admin/dashboard/work/page.tsx
 */

import { createClient } from "@/lib/supabase/server";
import { WorkManager }   from "@/components/admin/WorkManager";
import type { Project }  from "@/lib/types";

// IMPORT SEMUA ACTIONS DARI FILE TERPISAH
import { createProject, updateProject, deleteProject } from "./actions";

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("year",       { ascending: false })
    .order("created_at", { ascending: false });
  return (data ?? []) as Project[];
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminWorkPage() {
  const projects = await getProjects();

  return (
    <WorkManager
      projects={projects}
      onCreate={createProject}
      onUpdate={updateProject}
      onDelete={deleteProject}
    />
  );
}