/**
 * app/admin/login/page.tsx
 *
 * Hidden admin login page.
 * - Email + password sign-in via Supabase Auth
 * - On success → redirected to /admin/dashboard (by middleware)
 * - On error → inline error message
 *
 * This is a Client Component because it manages form state.
 */

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Middleware will handle the redirect on the next navigation,
    // but we push here for immediate UX.
    router.push("/admin/dashboard");
    router.refresh(); // invalidate RSC cache after auth state change
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="mt-1 text-sm text-muted">
            Admin access only.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface-raised p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-secondary"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={[
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-surface text-primary placeholder:text-muted",
                  "border-border outline-none",
                  "focus:border-accent focus:ring-1 focus:ring-accent",
                  "transition-colors duration-150",
                  "disabled:opacity-50",
                ].join(" ")}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-secondary"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={[
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  "bg-surface text-primary placeholder:text-muted",
                  "border-border outline-none",
                  "focus:border-accent focus:ring-1 focus:ring-accent",
                  "transition-colors duration-150",
                  "disabled:opacity-50",
                ].join(" ")}
                disabled={loading}
              />
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className={[
                "w-full flex items-center justify-center gap-2",
                "rounded-lg bg-primary px-4 py-2.5",
                "text-sm font-medium text-surface",
                "transition-opacity duration-150",
                "hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              ].join(" ")}
            >
              {loading && (
                <Loader2 size={14} className="animate-spin" aria-hidden />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
