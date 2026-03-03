"use client"

import Image from "next/image"
import { useActiveColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes"
import type { MetaItem, MetaEnchant, MetaGem } from "@/lib/api"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QUALITY_COLORS, formatSlot, formatSocketType, isReshiiWraps } from "@/lib/equipment-config"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import { DistributionTooltip, type DistEntry } from "@/components/molecules/distribution-tooltip"

// Explicit row pairs — each tuple is always rendered on the same grid row.
// If one slot has no data an empty placeholder keeps the other in its column.
const LAYOUT_ROWS: [string, string][] = [
  ["HEAD", "NECK"],
  ["SHOULDER", "BACK"],
  ["CHEST", "WRIST"],
  ["HANDS", "WAIST"],
  ["LEGS", "FEET"],
  ["MAIN_HAND", "OFF_HAND"],
  ["FINGER_1", "FINGER_2"],
  ["TRINKET_1", "TRINKET_2"],
]

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

  const itemBySlot = new Map(itemGroups.map((g) => [g.slot, g]))
  const enchantBySlot = new Map(enchantGroups.map((g) => [g.slot, g]))

  function renderItemCard(slot: string) {
    const group = itemBySlot.get(slot)
    if (!group) return <div key={slot} />

    const primary = group.entries[0]
    if (!primary) return <div key={slot} />

    const distribution = group.entries.slice(0, 6).map((e): DistEntry => ({
      name: e.item.name, icon_url: e.item.icon_url, quality: e.item.quality, pct: e.usage_pct,
    }))
    const hasFiber = fiberGems.length > 0 && isReshiiWraps(primary.item.name)
    const enchantGroup = enchantBySlot.get(slot)
    const primaryEnchant = enchantGroup?.entries[0]
    const enchantDist = enchantGroup?.entries.slice(0, 6).map((e): DistEntry => ({
      name: e.enchantment.name, pct: e.usage_pct,
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
        <div className="rounded-lg border bg-card/40 backdrop-blur-sm p-3 hover:bg-muted/20 transition-colors cursor-default flex gap-3 h-full">
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">{formatSlot(slot)}</span>
            <div className="flex items-center gap-2 min-w-0">
              {primary.item.icon_url && (
                <span className="icon-vignette rounded shrink-0">
                  <Image src={primary.item.icon_url} alt={primary.item.name} width={28} height={28} className="rounded block" />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate leading-tight" style={{ color: QUALITY_COLORS[primary.item.quality] }}>
                  {primary.item.name}
                </p>
                {primaryEnchant && (
                  <p className="text-[10px] text-lime-600 dark:text-[#00ff00] truncate leading-tight">
                    {primaryEnchant.enchantment.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-1 shrink-0">
            <span className="text-sm font-bold font-mono tabular-nums" style={{ color: activeColor }}>
              {primary.usage_pct.toFixed(1)}%
            </span>
            {primary.crafted && (
              <span className="class-pill text-[9px] font-semibold px-1 py-0.5 rounded" style={pillStyle}>CRAFTED</span>
            )}
            {hasFiber && (
              <span className="class-pill text-[9px] font-semibold px-1 py-0.5 rounded hidden sm:inline" style={pillStyle}>{fiberGems[0].item.name}</span>
            )}
          </div>
        </div>
      </ClickableTooltip>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">

        {/* Items */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Items</h2>
          {itemBySlot.size === 0
            ? <p className="text-sm text-muted-foreground">No item data available for this bracket.</p>
            : (
              <div className="space-y-2">
                {LAYOUT_ROWS.map(([slotA, slotB]) => {
                  const hasA = itemBySlot.has(slotA)
                  const hasB = itemBySlot.has(slotB)
                  if (!hasA && !hasB) return null
                  return (
                    <div key={`${slotA}-${slotB}`} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {renderItemCard(slotA)}
                      {renderItemCard(slotB)}
                    </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {gemGroups.map(({ socketType, entries }) => {
                const primary = entries[0]
                if (!primary) return null
                const distribution = entries.slice(0, 6).map((e): DistEntry => ({
                  name: e.item.name, icon_url: e.item.icon_url, quality: e.item.quality, pct: e.usage_pct,
                }))
                return (
                  <ClickableTooltip
                    key={socketType}
                    side="bottom"
                    align="end"
                    content={<DistributionTooltip entries={distribution} activeColor={activeColor} />}
                  >
                    <div className="rounded-lg border bg-card/40 backdrop-blur-sm p-3 hover:bg-muted/20 transition-colors cursor-default flex gap-3">
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">{formatSocketType(socketType)}</span>
                        <div className="flex items-center gap-2 min-w-0">
                          {primary.item.icon_url && (
                            <span className="icon-vignette rounded shrink-0">
                              <Image src={primary.item.icon_url} alt={primary.item.name} width={28} height={28} className="rounded block" />
                            </span>
                          )}
                          <p className="text-sm font-medium truncate leading-tight" style={{ color: QUALITY_COLORS[primary.item.quality] }}>
                            {primary.item.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end shrink-0">
                        <span className="text-sm font-bold font-mono tabular-nums" style={{ color: activeColor }}>
                          {primary.usage_pct.toFixed(1)}%
                        </span>
                      </div>
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
