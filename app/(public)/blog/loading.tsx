/**
 * app/(public)/blog/loading.tsx
 *
 * Shown by Next.js while the Blog Server Component is streaming.
 */
import { PostRowSkeleton } from "@/components/ui/Skeleton";
import { Skeleton }        from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <div className="prose-layout py-16 md:py-24">
      {/* Header */}
      <div className="mb-14 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-4 w-80" />
      </div>
      {/* Year label */}
      <Skeleton className="h-3 w-12 mb-4" />
      {/* Post rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <PostRowSkeleton key={i} />
      ))}
    </div>
  );
}
