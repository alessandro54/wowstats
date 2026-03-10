"use client"

import Image from "next/image"
import { useRef, useState } from "react"

export interface MetaBarEntry {
  key: string
  specName: string
  normPct: number // 0-100, normalized to max meta_score
  metaScore: number // raw 0-1 value
  meanRating: number
  winRate: number // shrunk_winrate as 0-1
  presence: number // games_share as 0-1
  color: string
  iconUrl?: string
  tier: "S" | "A" | "B" | "C" | "D"
}

export type { MetaBarEntry as MetaBarChartEntry }

const TIER_COLORS: Record<MetaBarEntry["tier"], string> = {
  S: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
  A: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
  B: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  C: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  D: "bg-muted/40 text-muted-foreground border border-border",
}

interface TooltipData {
  entry: MetaBarEntry
  x: number
  colIndex: number
  totalCols: number
}

export function MetaBarChart({ entries }: { entries: MetaBarEntry[] }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (entry: MetaBarEntry, index: number) => {
    setTooltip({
      entry,
      x: 0,
      colIndex: index,
      totalCols: entries.length,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className="relative w-full overflow-x-auto" ref={containerRef}>
      {/* Tooltip */}
      {tooltip &&
        (() => {
          const { entry, colIndex, totalCols } = tooltip
          // Align tooltip: if in the right half, anchor right; else anchor left
          const isRight = colIndex > totalCols / 2
          const offsetPct = (colIndex / totalCols) * 100
          return (
            <div
              className="pointer-events-none absolute z-50 -top-1 w-44 rounded-lg border border-border bg-popover px-3 py-2 shadow-lg"
              style={
                isRight
                  ? {
                      right: `${100 - offsetPct}%`,
                      transform: "translateY(-100%) translateX(50%)",
                    }
                  : {
                      left: `${offsetPct}%`,
                      transform: "translateY(-100%) translateX(-50%)",
                    }
              }
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="truncate text-[12px] font-semibold text-foreground">
                  {entry.specName}
                </span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${TIER_COLORS[entry.tier]}`}
                >
                  {entry.tier}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
                <dt className="text-muted-foreground">Meta</dt>
                <dd className="text-right font-mono tabular-nums text-foreground">
                  {(entry.metaScore * 100).toFixed(1)}%
                </dd>
                <dt className="text-muted-foreground">Avg Rating</dt>
                <dd className="text-right font-mono tabular-nums text-foreground">
                  {entry.meanRating.toFixed(0)}
                </dd>
                <dt className="text-muted-foreground">Win Rate</dt>
                <dd className="text-right font-mono tabular-nums text-foreground">
                  {(entry.winRate * 100).toFixed(1)}%
                </dd>
                <dt className="text-muted-foreground">Presence</dt>
                <dd className="text-right font-mono tabular-nums text-foreground">
                  {(entry.presence * 100).toFixed(1)}%
                </dd>
              </dl>
            </div>
          )
        })()}

      {/* Bar chart row */}
      <div
        className="flex flex-row items-end gap-1.5 pb-2 pt-8"
        style={{
          minHeight: 220,
        }}
      >
        {entries.map((entry, index) => {
          const isHovered = tooltip?.entry.key === entry.key
          const barHeightPct = Math.max(entry.normPct, 4)

          return (
            <div
              key={entry.key}
              className="flex w-10 flex-col items-center"
              onMouseEnter={() => handleMouseEnter(entry, index)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Percentage label */}
              <span
                className="mb-1 font-mono text-[9px] tabular-nums transition-opacity"
                style={{
                  color: entry.color,
                  opacity: isHovered ? 1 : 0.7,
                }}
              >
                {entry.normPct.toFixed(0)}%
              </span>

              {/* Bar track */}
              <div
                className="relative flex w-8 flex-col justify-end rounded-sm transition-all"
                style={{
                  height: 160,
                  backgroundColor: "hsl(var(--muted))",
                  boxShadow: isHovered ? `0 0 0 2px ${entry.color}` : undefined,
                }}
              >
                {/* Bar fill */}
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${barHeightPct}%`,
                    minHeight: 4,
                    backgroundColor: entry.color,
                    opacity: isHovered ? 1 : 0.85,
                  }}
                />
              </div>

              {/* Spec icon */}
              {entry.iconUrl ? (
                <Image
                  src={entry.iconUrl}
                  alt={entry.specName}
                  width={20}
                  height={20}
                  className="mt-1.5 mb-1 rounded-sm"
                  unoptimized
                />
              ) : (
                <div
                  className="mt-1.5 mb-1 h-5 w-5 rounded-sm"
                  style={{
                    backgroundColor: entry.color,
                    opacity: 0.6,
                  }}
                />
              )}

              {/* Spec name */}
              <span className="max-w-10 truncate text-center text-[9px] font-medium text-muted-foreground">
                {entry.specName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
