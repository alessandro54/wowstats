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
    <div className="rounded-lg border border-border/30 bg-card/15 p-4">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Meta Insights
      </h3>
      <div className="mb-4">
        <DiversityMeter entries={entries} />
      </div>
      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-border md:grid-cols-3 lg:grid-cols-1 lg:divide-x-0 lg:gap-5">
        <div className="sm:pr-4 md:pr-5 lg:pr-0">
          <ClassWheel entries={entries} />
        </div>
        <div className="sm:pl-4 md:px-5 lg:px-0">
          <TopPerformers entries={entries} />
        </div>
        <div className="sm:col-span-2 sm:border-t sm:border-border sm:pt-4 md:col-span-1 md:border-t-0 md:pl-5 md:pt-0 lg:pl-0">
          <MetaHighlights entries={entries} />
        </div>
      </div>
    </div>
  )
}
