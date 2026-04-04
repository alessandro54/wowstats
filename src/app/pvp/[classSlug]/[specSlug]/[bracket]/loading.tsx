import { TalentTreeSkeleton } from "@/components/organisms/talent-tree"
import { Skeleton } from "@/components/ui/skeleton"

export default function BracketLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-12 pt-2 lg:px-6">
      {/* Top Players */}
      <div className="space-y-2">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({
            length: 3,
          }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-64 shrink-0 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Talent trees */}
      <div className="sm:overflow-x-auto">
        <div className="flex flex-col items-stretch gap-6 sm:min-w-max sm:flex-row">
          {(
            [
              "Class Talents",
              "Spec Talents",
            ] as const
          ).map((label) => (
            <div key={label} className="flex flex-1 flex-col">
              <Skeleton className="mx-auto mb-3 h-5 w-28" />
              <div className="rounded-xl border p-4">
                <TalentTreeSkeleton />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({
            length: 8,
          }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
