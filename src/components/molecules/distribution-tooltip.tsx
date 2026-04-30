"use client"

import Image from "next/image"
import type { Trend } from "@/lib/api"
import { DistList } from "@/components/atoms/dist-list"
import { TrendArrow } from "@/components/atoms/trend-arrow"
import { getStatMeta, QUALITY_COLORS } from "@/config/equipment-config"
import { iconUrl } from "@/config/cdn-config"

export interface DistEntry {
  name: string
  icon_url?: string | null
  quality?: string
  pct: number
  statDots?: string[]
  trend?: Trend
}

export function DistributionTooltip({
  entries,
  enchantEntries,
  gemEntries,
  activeColor,
  craftingStats,
}: {
  entries: DistEntry[]
  enchantEntries?: DistEntry[]
  gemEntries?: DistEntry[]
  activeColor: string
  craftingStats?: string[]
}) {
  const current = entries[0]
  const alternatives = entries.slice(1)
  const enchantAlts = enchantEntries?.slice(1) ?? []
  const hasRightCol = enchantAlts.length > 0 || (gemEntries && gemEntries.length > 0)
  const hasLeftCol = alternatives.length > 0 || (craftingStats && craftingStats.length > 0)
  const qualityColor = current?.quality ? QUALITY_COLORS[current.quality] : activeColor

  if (!current) return null

  return (
    <div className="w-72 space-y-3">
      {/* Current item — hero card */}
      <div
        className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
        style={{
          borderColor: `${qualityColor}44`,
          background: `${qualityColor}0d`,
        }}
      >
        {current.icon_url && (
          <Image
            src={iconUrl(current.icon_url, 32)!}
            width={32}
            height={32}
            className="shrink-0 rounded"
            alt=""
          />
        )}
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-sm font-semibold"
            style={{
              color: qualityColor,
            }}
          >
            {current.name}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Currently equipped
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className="font-mono text-sm font-bold"
            style={{
              color: qualityColor,
            }}
          >
            {current.pct.toFixed(1)}%
          </span>
          <TrendArrow trend={current.trend} />
        </div>
      </div>

      {/* 2-col below — only when there's content */}
      {(hasLeftCol || hasRightCol) && (
        <div className={hasLeftCol && hasRightCol ? "grid grid-cols-2 gap-4" : undefined}>
          {/* Left — item alternatives + crafting stats */}
          {hasLeftCol && (
            <div className="space-y-2">
              {alternatives.length > 0 && (
                <>
                  <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    Alternatives
                  </p>
                  <DistList entries={alternatives} />
                </>
              )}
              {craftingStats && craftingStats.length > 0 && (
                <div className="border-border/50 flex flex-wrap items-center gap-1.5 border-t pt-2">
                  <span className="text-muted-foreground text-[10px] tracking-wider uppercase">
                    Crafted — top stats:
                  </span>
                  {craftingStats.map((stat) => {
                    const { label, color } = getStatMeta(stat)
                    return (
                      <span
                        key={stat}
                        className="text-[11px] font-semibold"
                        style={{
                          color: color ?? "inherit",
                        }}
                      >
                        {label}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Right — enchants + gems */}
          {hasRightCol && (
            <div className={`space-y-3${hasLeftCol ? " border-l border-border/40 pl-4" : ""}`}>
              {enchantAlts.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-wider uppercase">
                    Enchants
                  </p>
                  <DistList entries={enchantAlts} />
                </div>
              )}
              {gemEntries && gemEntries.length > 0 && (
                <div className={enchantAlts.length > 0 ? "border-t border-border/30 pt-2" : ""}>
                  <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-wider uppercase">
                    Gems
                  </p>
                  <DistList entries={gemEntries} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
