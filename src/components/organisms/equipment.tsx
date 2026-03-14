"use client"

import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import type { EnchantGroup } from "@/components/molecules/item-card"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import type { MetaGem, MetaItem } from "@/lib/api"
import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import { DistributionTooltip } from "@/components/molecules/distribution-tooltip"
import { ItemCard } from "@/components/molecules/item-card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { formatSocketType, QUALITY_COLORS } from "@/config/equipment-config"
import { useActiveColor } from "@/hooks/use-active-color"

const LAYOUT_ROWS: [
  string,
  string,
][] = [
  [
    "HEAD",
    "NECK",
  ],
  [
    "SHOULDER",
    "BACK",
  ],
  [
    "CHEST",
    "WRIST",
  ],
  [
    "HANDS",
    "WAIST",
  ],
  [
    "LEGS",
    "FEET",
  ],
  [
    "MAIN_HAND",
    "OFF_HAND",
  ],
  [
    "FINGER_1",
    "FINGER_2",
  ],
  [
    "TRINKET_1",
    "TRINKET_2",
  ],
]

interface ItemGroup {
  slot: string
  entries: MetaItem[]
}
interface GemGroup {
  socketType: string
  entries: MetaGem[]
}

interface EquipmentProps {
  classSlug: WowClassSlug
  itemGroups: ItemGroup[]
  enchantGroups: EnchantGroup[]
  gemGroups: GemGroup[]
  fiberGems: MetaGem[]
}

export function Equipment({
  classSlug,
  itemGroups,
  enchantGroups,
  gemGroups,
  fiberGems,
}: EquipmentProps) {
  const activeColor = useActiveColor(classSlug)
  const pillStyle = {
    "--pill-color": activeColor,
  } as React.CSSProperties

  const itemBySlot = new Map(
    itemGroups.map((g) => [
      g.slot,
      g,
    ]),
  )
  const enchantBySlot = new Map(
    enchantGroups.map((g) => [
      g.slot,
      g,
    ]),
  )

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Items */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Items</h2>
          {itemBySlot.size === 0 ? (
            <p className="text-muted-foreground text-sm">
              No item data available for this bracket.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 min-[1800px]:grid-cols-4">
              {LAYOUT_ROWS.flat().map((slot) => {
                if (!itemBySlot.has(slot)) return null
                return (
                  <ItemCard
                    key={slot}
                    slot={slot}
                    entries={itemBySlot.get(slot)?.entries}
                    enchants={enchantBySlot}
                    fiberGems={fiberGems}
                    activeColor={activeColor}
                    pillStyle={pillStyle}
                  />
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
                if (!primary) return null
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
                            style={{
                              color: QUALITY_COLORS[primary.item.quality?.toUpperCase()],
                            }}
                          >
                            {primary.item.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center justify-end">
                        <span
                          className="font-mono text-sm font-bold tabular-nums"
                          style={{
                            color: activeColor,
                          }}
                        >
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
