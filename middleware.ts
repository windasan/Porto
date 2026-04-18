/**
 * middleware.ts  — Route Guard
 *
 * Runs on the Edge Runtime before every matched request.
 *
 * Responsibilities:
 *  1. Refresh the Supabase session cookie (keeps auth alive across navigations)
 *  2. Protect all /admin/* routes:
 *       - /admin/login  → always public (login page itself)
 *       - /admin/*      → redirect unauthenticated users to /
 *  3. Prevent authenticated users from hitting /admin/login again
 *     (redirect them to /admin/dashboard)
 *
 * Matcher config intentionally excludes static assets and API routes
 * that don't need auth checks for performance.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Create a response we can mutate (for cookie refresh) ──────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ── Initialise Supabase on the Edge ───────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Write to both the request (for downstream) and the response (for browser)
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ── Refresh session (IMPORTANT: do this before any auth checks) ────────
  // This call silently refreshes the access token if it has expired,
  // and is a no-op if the user is already logged out.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = !!session;

  // ── Route: /admin/login ─────────────────────────────────────────────────
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      // Already logged in — redirect to dashboard so they don't see the login form
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Not logged in — allow through
    return response;
  }

  // ── Route: /admin/* (everything except /admin/login) ───────────────────
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      /*
       * Unauthenticated — redirect to home (/).
       * We redirect to / rather than /admin/login to keep the admin
       * routes truly "hidden" from casual observation.
       * Change to /admin/login if you prefer a visible login UX.
       */
      const redirectUrl = new URL("/", request.url);
      // Preserve the intended destination so we can redirect back post-login
      redirectUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // Authenticated — allow access
    return response;
  }

  // ── All other routes: pass through ─────────────────────────────────────
  return response;
}

/* ── Matcher ─────────────────────────────────────────────────────────────── */
export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico
     *  - Public assets (png, svg, jpg, etc.)
     *
     * The negative lookahead keeps the middleware off the hot path for assets.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
