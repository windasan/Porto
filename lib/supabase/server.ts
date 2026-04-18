/**
 * lib/supabase/server.ts
 *
 * Server-side Supabase client (for Server Components, Route Handlers,
 * Server Actions, and middleware).
 *
 * Uses @supabase/ssr — the official SSR-compatible package.
 * Reads/writes cookies via Next.js `cookies()` API so the auth session
 * is propagated across server renders.
 *
 * Required env vars (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component — `set` is unavailable but reads still work.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Intentionally empty — see above.
          }
        },
      },
    }
  );
}
