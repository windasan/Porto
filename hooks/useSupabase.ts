/**
 * hooks/useSupabase.ts
 *
 * Client-side hook for accessing the Supabase browser client and
 * subscribing to auth state changes.
 *
 * Usage in Client Components:
 *   const { supabase, session, user } = useSupabase();
 */

"use client";

import { useEffect, useState } from "react";
import type { Session, User }  from "@supabase/supabase-js";
import { createClient }        from "@/lib/supabase/client";

interface UseSupabaseReturn {
  supabase: ReturnType<typeof createClient>;
  session:  Session | null;
  user:     User    | null;
  loading:  boolean;
}

export function useSupabase(): UseSupabaseReturn {
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes (sign in / sign out / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  return {
    supabase,
    session,
    user:    session?.user ?? null,
    loading,
  };
}
