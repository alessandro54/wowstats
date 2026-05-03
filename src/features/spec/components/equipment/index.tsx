"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { PVP_GEM_BLIZZARD_IDS } from "@/config/equipment-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useActiveColor } from "@/hooks/use-active-color"
import type { MetaEnchant, MetaGem, MetaItem, MetaStats } from "@/lib/api"
import { CenterCard } from "./center-card"
import { SlotCard } from "./slot-card"

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
  slot: string
  entries: MetaGem[]
}
interface EnchantGroup {
  slot: string
  entries: MetaEnchant[]
}

interface EquipmentProps {
  classSlug: WowClassSlug
  itemGroups: ItemGroup[]
  enchantGroups: EnchantGroup[]
  gemGroups: GemGroup[]
  specIconUrl?: string
  specName?: string
  className?: string
  bracketLabel?: string
  statsData?: MetaStats
}

function findTopGem(gemGroups: GemGroup[]): MetaGem | undefined {
  const totals = new Map<
    number,
    {
      gem: MetaGem
      count: number
    }
  >()
  for (const group of gemGroups) {
    for (const gem of group.entries) {
      if (PVP_GEM_BLIZZARD_IDS.has(gem.item.blizzard_id)) continue
      const existing = totals.get(gem.item.blizzard_id)
      if (existing) existing.count += gem.usage_count
      else
        totals.set(gem.item.blizzard_id, {
          gem,
          count: gem.usage_count,
        })
    }
  }
  let best:
    | {
        gem: MetaGem
        count: number
      }
    | undefined
  for (const entry of totals.values()) {
    if (!best || entry.count > best.count) best = entry
  }
  return best?.gem
}

/**
 * Spec meta gear analysis. Renders paper-doll layout with usage distributions
 * per slot. BIS items are highlighted via 70% threshold of max-usage item.
 *
 * Center card shows spec icon, ilvl, PvP gem (Heliotrope family), top non-PvP
 * gem, and stat bars. SlotCard uses ClickableTooltip with DistributionTooltip
 * to show alternative items, enchants, and gems on click.
 *
 * Trinket de-duplication: TRINKET_2 filters out items matching TRINKET_1's
 * blizzard_id (unique-equipped rule).
 */
export function Equipment({
  classSlug,
  itemGroups,
  enchantGroups,
  gemGroups,
  specIconUrl,
  specName,
  className,
  bracketLabel,
  statsData,
}: EquipmentProps) {
  const activeColor = useActiveColor(classSlug)

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

  const pvpGem = gemGroups
    .flatMap((g) => g.entries)
    .find((e) => PVP_GEM_BLIZZARD_IDS.has(e.item.blizzard_id))

  const gemBySlot = new Map(
    gemGroups.map((g) => [
      g.slot,
      {
        ...g,
        entries: [
          ...g.entries,
        ]
          .filter((e) => !PVP_GEM_BLIZZARD_IDS.has(e.item.blizzard_id))
          .sort((a, b) => b.usage_pct - a.usage_pct),
      },
    ]),
  )

  const topGem = findTopGem(gemGroups)

  const allPrimaries = itemGroups.map((g) => g.entries[0]).filter(Boolean)
  const maxUsage = allPrimaries.length > 0 ? Math.max(...allPrimaries.map((e) => e.usage_pct)) : 0
  const bisThreshold = maxUsage * 0.7

  const trinket1Id = itemBySlot.get("TRINKET_1")?.entries[0]?.item.blizzard_id

  const renderSlot = (slot: string, side: "left" | "right") => {
    const group = itemBySlot.get(slot)
    let entries = group?.entries

    if (slot === "TRINKET_2" && trinket1Id != null) {
      entries = entries?.filter((e) => e.item.blizzard_id !== trinket1Id)
    }

    const primary = entries?.[0]
    const isBis = primary ? primary.usage_pct >= bisThreshold : false

    return (
      <SlotCard
        key={slot}
        slot={slot}
        entries={entries}
        enchantBySlot={enchantBySlot}
        gemBySlot={gemBySlot}
        activeColor={activeColor}
        isBis={isBis}
        side={side}
      />
    )
  }

  if (itemBySlot.size === 0) {
    return <p className="text-sm text-muted-foreground">No item data available for this bracket.</p>
  }

  return (
    <TooltipProvider>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_auto_1fr]">
          <div className="flex justify-center md:col-span-2 xl:col-start-2 xl:col-span-1 xl:row-start-1">
            <CenterCard
              classSlug={classSlug}
              activeColor={activeColor}
              specIconUrl={specIconUrl}
              specName={specName}
              className={className}
              bracketLabel={bracketLabel}
              pvpGem={pvpGem}
              topGem={topGem}
              statsData={statsData}
            />
          </div>

          <div className="flex flex-col gap-2 xl:col-start-1 xl:row-start-1">
            {LEFT_SLOTS.map((slot) => renderSlot(slot, "left"))}
          </div>

          <div className="flex flex-col gap-2 xl:col-start-3 xl:row-start-1">
            {RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
