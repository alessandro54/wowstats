"use client"

import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import { shannonEntropy } from "@/lib/utils/stats"

interface Props {
  entries: MetaStatsEntry[]
}

export function DiversityMeter({ entries }: Props) {
  const presences = entries.map((e) => e.presence)
  const entropy = shannonEntropy(presences)
  const maxEntropy = Math.log2(entries.length || 1)
  const diversity = maxEntropy > 0 ? entropy / maxEntropy : 0
  const viable = entries.filter(
    (e) => e.tier === "S+" || e.tier === "S" || e.tier === "A" || e.tier === "B",
  ).length

  const label =
    diversity >= 0.85
      ? "Healthy"
      : diversity >= 0.7
        ? "Balanced"
        : diversity >= 0.5
          ? "Narrow"
          : "Solved"
  const color =
    diversity >= 0.85
      ? "text-emerald-400"
      : diversity >= 0.7
        ? "text-blue-400"
        : diversity >= 0.5
          ? "text-amber-400"
          : "text-red-400"
  const barColor =
    diversity >= 0.85
      ? "bg-emerald-400"
      : diversity >= 0.7
        ? "bg-blue-400"
        : diversity >= 0.5
          ? "bg-amber-400"
          : "bg-red-400"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Meta Health
        </span>
        <span className={`text-xs font-bold ${color}`}>{label}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all ${barColor}`}
          style={{
            width: `${diversity * 100}%`,
          }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>
          {viable}/{entries.length} specs viable
        </span>
        <span>{(diversity * 100).toFixed(0)}% diversity</span>
      </div>
    </div>
  )
}
