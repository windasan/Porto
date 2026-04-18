/**
 * app/api/auth/callback/route.ts
 *
 * Supabase Auth OAuth callback handler.
 *
 * When a user completes an OAuth flow (e.g. Google, GitHub) or clicks a
 * magic link, Supabase redirects here with a `code` query param.
 * This route exchanges the code for a session, sets the session cookie,
 * and redirects the user to their destination.
 *
 * Also handles the `next` (post-login redirect) param pattern.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  // `next` is set by middleware when redirecting to login — redirect back after auth
  const next = searchParams.get("next") ?? "/admin/dashboard";

  if (!code) {
    // No code present — redirect to home with an error indicator
    return NextResponse.redirect(`${origin}/?error=missing_code`);
  }

  // ── Build a response we can write cookies to ───────────────────────────
  const response = NextResponse.redirect(`${origin}${next}`);

  // ── Create Supabase client wired to the outgoing response cookies ──────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ── Exchange code for session ──────────────────────────────────────────
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[Auth callback] Code exchange failed:", error.message);
    return NextResponse.redirect(`${origin}/?error=auth_callback_failed`);
  }

  // ── Success: redirect to destination ──────────────────────────────────
  return response;
}
