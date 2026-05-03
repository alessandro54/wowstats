"use client"

import Image from "next/image"
import type { MetaStatsEntry } from "@/features/meta/components/meta-stats-table"
import { titleizeSlug } from "@/lib/utils"

interface Props {
  entries: MetaStatsEntry[]
}

// Drop troll-pick / tiny-sample specs from highlight aggregations. ~0.5%
// of the ladder filters out near-zero-presence outliers (e.g. Augmentation
// on Solo Shuffle) whose stats are dominated by sample-size noise.
const MIN_PRESENCE = 0.005

export function MetaHighlights({ entries }: Props) {
  const meaningful = entries.filter((e) => e.presence >= MIN_PRESENCE)

  const highestWr = [
    ...meaningful,
  ].sort((a, b) => b.wrHat - a.wrHat)[0]
  const mostPresence = [
    ...meaningful,
  ].sort((a, b) => b.presence - a.presence)[0]
  const biggestMover = [
    ...meaningful,
  ]
    .filter((e) => e.rankChange != null && e.rankChange !== 0)
    .sort((a, b) => Math.abs(b.rankChange ?? 0) - Math.abs(a.rankChange ?? 0))[0]

  const highlights = [
    {
      label: "Highest Win Rate",
      spec: highestWr,
      value: `${(highestWr?.wrHat * 100).toFixed(1)}%`,
    },
    {
      label: "Most Popular",
      spec: mostPresence,
      value: `${(mostPresence?.presence * 100).toFixed(1)}%`,
    },
    biggestMover && {
      label: "Biggest Mover",
      spec: biggestMover,
      value: `${biggestMover.rankChange! > 0 ? "↑" : "↓"} ${Math.abs(biggestMover.rankChange!)}`,
    },
  ].filter(Boolean) as Array<{
    label: string
    spec: MetaStatsEntry
    value: string
  }>

  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Highlights</span>
      <div className="space-y-1.5">
        {highlights.map(
          (h) =>
            h.spec && (
              <div key={h.label} className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">{h.label}</span>
                <div className="flex items-center gap-1.5">
                  {h.spec.iconUrl && (
                    <Image
                      src={h.spec.iconUrl}
                      alt={h.spec.specName}
                      width={14}
                      height={14}
                      className="rounded-sm"
                      unoptimized
                    />
                  )}
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: h.spec.color,
                    }}
                  >
                    {titleizeSlug(h.spec.specName)}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-foreground">
                    {h.value}
                  </span>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  )
}
