/**
 * app/admin/dashboard/layout.tsx
 *
 * Admin shell layout — rendered for all /admin/dashboard/* pages.
 *
 * Includes:
 *  - Persistent left sidebar with section links + logout
 *  - Top bar (mobile) with hamburger (wired to sidebar state via context if needed)
 *  - Auth guard at the RSC level (belt-and-suspenders alongside middleware)
 */

/**
 * app/admin/dashboard/layout.tsx
 *
 * Admin shell layout — rendered for all /admin/dashboard/* pages.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/Sidebar";

// ⚠️ TAMBAHKAN BARIS INI: Paksa Next.js untuk merender ini secara dinamis (Server-Side Rendering murni)
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Server-side auth guard (belt-and-suspenders) ──────────────────────
  // Middleware already redirects unauthenticated users, but we double-check
  // here so Server Components can safely assume `session` is non-null.
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <AdminSidebar userEmail={session.user.email ?? ""} />

      {/* ── Main content area ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}