/**
 * app/error.tsx — Global Error Boundary
 *
 * "use client" is required — error boundaries must be Client Components.
 * Catches unexpected runtime errors in the React tree below the root layout.
 * In production Next.js shows this instead of a white crash screen.
 */

"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error-tracking service here (e.g. Sentry)
    console.error("[Global error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
        <AlertTriangle size={20} strokeWidth={1.75} aria-hidden />
      </div>

      <h1 className="mt-5 text-2xl font-bold tracking-tight text-primary">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted max-w-xs">
        An unexpected error occurred. You can try again, or come back later.
      </p>

      {/* Show digest in development for quick identification */}
      {process.env.NODE_ENV === "development" && error.message && (
        <pre className="mt-4 max-w-sm overflow-x-auto rounded-lg border border-border bg-surface-raised px-4 py-3 text-left text-xs text-red-400">
          {error.message}
          {error.digest && `\n\nDigest: ${error.digest}`}
        </pre>
      )}

      <button
        onClick={reset}
        className={[
          "mt-8 inline-flex items-center gap-2 rounded-lg",
          "bg-primary px-4 py-2 text-sm font-medium text-surface",
          "hover:opacity-80 transition-opacity",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        ].join(" ")}
      >
        <RotateCcw size={13} strokeWidth={2} aria-hidden />
        Try again
      </button>
    </div>
  );
}
