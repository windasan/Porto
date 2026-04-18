/**
 * app/admin/dashboard/experience/page.tsx
 */

import { createClient }      from "@/lib/supabase/server";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import type { Experience }   from "@/lib/types";

// IMPORT ACTIONS DARI FILE TERPISAH
import { createExperience, updateExperience, deleteExperience } from "./actions";

// ── Data fetching (Ini tetap di sini karena ini Server Component) ─────────────
async function getExperiences(): Promise<Experience[]> {
  const supabase = createClient();
  const { data }  = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false });
  return (data ?? []) as Experience[];
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <ExperienceManager
      experiences={experiences}
      onCreate={createExperience}
      onUpdate={updateExperience}
      onDelete={deleteExperience}
    />
  );
}