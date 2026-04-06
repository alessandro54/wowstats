"use client"

import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import { DistributionTooltip } from "@/components/molecules/distribution-tooltip"
import type { EnchantGroup } from "@/components/molecules/item-card"
import { ItemCard } from "@/components/molecules/item-card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { formatSocketType, QUALITY_COLORS } from "@/config/equipment-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useActiveColor } from "@/hooks/use-active-color"
import type { MetaGem, MetaItem } from "@/lib/api"

/** Paper-doll slot layout: left column, right column */
const LEFT_SLOTS = [
  "HEAD",
  "SHOULDER",
  "CHEST",
  "HANDS",
  "LEGS",
  "MAIN_HAND",
  "FINGER_1",
  "TRINKET_1",
]
const RIGHT_SLOTS = [
  "NECK",
  "BACK",
  "WRIST",
  "WAIST",
  "FEET",
  "OFF_HAND",
  "FINGER_2",
  "TRINKET_2",
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

  const renderSlot = (slot: string) => {
    if (!itemBySlot.has(slot)) return <div key={slot} className="h-[72px]" />
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
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Gear section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Gear
              </h2>
              <div className="ml-2 h-px w-16 bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{
                    background: activeColor,
                  }}
                />
                BiS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-muted-foreground/40" />
                Alt
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-amber-500" />
                Crafted
              </span>
            </div>
          </div>

          {itemBySlot.size === 0 ? (
            <p className="text-sm text-muted-foreground">
              No item data available for this bracket.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_1fr] lg:gap-x-6">
              {/* Left column */}
              <div className="flex flex-col gap-2">{LEFT_SLOTS.map(renderSlot)}</div>
              {/* Right column */}
              <div className="flex flex-col gap-2">{RIGHT_SLOTS.map(renderSlot)}</div>
            </div>
          )}
        </section>

        {/* Gems section */}
        {gemGroups.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Gems
              </h2>
              <div className="ml-2 h-px w-16 bg-gradient-to-r from-border to-transparent" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="flex cursor-default gap-3 rounded-lg border border-border/50 bg-card/30 p-3 backdrop-blur-sm transition-colors hover:bg-muted/20">
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                            className="truncate text-sm font-medium leading-tight"
                            style={{
                              color: QUALITY_COLORS[primary.item.quality?.toUpperCase()],
                            }}
                          >
                            {primary.item.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center">
                        <span
                          className="font-mono text-sm font-bold tabular-nums"
                          style={{
                            color: activeColor,
                          }}
                        >
                          {primary.usage_pct.toFixed(0)}%
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
