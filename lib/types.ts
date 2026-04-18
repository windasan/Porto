/**
 * lib/types.ts
 *
 * Shared domain types used across public pages and the admin dashboard.
 * Keep these in sync with your Supabase table schemas.
 */

/* ── Work / Projects ────────────────────────────────────────────────────── */
export interface Project {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  /** URL of the deployed project */
  url?:        string;
  /** GitHub / source repository */
  repo_url?:   string;
  /** Cover image URL (stored in Supabase Storage) */
  image_url?:  string;
  tags:        string[];
  featured:    boolean;
  /** ISO date string */
  year:        string;
  created_at:  string;
  updated_at:  string;
}

/* ── Work Experience ────────────────────────────────────────────────────── */
export interface Experience {
  id:           string;
  company:      string;
  role:         string;
  description:  string;
  /** ISO date string, e.g. "2022-01-01" */
  start_date:   string;
  /** ISO date string, or null if current */
  end_date:     string | null;
  /** If true, render as "Present" */
  is_current:   boolean;
  location?:    string;
  company_url?: string;
  tags:         string[];
  created_at:   string;
  updated_at:   string;
}

/* ── Blog Posts ─────────────────────────────────────────────────────────── */
export interface Post {
  id:           string;
  slug:         string;
  title:        string;
  excerpt:      string;
  /** Markdown content */
  content:      string;
  cover_url?:   string;
  tags:         string[];
  published:    boolean;
  /** ISO date string */
  published_at: string | null;
  reading_time: number;  // minutes
  created_at:   string;
  updated_at:   string;
}

/* ── Supabase Database type stub ─────────────────────────────────────────
 * Replace with the generated output of:
 *   npx supabase gen types typescript --project-id <id> > lib/types/database.ts
 */
export namespace Database {
  export interface Tables {
    projects:    { Row: Project };
    experiences: { Row: Experience };
    posts:       { Row: Post };
  }
}

/* ── Utility ─────────────────────────────────────────────────────────────── */
/** Generic API response wrapper */
export interface ApiResult<T> {
  data:  T | null;
  error: string | null;
}
