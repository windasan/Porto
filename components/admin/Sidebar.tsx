/**
 * components/admin/Sidebar.tsx
 *
 * Left navigation sidebar for the admin dashboard.
 * - Fixed on desktop, hidden on mobile (add a hamburger pattern as needed)
 * - Sign out button calls Supabase signOut and redirects to /
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Briefcase, FolderKanban, FileText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin/dashboard",            label: "Overview",    icon: LayoutDashboard },
  { href: "/admin/dashboard/experience", label: "Experience",  icon: Briefcase       },
  { href: "/admin/dashboard/work",       label: "Work",        icon: FolderKanban    },
  { href: "/admin/dashboard/blog",       label: "Blog",        icon: FileText        },
] as const;

interface AdminSidebarProps {
  userEmail: string;
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      className={[
        // Position
        "fixed inset-y-0 left-0 z-30",
        // Width
        "hidden lg:flex w-60 flex-col",
        // Style
        "border-r border-border bg-surface-raised",
      ].join(" ")}
      aria-label="Admin navigation"
    >
      {/* ── Logo / Brand ─────────────────────────────────────────────── */}
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View public site"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-surface text-xs font-bold">
            Y
          </span>
          <span>Admin</span>
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    active
                      ? "bg-surface-overlay text-primary font-medium"
                      : "text-muted hover:text-primary hover:bg-surface-overlay",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={15} strokeWidth={1.75} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer: user + sign out ───────────────────────────────────── */}
      <div className="border-t border-border p-3">
        <div className="mb-2 px-3 py-1">
          <p className="truncate text-2xs text-muted" title={userEmail}>
            {userEmail}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className={[
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm",
            "text-muted hover:text-primary hover:bg-surface-overlay",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          ].join(" ")}
        >
          <LogOut size={15} strokeWidth={1.75} aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
}
