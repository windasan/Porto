/**
 * components/ui/Skeleton.tsx
 *
 * Animated loading skeleton primitives.
 * Used in loading.tsx files (Next.js Suspense boundaries) to show
 * layout-preserving placeholders while data is fetching.
 *
 * Usage:
 *   <Skeleton className="h-4 w-32" />           // single line
 *   <SkeletonCard />                             // full card placeholder
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton pulse element.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-surface-overlay",
        className
      )}
    />
  );
}

/**
 * Skeleton for a blog post row.
 */
export function PostRowSkeleton() {
  return (
    <div className="flex items-start justify-between py-5 border-t border-border-subtle">
      <div className="flex-1 space-y-2 pr-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1.5 mt-2">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-10 rounded-full" />
        </div>
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

/**
 * Skeleton for a project card.
 */
export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for an experience timeline item.
 */
export function ExperienceSkeleton() {
  return (
    <div className="flex gap-6 pb-12">
      <div className="flex flex-col items-center">
        <Skeleton className="h-2.5 w-2.5 rounded-full mt-1.5" />
        <div className="mt-1 w-px flex-1 bg-border" />
      </div>
      <div className="flex-1 space-y-2 pt-0.5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full max-w-sm mt-3" />
        <Skeleton className="h-3 w-2/3 max-w-xs" />
        <div className="flex gap-1.5 pt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
