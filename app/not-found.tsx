/**
 * app/not-found.tsx  — Global 404 page
 *
 * Rendered by Next.js when notFound() is called or a route doesn't match.
 */
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-muted max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-surface hover:opacity-80 transition-opacity"
      >
        Back home
      </Link>
    </div>
  );
}
