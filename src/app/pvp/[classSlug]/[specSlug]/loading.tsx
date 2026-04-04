import { Skeleton } from "@/components/ui/skeleton"

export default function SpecLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-12 lg:px-6">
      {/* Hero placeholder */}
      <div className="flex min-h-[280px] flex-col justify-end space-y-4 pt-20 lg:min-h-[340px]">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </div>

      {/* Bracket cards */}
      <div className="space-y-4">
        <Skeleton className="h-3 w-28" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
