/**
 * lib/types/database.ts
 *
 * Supabase auto-generated database types.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO REGENERATE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * After creating your tables in Supabase, run:
 *
 *   npx supabase login
 *   npx supabase gen types typescript \
 *     --project-id YOUR_PROJECT_ID \
 *     --schema public \
 *     > lib/types/database.ts
 *
 * The generated file replaces this stub entirely.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Until then, this stub satisfies the TypeScript import in supabase/server.ts
 * and supabase/client.ts so the project compiles without errors.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      experiences: {
        Row: {
          id:          string;
          company:     string;
          role:        string;
          description: string;
          start_date:  string;
          end_date:    string | null;
          is_current:  boolean;
          location:    string | null;
          company_url: string | null;
          tags:        string[];
          created_at:  string;
          updated_at:  string;
        };
        Insert: {
          id?:         string;
          company:     string;
          role:        string;
          description: string;
          start_date:  string;
          end_date?:   string | null;
          is_current?: boolean;
          location?:   string | null;
          company_url?: string | null;
          tags?:       string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["experiences"]["Insert"]>;
      };

      projects: {
        Row: {
          id:          string;
          slug:        string;
          title:       string;
          description: string;
          url:         string | null;
          repo_url:    string | null;
          image_url:   string | null;
          tags:        string[];
          featured:    boolean;
          year:        string;
          created_at:  string;
          updated_at:  string;
        };
        Insert: {
          id?:          string;
          slug:         string;
          title:        string;
          description:  string;
          url?:         string | null;
          repo_url?:    string | null;
          image_url?:   string | null;
          tags?:        string[];
          featured?:    boolean;
          year:         string;
          created_at?:  string;
          updated_at?:  string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };

      posts: {
        Row: {
          id:           string;
          slug:         string;
          title:        string;
          excerpt:      string;
          content:      string;
          cover_url:    string | null;
          tags:         string[];
          published:    boolean;
          published_at: string | null;
          reading_time: number;
          created_at:   string;
          updated_at:   string;
        };
        Insert: {
          id?:           string;
          slug:          string;
          title:         string;
          excerpt:       string;
          content:       string;
          cover_url?:    string | null;
          tags?:         string[];
          published?:    boolean;
          published_at?: string | null;
          reading_time?: number;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
    };

    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
}
