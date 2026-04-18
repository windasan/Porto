/**
 * lib/supabase/client.ts
 *
 * Browser-side Supabase client singleton.
 * Import this in Client Components ("use client") and browser-only hooks.
 *
 * Uses @supabase/ssr which manages session cookies automatically —
 * no manual token handling required.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * Singleton instance.
 * Calling `createBrowserClient` multiple times is safe (it de-dupes internally),
 * but caching it here avoids unnecessary re-initialisation on every render.
 */
let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (client) return client;

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
