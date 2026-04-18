/**
 * app/(public)/experience/loading.tsx
 *
 * Shown by Next.js while the Experience Server Component is streaming.
 * Mirrors the layout of the real page so there's no layout shift.
 */
import { ExperienceSkeleton } from "@/components/ui/Skeleton";
import { Skeleton }           from "@/components/ui/Skeleton";

export default function ExperienceLoading() {
  return (
    <div className="prose-layout py-16 md:py-24">
      {/* Header skeleton */}
      <div className="mb-14 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {/* Timeline skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <ExperienceSkeleton key={i} />
      ))}
    </div>
  );
}


/**
 * app/(public)/work/loading.tsx
 */
// import { ProjectCardSkeleton } from "@/components/ui/Skeleton";
// import { Skeleton }            from "@/components/ui/Skeleton";
//
// export default function WorkLoading() {
//   return (
//     <div className="prose-layout py-16 md:py-24">
//       <div className="mb-14 space-y-3">
//         <Skeleton className="h-3 w-20" />
//         <Skeleton className="h-9 w-32" />
//         <Skeleton className="h-4 w-64" />
//       </div>
//       <div className="grid gap-5 sm:grid-cols-2">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <ProjectCardSkeleton key={i} />
//         ))}
//       </div>
//     </div>
//   );
// }


/**
 * app/(public)/blog/loading.tsx
 */
// import { PostRowSkeleton } from "@/components/ui/Skeleton";
// import { Skeleton }        from "@/components/ui/Skeleton";
//
// export default function BlogLoading() {
//   return (
//     <div className="prose-layout py-16 md:py-24">
//       <div className="mb-14 space-y-3">
//         <Skeleton className="h-3 w-16" />
//         <Skeleton className="h-9 w-24" />
//         <Skeleton className="h-4 w-80" />
//       </div>
//       {Array.from({ length: 6 }).map((_, i) => (
//         <PostRowSkeleton key={i} />
//       ))}
//     </div>
//   );
// }
