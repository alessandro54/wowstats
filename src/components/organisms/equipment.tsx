"use client"

import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import type { MetaEnchant, MetaGem, MetaItem } from "@/lib/api"
import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import { DistributionTooltip } from "@/components/molecules/distribution-tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  formatSlot,
  formatSocketType,
  isReshiiWraps,
  QUALITY_COLORS,
} from "@/config/equipment-config"
import { useActiveColor } from "@/hooks/use-active-color"

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

interface ItemGroup { slot: string, entries: MetaItem[] }
interface EnchantGroup { slot: string, entries: MetaEnchant[] }
interface GemGroup { socketType: string, entries: MetaGem[] }

interface Props {
  classSlug: WowClassSlug
  itemGroups: ItemGroup[]
  enchantGroups: EnchantGroup[]
  gemGroups: GemGroup[]
  fiberGems: MetaGem[]
}

export function Equipment({ classSlug, itemGroups, enchantGroups, gemGroups, fiberGems }: Props) {
  const activeColor = useActiveColor(classSlug)
  const pillStyle = { "--pill-color": activeColor } as React.CSSProperties

  const itemBySlot = new Map(itemGroups.map(g => [g.slot, g]))
  const enchantBySlot = new Map(enchantGroups.map(g => [g.slot, g]))

  function renderItemCard(slot: string) {
    const group = itemBySlot.get(slot)
    if (!group)
      return <div key={slot} />

    const primary = group.entries[0]
    if (!primary)
      return <div key={slot} />

    const distribution = group.entries.slice(0, 6).map(
      (e): DistEntry => ({
        name: e.item.name,
        icon_url: e.item.icon_url,
        quality: e.item.quality,
        pct: e.usage_pct,
      }),
    )
    const hasFiber = fiberGems.length > 0 && isReshiiWraps(primary.item.name)
    const enchantGroup = enchantBySlot.get(slot)
    const primaryEnchant = enchantGroup?.entries[0]
    const enchantDist = enchantGroup?.entries.slice(0, 6).map(
      (e): DistEntry => ({
        name: e.enchantment.name,
        pct: e.usage_pct,
      }),
    )

    return (
      <ClickableTooltip
        key={slot}
        side="bottom"
        align="end"
        content={(
          <DistributionTooltip
            entries={distribution}
            enchantEntries={enchantDist}
            activeColor={activeColor}
            craftingStats={primary.crafted ? primary.top_crafting_stats : undefined}
            fiberGems={hasFiber ? fiberGems : undefined}
          />
        )}
      >
        <div className="bg-card/40 hover:bg-muted/20 flex h-full cursor-default gap-3 rounded-lg border p-3 backdrop-blur-sm transition-colors">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-muted-foreground text-[10px] leading-none font-semibold tracking-wider uppercase">
              {formatSlot(slot)}
            </span>
            <div className="flex min-w-0 items-center gap-2">
              {primary.item.icon_url && (
                <span className="icon-vignette shrink-0 rounded">
                  <Image
                    src={primary.item.icon_url}
                    alt={primary.item.name}
                    width={28}
                    height={28}
                    className="block rounded"
                  />
                </span>
              )}
              <div className="min-w-0">
                <p
                  className="truncate text-sm leading-tight font-medium"
                  style={{ color: QUALITY_COLORS[primary.item.quality] }}
                >
                  {primary.item.name}
                </p>
                {primaryEnchant && (
                  <p className="truncate text-[10px] leading-tight text-lime-600 dark:text-[#00ff00]">
                    {primaryEnchant.enchantment.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end justify-center gap-1">
            <span
              className="font-mono text-sm font-bold tabular-nums"
              style={{ color: activeColor }}
            >
              {primary.usage_pct.toFixed(1)}
              %
            </span>
            {primary.crafted && (
              <span
                className="class-pill rounded px-1 py-0.5 text-[9px] font-semibold"
                style={pillStyle}
              >
                CRAFTED
              </span>
            )}
            {hasFiber && (
              <span
                className="class-pill hidden rounded px-1 py-0.5 text-[9px] font-semibold sm:inline"
                style={pillStyle}
              >
                {fiberGems[0].item.name}
              </span>
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
            ? (
                <p className="text-muted-foreground text-sm">
                  No item data available for this bracket.
                </p>
              )
            : (
                <div className="space-y-2">
                  {LAYOUT_ROWS.map(([slotA, slotB]) => {
                    const hasA = itemBySlot.has(slotA)
                    const hasB = itemBySlot.has(slotB)
                    if (!hasA && !hasB)
                      return null
                    return (
                      <div key={`${slotA}-${slotB}`} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {renderItemCard(slotA)}
                        {renderItemCard(slotB)}
                      </div>
                    )
                  })}
                </div>
              )}
        </section>

        {/* Gems */}
        {gemGroups.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Gems</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {gemGroups.map(({ socketType, entries }) => {
                const primary = entries[0]
                if (!primary)
                  return null
                const distribution = entries.slice(0, 6).map(
                  (e): DistEntry => ({
                    name: e.item.name,
                    icon_url: e.item.icon_url,
                    quality: e.item.quality,
                    pct: e.usage_pct,
                  }),
                )
                return (
                  <ClickableTooltip
                    key={socketType}
                    side="bottom"
                    align="end"
                    content={
                      <DistributionTooltip entries={distribution} activeColor={activeColor} />
                    }
                  >
                    <div className="bg-card/40 hover:bg-muted/20 flex cursor-default gap-3 rounded-lg border p-3 backdrop-blur-sm transition-colors">
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <span className="text-muted-foreground text-[10px] leading-none font-semibold tracking-wider uppercase">
                          {formatSocketType(socketType)}
                        </span>
                        <div className="flex min-w-0 items-center gap-2">
                          {primary.item.icon_url && (
                            <span className="icon-vignette shrink-0 rounded">
                              <Image
                                src={primary.item.icon_url}
                                alt={primary.item.name}
                                width={28}
                                height={28}
                                className="block rounded"
                              />
                            </span>
                          )}
                          <p
                            className="truncate text-sm leading-tight font-medium"
                            style={{ color: QUALITY_COLORS[primary.item.quality] }}
                          >
                            {primary.item.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center justify-end">
                        <span
                          className="font-mono text-sm font-bold tabular-nums"
                          style={{ color: activeColor }}
                        >
                          {primary.usage_pct.toFixed(1)}
                          %
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
