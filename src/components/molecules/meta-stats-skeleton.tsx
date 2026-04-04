import { Skeleton } from "@/components/ui/skeleton"

export function MetaStatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({
          length: 5,
        }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/80 px-4 py-3">
            <Skeleton className="mb-2 h-3 w-16" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-border bg-card/80">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-36 rounded-lg" />
            <Skeleton className="h-7 w-32 rounded-lg" />
          </div>
        </div>
        <div className="p-2">
          {/* Header row */}
          <div className="flex items-center gap-4 px-2 py-2">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
          {/* Data rows */}
          {Array.from({
            length: 12,
          }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-t border-border/30 px-2 py-2.5">
              <Skeleton className="h-4 w-6" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-7 rounded" />
              <Skeleton className="h-4 w-10" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-2 w-32 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-1.5 w-12 rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="flex gap-0.5">
                {Array.from({
                  length: 4,
                }).map((_, j) => (
                  <Skeleton key={j} className="h-1.5 w-1.5 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
