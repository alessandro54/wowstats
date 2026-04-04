"use client"

import type { StatPriorityEntry } from "@/lib/api"
import { getStatMeta } from "@/config/equipment-config"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  stats: StatPriorityEntry[]
  compact?: boolean
  vertical?: boolean
}

function AllStatsTooltip({ stats }: { stats: StatPriorityEntry[] }) {
  const total = stats.reduce((sum, s) => sum + s.median, 0)
  return (
    <div className="space-y-2 min-w-[160px]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Stat Priority
      </p>
      <div className="space-y-1.5">
        {stats.map((entry, i) => {
          const { label, color } = getStatMeta(entry.stat)
          const pct = total > 0 ? ((entry.median / total) * 100).toFixed(0) : "0"
          return (
            <div key={entry.stat} className="flex items-center gap-2 text-[11px]">
              <span className="w-3 shrink-0 text-right font-mono text-muted-foreground">
                {i + 1}
              </span>
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: color,
                }}
              />
              <span
                className="flex-1 font-medium"
                style={{
                  color,
                }}
              >
                {label}
              </span>
              <span className="font-mono tabular-nums text-foreground">
                {Math.round(entry.median)}
              </span>
              <span className="w-7 shrink-0 text-right font-mono text-muted-foreground">
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatLabels({ stats }: { stats: StatPriorityEntry[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
      {stats.map((entry) => {
        const { label, color } = getStatMeta(entry.stat)
        return (
          <span
            key={entry.stat}
            className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide"
          >
            <span
              className="inline-block size-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />
            <span
              style={{
                color,
              }}
            >
              {label.slice(0, 4)}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export function StatPriority({ stats, compact, vertical }: Props) {
  if (stats.length === 0) return null

  const total = stats.reduce((sum, s) => sum + s.median, 0)

  const bar = (height: string) => (
    <div className={`flex ${height} overflow-hidden rounded-full gap-px`}>
      {stats.map((entry) => {
        const { color } = getStatMeta(entry.stat)
        const pct = total > 0 ? (entry.median / total) * 100 : 0
        return (
          <div
            key={entry.stat}
            className="h-full"
            style={{
              width: `${pct}%`,
              backgroundColor: color,
              opacity: 0.9,
            }}
          />
        )
      })}
    </div>
  )

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex w-48 cursor-default flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Stat Priority
            </span>
            {bar("h-3")}
            <StatLabels stats={stats} />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border border-border bg-card px-3 py-2.5 text-foreground shadow-lg"
        >
          <AllStatsTooltip stats={stats} />
        </TooltipContent>
      </Tooltip>
    )
  }

  if (vertical) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex w-24 cursor-default flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Stats
            </span>
            {bar("h-2")}
            <StatLabels stats={stats} />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border border-border bg-card px-3 py-2.5 text-foreground shadow-lg"
        >
          <AllStatsTooltip stats={stats} />
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Stat Priority</h2>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-default space-y-2 rounded-lg border border-border bg-card/80 px-4 py-3">
            <p className="text-[11px] text-muted-foreground">
              Median stat distribution across top players
            </p>
            {bar("h-5")}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {stats.map((entry) => {
                const { label, color } = getStatMeta(entry.stat)
                return (
                  <span
                    key={entry.stat}
                    className="flex items-center gap-1 text-[10px] font-semibold"
                  >
                    <span
                      className="inline-block size-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: color,
                      }}
                    />
                    <span
                      style={{
                        color,
                      }}
                    >
                      {label}
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border border-border bg-card px-3 py-2.5 text-foreground shadow-lg"
        >
          <AllStatsTooltip stats={stats} />
        </TooltipContent>
      </Tooltip>
    </section>
  )
}
