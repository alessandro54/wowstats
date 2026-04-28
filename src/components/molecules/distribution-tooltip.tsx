"use client"

import type { Trend } from "@/lib/api"
import { DistList } from "@/components/atoms/dist-list"
import { getStatMeta } from "@/config/equipment-config"

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
  activeColor: _activeColor,
  craftingStats,
}: {
  entries: DistEntry[]
  enchantEntries?: DistEntry[]
  gemEntries?: DistEntry[]
  activeColor: string
  craftingStats?: string[]
}) {
  const alternatives = entries.slice(1)
  const enchantAlternatives = enchantEntries?.slice(1)
  const hasLeftCol = alternatives.length > 0 || (craftingStats && craftingStats.length > 0)
  const hasRightCol =
    (enchantAlternatives && enchantAlternatives.length > 0) || (gemEntries && gemEntries.length > 0)

  return (
    <div className={hasLeftCol && hasRightCol ? "flex gap-6" : "min-w-56 space-y-3"}>
      {hasLeftCol && (
        <div className="min-w-52 space-y-3">
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
      {hasRightCol && (
        <div className={`min-w-48 space-y-3${hasLeftCol ? " border-border/50 border-l pl-6" : ""}`}>
          {enchantAlternatives && enchantAlternatives.length > 0 && (
            <>
              <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                Enchant alternatives
              </p>
              <DistList entries={enchantAlternatives} />
            </>
          )}
          {gemEntries && gemEntries.length > 0 && (
            <div
              className={
                enchantAlternatives && enchantAlternatives.length > 0
                  ? "border-border/50 border-t pt-2"
                  : ""
              }
            >
              <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
                Gems
              </p>
              <DistList entries={gemEntries} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
