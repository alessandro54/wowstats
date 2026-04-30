import { Skeleton } from "@/components/ui/skeleton"

export function MetaStatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI row — matches MetaKpiRow: px-4 py-3, text-[10px] label + text-xl value */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({
          length: 5,
        }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card/80 px-4 py-3">
            <Skeleton className="h-3 w-20" />
            <div className="mt-1.5 flex items-center gap-2">
              {i >= 3 && <Skeleton className="h-6 w-6 rounded-sm" />}
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Spec Rankings card */}
      <div className="rounded-lg border border-border bg-card/80">
        {/* Card header — matches: px-4 py-3, h2 text-sm + switchers h-7 */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <Skeleton className="h-7 w-28 rounded-lg" />
          </div>
        </div>

        {/* Tier list + Insights — matches: grid xl:grid-cols-[1fr_280px] p-4 gap-4 */}
        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[1fr_280px]">
          {/* Tier list — matches: w-14 label + min-h-16 row + 48x48 icons */}
          <div className="space-y-2">
            {[
              {
                tier: "S+",
                count: 1,
              },
              {
                tier: "S",
                count: 3,
              },
              {
                tier: "A",
                count: 5,
              },
              {
                tier: "B",
                count: 6,
              },
              {
                tier: "C",
                count: 4,
              },
            ].map(({ tier, count }) => (
              <div key={tier} className="flex">
                <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-l-lg bg-muted/30 px-2 py-3">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="mt-1 h-2 w-10" />
                </div>
                <div className="flex flex-1 flex-wrap items-center gap-3 rounded-r-lg border border-border/40 bg-card/40 px-4 py-3 min-h-16">
                  {Array.from({
                    length: count,
                  }).map((_, j) => (
                    <Skeleton key={j} className="h-12 w-12 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Insights panel — matches: space-y-3, p-3 cards */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            {Array.from({
              length: 4,
            }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border/30 bg-card/40 p-3">
                <Skeleton className="mb-2 h-3 w-28" />
                <Skeleton className="h-5 w-36" />
                {i < 2 && <Skeleton className="mt-2 h-2 w-full rounded-full" />}
              </div>
            ))}
          </div>
        </div>

        {/* Data table — matches: min-w-[720px], py-2.5 rows, 20x20 icons */}
        <div className="overflow-x-auto border-t border-border">
          <div className="min-w-[720px] p-2">
            {/* Header */}
            <div className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-3 w-6" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="ml-auto h-3 w-40" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            {/* Rows */}
            {Array.from({
              length: 12,
            }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-t border-border/30 px-3 py-2.5"
              >
                <Skeleton className="h-4 w-6 shrink-0" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 shrink-0 rounded-sm" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
                <Skeleton className="h-5 w-8 rounded" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="ml-auto h-2 w-36 rounded-full" />
                <Skeleton className="h-4 w-12" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-1.5 w-14 rounded-full" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <div className="flex gap-0.5">
                  {Array.from({
                    length: 4,
                  }).map((_, j) => (
                    <Skeleton key={j} className="h-2 w-2 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
