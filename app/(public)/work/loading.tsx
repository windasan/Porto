/**
 * app/(public)/work/loading.tsx
 */
import { ProjectCardSkeleton } from "@/components/ui/Skeleton";
import { Skeleton }            from "@/components/ui/Skeleton";

export default function WorkLoading() {
  return (
    <div className="prose-layout py-16 md:py-24">
      <div className="mb-14 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      {/* Featured row */}
      <Skeleton className="h-3 w-16 mb-5" />
      <div className="grid gap-5 sm:grid-cols-2 mb-12">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
      {/* Others */}
      <Skeleton className="h-3 w-28 mb-5" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
