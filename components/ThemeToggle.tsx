/**
 * components/ThemeToggle.tsx
 *
 * A sleek, accessible icon button that cycles between light / dark themes.
 * Uses `useTheme` from next-themes and animates the icon swap.
 *
 * Renders null during SSR (mounted guard) to avoid hydration mismatch,
 * because the theme is unknown on the server.
 */

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after client mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder with identical dimensions so layout doesn't shift
    return <div className="h-8 w-8" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={[
        // Layout
        "relative flex h-8 w-8 items-center justify-center rounded-lg",
        // Colors — subtle surface, visible on hover
        "text-muted hover:text-primary",
        "bg-transparent hover:bg-surface-raised",
        // Border
        "border border-transparent hover:border-border",
        // Transition
        "transition-all duration-200 ease-in-out",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
      ].join(" ")}
    >
      {/*
       * Two icons overlaid; the active one is visible.
       * CSS opacity + scale transition gives a smooth swap effect.
       */}
      <Sun
        size={15}
        strokeWidth={1.75}
        className={[
          "absolute transition-all duration-200",
          isDark
            ? "opacity-0 scale-75 rotate-90"
            : "opacity-100 scale-100 rotate-0",
        ].join(" ")}
      />
      <Moon
        size={15}
        strokeWidth={1.75}
        className={[
          "absolute transition-all duration-200",
          isDark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-75 -rotate-90",
        ].join(" ")}
      />
    </button>
  );
}
