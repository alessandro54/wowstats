"use client"

import Image from "next/image"
import { useState } from "react"
import type { MetaBarEntry } from "@/components/molecules/meta-bar-chart"

const TIER_COLORS: Record<MetaBarEntry["tier"], string> = {
  S: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
  A: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
  B: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  C: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  D: "bg-muted/40 text-muted-foreground border border-border",
}

interface Props {
  entries: MetaBarEntry[]
}

export function MetaSpecTable({ entries }: Props) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  return (
    <div className="w-full overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="w-8 shrink-0 text-center">#</span>
        <span className="flex-1">Spec</span>
        <span className="w-8 shrink-0 text-center">Tier</span>
        <span className="w-20 shrink-0 text-center">Meta</span>
        <span className="w-20 shrink-0 text-right">Rating</span>
        <span className="w-16 shrink-0 text-right">Win%</span>
        <span className="w-16 shrink-0 text-right">Presence</span>
      </div>

      {/* Data rows */}
      {entries.map((entry, index) => {
        const isHovered = hoveredKey === entry.key
        return (
          <div
            key={entry.key}
            className="flex cursor-default items-center gap-2 border-b border-border/50 px-4 py-2 transition-colors last:border-b-0"
            style={{
              backgroundColor: isHovered ? "hsl(var(--muted) / 0.2)" : undefined,
            }}
            onMouseEnter={() => setHoveredKey(entry.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            {/* Rank */}
            <span className="w-8 shrink-0 text-center font-mono text-[11px] text-muted-foreground">
              {index + 1}
            </span>

            {/* Spec icon + name */}
            <div className="flex flex-1 items-center gap-2">
              {entry.iconUrl ? (
                <Image
                  src={entry.iconUrl}
                  alt={entry.specName}
                  width={18}
                  height={18}
                  className="shrink-0 rounded-sm"
                  unoptimized
                />
              ) : (
                <div
                  className="h-[18px] w-[18px] shrink-0 rounded-sm"
                  style={{
                    backgroundColor: entry.color,
                    opacity: 0.7,
                  }}
                />
              )}
              <span
                className="truncate text-sm font-medium"
                style={{
                  color: entry.color,
                }}
              >
                {entry.specName}
              </span>
            </div>

            {/* Tier badge */}
            <div className="w-8 shrink-0 text-center">
              <span
                className={`inline-block rounded px-1 py-0.5 text-[10px] font-bold ${TIER_COLORS[entry.tier]}`}
              >
                {entry.tier}
              </span>
            </div>

            {/* Meta inline bar */}
            <div className="w-20 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${entry.normPct}%`,
                      backgroundColor: entry.color,
                    }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {entry.normPct.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Avg Rating */}
            <span className="w-20 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
              {entry.meanRating.toFixed(0)}
            </span>

            {/* Win Rate */}
            <span className="w-16 shrink-0 text-right font-mono text-sm tabular-nums text-foreground">
              {(entry.winRate * 100).toFixed(1)}%
            </span>

            {/* Presence */}
            <span className="w-16 shrink-0 text-right font-mono text-sm tabular-nums text-muted-foreground">
              {(entry.presence * 100).toFixed(1)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}
