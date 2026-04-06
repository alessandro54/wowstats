"use client"

import Image from "next/image"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import { TIER_COLORS } from "@/config/app-config"
import { titleizeSlug } from "@/lib/utils"

interface Props {
  entries: MetaStatsEntry[]
}

export function TopPerformers({ entries }: Props) {
  const top3 = entries.slice(0, 3)
  const medals = [
    "🥇",
    "🥈",
    "🥉",
  ]

  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        Top Performers
      </span>
      <div className="space-y-1.5">
        {top3.map((entry, i) => (
          <div key={entry.key} className="flex items-center gap-2">
            <span className="text-sm">{medals[i]}</span>
            {entry.iconUrl && (
              <Image
                src={entry.iconUrl}
                alt={entry.specName}
                width={20}
                height={20}
                className="rounded-sm"
                style={{
                  border: `1px solid ${entry.color}80`,
                }}
                unoptimized
              />
            )}
            <div className="min-w-0 flex-1">
              <span
                className="text-xs font-medium"
                style={{
                  color: entry.color,
                }}
              >
                {titleizeSlug(entry.specName)}
              </span>
              <span className="ml-1 text-[10px] text-muted-foreground">
                {titleizeSlug(entry.className)}
              </span>
            </div>
            <span className={`rounded px-1 py-0.5 text-[9px] font-bold ${TIER_COLORS[entry.tier]}`}>
              {entry.tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
