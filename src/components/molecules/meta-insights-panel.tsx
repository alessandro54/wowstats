"use client"

import { ClassWheel } from "@/components/atoms/class-wheel"
import { DiversityMeter } from "@/components/atoms/diversity-meter"
import { MetaHighlights } from "@/components/atoms/meta-highlights"
import { TopPerformers } from "@/components/atoms/top-performers"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"

interface Props {
  entries: MetaStatsEntry[]
}

export function MetaInsightsPanel({ entries }: Props) {
  if (entries.length === 0) return null

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Meta Insights
      </h3>
      <DiversityMeter entries={entries} />
      <ClassWheel entries={entries} />
      <TopPerformers entries={entries} />
      <MetaHighlights entries={entries} />
    </div>
  )
}
