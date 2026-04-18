/**
 * components/Footer.tsx
 */

import Link from "next/link";

// components/Footer.tsx
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer> {/* Tambah border tipis agar terlihat batasnya */}
      <div className="wide-layout flex flex-col items-center justify-center gap-2 py-6 text-xs text-muted text-center">
        <p>© {year} Cyborged. All rights reserved.</p>
        <p>Cyber Security Anthusiast & Fullstack Web Developer</p>
      </div>
    </footer>
  );
}