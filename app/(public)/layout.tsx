/**
 * app/(public)/layout.tsx
 *
 * Layout for all public-facing routes: /, /experience, /work, /blog, /contact
 *
 * Wraps children with:
 *  - <Navbar>  — fixed top navigation
 *  - <main>    — semantic main content area with min-height
 *  - <Footer>  — site footer
 *
 * This is a Server Component — no "use client" needed here.
 * The Navbar itself is a Client Component (it uses hooks).
 */

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      {/* Page content — flex-col + min-h ensures footer stays at bottom */}
      <main
        id="main-content"
        className="flex min-h-[calc(100vh-3.5rem)] flex-col"
        // 3.5rem = h-14 (Navbar height)
      >
        {children}
      </main>

      <Footer />
    </>
  );
}
