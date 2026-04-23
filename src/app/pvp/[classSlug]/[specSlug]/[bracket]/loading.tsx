import { TalentTreeSkeleton } from "@/components/organisms/talent-tree"
import { Skeleton } from "@/components/ui/skeleton"

export default function BracketLoading() {
  return (
    <div className="space-y-8">
      {/* Top Players — full table matching real layout */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <div className="ml-2 h-px w-16 bg-gradient-to-r from-border to-transparent" />
          </div>
          <Skeleton className="h-9 w-44 rounded-lg" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/30">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 bg-black/20">
                <th className="w-16 px-4 py-3.5">
                  <Skeleton className="mx-auto h-2.5 w-3" />
                </th>
                <th className="px-4 py-3.5 text-left">
                  <Skeleton className="h-2.5 w-14" />
                </th>
                <th className="w-32 px-4 py-3.5">
                  <Skeleton className="mx-auto h-2.5 w-14" />
                </th>
                <th className="hidden w-28 px-4 py-3.5 sm:table-cell">
                  <Skeleton className="mx-auto h-2.5 w-10" />
                </th>
                <th className="w-24 px-4 py-3.5">
                  <Skeleton className="mx-auto h-2.5 w-12" />
                </th>
                <th className="w-24 px-4 py-3.5">
                  <Skeleton className="mx-auto h-2.5 w-14" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({
                length: 10,
              }).map((_, i) => (
                <tr key={i} className="border-b border-border/20">
                  <td className="w-16 px-4 py-4 text-center">
                    <Skeleton className="mx-auto h-5 w-6" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 shrink-0 rounded-full" />
                      <div>
                        <Skeleton className="mb-1.5 h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="w-32 px-4 py-4 text-center">
                    <Skeleton className="mx-auto h-6 w-14" />
                  </td>
                  <td className="hidden w-28 px-4 py-4 text-center sm:table-cell">
                    <Skeleton className="mx-auto h-4 w-16" />
                  </td>
                  <td className="w-24 px-4 py-4 text-center">
                    <Skeleton className="mx-auto h-4 w-10" />
                  </td>
                  <td className="w-24 px-4 py-4 text-center">
                    <Skeleton className="mx-auto h-4 w-8" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-10" />
          <div className="ml-2 h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({
            length: 16,
          }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 px-3 py-2.5"
            >
              <Skeleton className="size-9 shrink-0 rounded" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
