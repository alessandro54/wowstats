import { Skeleton } from "@/components/ui/skeleton"

export default function BracketLoading() {
  return (
    <div className="space-y-8 px-6 pb-8 pt-2">
      {/* Top section: players list + stat sidebar */}
      <div className="grid gap-8 xl:grid-cols-[1fr_280px]">
        {/* Players */}
        <div className="space-y-2">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-32 rounded-full" />
          </div>
          {Array.from({
            length: 10,
          }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>

        {/* Stat priority */}
        <div className="space-y-3 rounded-lg border p-4">
          <Skeleton className="h-4 w-24" />
          {Array.from({
            length: 5,
          }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Talents */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-48 w-full rounded-xl" />
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
