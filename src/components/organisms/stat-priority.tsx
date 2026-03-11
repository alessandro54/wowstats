"use client"

import type { StatPriorityEntry } from "@/lib/api"
import { getStatMeta } from "@/config/equipment-config"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  stats: StatPriorityEntry[]
  compact?: boolean
  vertical?: boolean
}

function StatTooltipContent({
  entry,
  index,
  total,
}: {
  entry: StatPriorityEntry
  index: number
  total: number
}) {
  const { label, color } = getStatMeta(entry.stat)

  return (
    <div className="space-y-1 text-[11px]">
      <div
        className="font-semibold"
        style={{
          color,
        }}
      >
        {label}
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-muted-foreground">
        <span>Rank</span>
        <span className="text-foreground font-mono text-right">
          #{index + 1} of {total}
        </span>
        <span>Median</span>
        <span className="text-foreground font-mono text-right">{Math.round(entry.median)}</span>
      </div>
    </div>
  )
}

export function StatPriority({ stats, compact, vertical }: Props) {
  if (stats.length === 0) return null

  const max = stats[0].median

  if (vertical) {
    return (
      <div className="flex items-center gap-2">
        {stats.map((entry, i) => {
          const { label, color } = getStatMeta(entry.stat)
          const barHeight = max > 0 ? (entry.median / max) * 100 : 0

          return (
            <Tooltip key={entry.stat}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-0.5 cursor-default">
                  <span className="text-[8px] font-mono tabular-nums text-muted-foreground">
                    {Math.round(entry.median)}
                  </span>
                  <div className="flex h-8 w-4 items-end overflow-hidden rounded-sm bg-muted">
                    <div
                      className="w-full rounded-sm opacity-40 transition-all"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span
                    className="text-[7px] font-semibold uppercase leading-tight"
                    style={{
                      color,
                    }}
                  >
                    {label.slice(0, 4)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-card text-foreground border border-border shadow-lg px-3 py-2"
              >
                <StatTooltipContent entry={entry} index={i} total={stats.length} />
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Stat Priority
        </span>
        {stats.map((entry, i) => {
          const { label, color } = getStatMeta(entry.stat)
          const barWidth = max > 0 ? (entry.median / max) * 100 : 0

          return (
            <Tooltip key={entry.stat}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-default">
                  <span
                    className="w-10 shrink-0 text-right text-[10px] font-semibold uppercase"
                    style={{
                      color,
                    }}
                  >
                    {label.slice(0, 4)}
                  </span>
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full opacity-40 transition-all"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[10px] font-mono tabular-nums text-muted-foreground">
                    {Math.round(entry.median)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-card text-foreground border border-border shadow-lg px-3 py-2"
              >
                <StatTooltipContent entry={entry} index={i} total={stats.length} />
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    )
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Stat Priority</h2>
      <div className="rounded-lg border border-border bg-card/80 px-4 py-3 space-y-2.5">
        <p className="text-[11px] text-muted-foreground">Median stat rating across top players</p>
        <div className="space-y-2">
          {stats.map((entry, i) => {
            const { label, color } = getStatMeta(entry.stat)
            const barWidth = max > 0 ? (entry.median / max) * 100 : 0

            return (
              <div key={entry.stat} className="flex items-center gap-3">
                <span className="w-4 text-right text-[11px] font-mono text-muted-foreground shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{
                        color,
                      }}
                    >
                      {label}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-muted-foreground shrink-0">
                      {Math.round(entry.median)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
