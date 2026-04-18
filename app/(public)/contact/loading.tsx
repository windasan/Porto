/**
 * app/(public)/contact/loading.tsx
 */
import { Skeleton } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <div className="prose-layout py-16 md:py-24">
      <div className="mb-14 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-12 md:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-3 w-28 mb-5" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
