"use client"

import type { MetaGem } from "@/lib/api"
import { getStatMeta } from "@/config/equipment-config"
import { DistList } from "@/components/atoms/dist-list"

export interface DistEntry { name: string, icon_url?: string | null, quality?: string, pct: number }

export function DistributionTooltip({
  entries,
  enchantEntries,
  activeColor: _activeColor,
  craftingStats,
  fiberGems,
}: {
  entries: DistEntry[]
  enchantEntries?: DistEntry[]
  activeColor: string
  craftingStats?: string[]
  fiberGems?: MetaGem[]
}) {
  const alternatives = entries.slice(1)
  const enchantAlternatives = enchantEntries?.slice(1)

  return (
    <div className={enchantEntries ? "flex gap-5" : "min-w-48 space-y-2.5"}>
      <div className="min-w-44 space-y-2.5">
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
                  style={{ color: color ?? "inherit" }}
                >
                  {label}
                </span>
              )
            })}
          </div>
        )}
        {fiberGems && fiberGems.length > 0 && (
          <div className="border-border/50 space-y-1 border-t pt-2">
            <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
              Fiber socket
            </p>
            {fiberGems.map(gem => (
              <div key={gem.id} className="flex items-center justify-between gap-3">
                <span className="text-xs">{gem.item.name}</span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  {gem.usage_pct.toFixed(1)}
                  %
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {enchantEntries && enchantAlternatives && enchantAlternatives.length > 0 && (
        <div className="border-border/50 min-w-40 space-y-2.5 border-l pl-5">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            Enchant alternatives
          </p>
          <DistList entries={enchantAlternatives} />
        </div>
      )}
    </div>
  )
}
