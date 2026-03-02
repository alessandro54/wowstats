"use client"

import Image from "next/image"
import { useActiveColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes"
import type { MetaItem, MetaEnchant, MetaGem } from "@/lib/api"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SLOT_ORDER, QUALITY_COLORS, formatSlot, formatSocketType, isReshiiWraps } from "./equipment-config"
import { ClickableTooltip, DistributionTooltip, type DistEntry } from "./equipment-tooltip"

type ItemGroup = { slot: string; entries: MetaItem[] }
type EnchantGroup = { slot: string; entries: MetaEnchant[] }
type GemGroup = { socketType: string; entries: MetaGem[] }

type Props = {
  classSlug: WowClassSlug
  itemGroups: ItemGroup[]
  enchantGroups: EnchantGroup[]
  gemGroups: GemGroup[]
  fiberGems: MetaGem[]
}

export function Equipment({ classSlug, itemGroups, enchantGroups, gemGroups, fiberGems }: Props) {
  const activeColor = useActiveColor(classSlug)
  const pillStyle = { "--pill-color": activeColor } as React.CSSProperties

  const sortedItems = [...itemGroups].sort((a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot))
  const enchantBySlot = new Map(enchantGroups.map((g) => [g.slot, g]))

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Items */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Items</h2>
          {sortedItems.length === 0
            ? <p className="text-sm text-muted-foreground">No item data available for this bracket.</p>
            : (
              <div className="rounded-lg border bg-transparent divide-y divide-border/40 backdrop-blur-lg">
                {sortedItems.map(({ slot, entries }) => {
                  const primary = entries[0]
                  if (!primary) return null

                  const distribution = entries.slice(0, 6).map((e): DistEntry => ({
                    name: e.item.name,
                    icon_url: e.item.icon_url,
                    quality: e.item.quality,
                    pct: e.usage_pct,
                  }))
                  const hasFiber = fiberGems.length > 0 && isReshiiWraps(primary.item.name)
                  const enchantGroup = enchantBySlot.get(slot)
                  const primaryEnchant = enchantGroup?.entries[0]
                  const enchantDist = enchantGroup?.entries.slice(0, 6).map((e): DistEntry => ({
                    name: e.enchantment.name,
                    pct: e.usage_pct,
                  }))

                  return (
                    <ClickableTooltip
                      key={slot}
                      side="bottom"
                      align="end"
                      content={
                        <DistributionTooltip
                          entries={distribution}
                          enchantEntries={enchantDist}
                          activeColor={activeColor}
                          craftingStats={primary.crafted ? primary.top_crafting_stats : undefined}
                          fiberGems={hasFiber ? fiberGems : undefined}
                        />
                      }
                    >
                      <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-default first:rounded-t-lg last:rounded-b-lg">
                        <span className="text-[11px] font-medium text-muted-foreground w-16 shrink-0">{formatSlot(slot)}</span>
                        {primary.item.icon_url && (
                          <span className="icon-vignette rounded shrink-0">
                            <Image src={primary.item.icon_url} alt={primary.item.name} width={24} height={24} className="rounded block" />
                          </span>
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium truncate" style={{ color: QUALITY_COLORS[primary.item.quality] }}>
                            {primary.item.name}
                          </span>
                          {primaryEnchant && (
                            <span className="text-[11px] text-lime-600 dark:text-[#00ff00] truncate leading-tight">
                              {primaryEnchant.enchantment.name}
                            </span>
                          )}
                        </div>
                        {primary.crafted && (
                          <span className="class-pill text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0" style={pillStyle}>
                            CRAFTED
                          </span>
                        )}
                        {hasFiber && (
                          <span className="class-pill text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0" style={pillStyle}>
                            {fiberGems[0].item.name}
                          </span>
                        )}
                        <span className="text-sm font-bold font-mono tabular-nums shrink-0" style={{ color: activeColor }}>
                          {primary.usage_pct.toFixed(1)}%
                        </span>
                      </div>
                    </ClickableTooltip>
                  )
                })}
              </div>
            )
          }
        </section>

        {/* Gems */}
        {gemGroups.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Gems</h2>
            <div className="rounded-lg border bg-card divide-y divide-border/40">
              {gemGroups.map(({ socketType, entries }) => {
                const primary = entries[0]
                if (!primary) return null
                const distribution = entries.slice(0, 6).map((e): DistEntry => ({
                  name: e.item.name,
                  icon_url: e.item.icon_url,
                  quality: e.item.quality,
                  pct: e.usage_pct,
                }))
                return (
                  <ClickableTooltip
                    key={socketType}
                    side="bottom"
                    align="end"
                    content={<DistributionTooltip entries={distribution} activeColor={activeColor} />}
                  >
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors cursor-default first:rounded-t-lg last:rounded-b-lg">
                      <span className="text-[11px] font-medium text-muted-foreground w-16 shrink-0">{formatSocketType(socketType)}</span>
                      {primary.item.icon_url && (
                        <span className="icon-vignette rounded shrink-0">

                          <Image src={primary.item.icon_url} alt={primary.item.name} width={24} height={24} className="rounded block" />
                        </span>
                      )}
                      <span className="text-sm font-medium truncate flex-1" style={{ color: QUALITY_COLORS[primary.item.quality] }}>
                        {primary.item.name}
                      </span>
                      <span className="text-sm font-bold font-mono tabular-nums shrink-0" style={{ color: activeColor }}>
                        {primary.usage_pct.toFixed(1)}%
                      </span>
                    </div>
                  </ClickableTooltip>
                )
              })}
            </div>
          </section>
        )}

      </div>
    </TooltipProvider>
  )
}
