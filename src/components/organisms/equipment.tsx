"use client"

import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import { DistributionTooltip } from "@/components/molecules/distribution-tooltip"
import type { EnchantGroup } from "@/components/molecules/item-card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { formatSlot, QUALITY_COLORS } from "@/config/equipment-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useActiveColor } from "@/hooks/use-active-color"
import type { MetaEnchant, MetaGem, MetaItem } from "@/lib/api"

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
  /** Optional spec info for the center card */
  specIconUrl?: string
  specName?: string
  className?: string
  bracketLabel?: string
}

function borderColor(isBis: boolean, isCrafted: boolean, activeColor: string): string {
  if (isCrafted) return "rgb(245 158 11)" // amber-500
  if (isBis) return activeColor
  return "rgb(100 100 100 / 0.4)" // muted
}

function SlotCard({
  slot,
  entries,
  enchantBySlot,
  fiberGems,
  activeColor,
  isBis,
}: {
  slot: string
  entries?: MetaItem[]
  enchantBySlot: Map<
    string,
    {
      slot: string
      entries: MetaEnchant[]
    }
  >
  fiberGems: MetaGem[]
  activeColor: string
  isBis: boolean
}) {
  if (!entries || entries.length === 0) return <div className="h-[76px]" />

  const primary = entries[0]
  const isCrafted = primary.crafted
  const border = borderColor(isBis, isCrafted, activeColor)

  const enchantGroup = enchantBySlot.get(slot)
  const primaryEnchant = enchantGroup?.entries[0]

  const distribution = entries.slice(0, 6).map(
    (e): DistEntry => ({
      name: e.item.name,
      icon_url: e.item.icon_url,
      quality: e.item.quality,
      pct: e.usage_pct,
    }),
  )
  const enchantDist = enchantGroup?.entries.slice(0, 6).map(
    (e): DistEntry => ({
      name: e.enchantment.name,
      pct: e.usage_pct,
    }),
  )

  return (
    <ClickableTooltip
      side="bottom"
      align="end"
      content={
        <DistributionTooltip
          entries={distribution}
          enchantEntries={enchantDist}
          activeColor={activeColor}
          craftingStats={primary.crafted ? primary.top_crafting_stats : undefined}
        />
      }
    >
      <div
        className="flex cursor-default items-center gap-3 rounded-lg border-l-2 bg-card/30 px-3 py-2.5 backdrop-blur-sm transition-colors hover:bg-muted/20"
        style={{
          borderLeftColor: border,
        }}
      >
        {primary.item.icon_url && (
          <span className="icon-vignette shrink-0 rounded">
            <Image
              src={primary.item.icon_url}
              alt={primary.item.name}
              width={36}
              height={36}
              className="block rounded"
            />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            {formatSlot(slot)}
          </span>
          <p
            className="truncate text-sm font-medium leading-tight"
            style={{
              color: QUALITY_COLORS[primary.item.quality?.toUpperCase()],
            }}
          >
            {primary.item.name}
          </p>
          {primaryEnchant ? (
            <p className="truncate text-[10px] leading-tight text-lime-600 dark:text-[#00ff00]">
              {primaryEnchant.enchantment.name}
            </p>
          ) : (
            <p className="text-[10px] leading-tight text-muted-foreground/30">—</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-0.5">
          {isCrafted && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[8px] font-bold uppercase text-amber-400">
              Crafted
            </span>
          )}
          <span
            className="font-mono text-sm font-bold tabular-nums"
            style={{
              color: isBis ? activeColor : "rgb(160 160 160)",
            }}
          >
            {primary.usage_pct.toFixed(1)}%
          </span>
        </div>
      </div>
    </ClickableTooltip>
  )
}

export function Equipment({
  classSlug,
  itemGroups,
  enchantGroups,
  gemGroups: _gemGroups,
  fiberGems,
  specIconUrl,
  specName,
  className: wowClassName,
  bracketLabel,
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

  // Find the highest usage item across all slots to determine BIS threshold
  const allPrimaries = itemGroups.map((g) => g.entries[0]).filter(Boolean)
  const maxUsage = allPrimaries.length > 0 ? Math.max(...allPrimaries.map((e) => e.usage_pct)) : 0
  const bisThreshold = maxUsage * 0.7 // Top 70% usage = BIS

  const renderSlot = (slot: string, idx: number) => {
    const group = itemBySlot.get(slot)
    const primary = group?.entries[0]
    const isBis = primary ? primary.usage_pct >= bisThreshold : false

    return (
      <SlotCard
        key={slot}
        slot={slot}
        entries={group?.entries}
        enchantBySlot={enchantBySlot}
        fiberGems={fiberGems}
        activeColor={activeColor}
        isBis={isBis}
      />
    )
  }

  if (itemBySlot.size === 0) {
    return <p className="text-sm text-muted-foreground">No item data available for this bracket.</p>
  }

  return (
    <TooltipProvider>
      <section>
        {/* Header */}
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

        {/* Paper-doll 3-column layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr]">
          {/* Left column */}
          <div className="flex flex-col gap-2">
            {LEFT_SLOTS.map((slot, i) => renderSlot(slot, i))}
          </div>

          {/* Center card */}
          <div className="hidden lg:flex">
            <div className="flex w-56 flex-col items-center justify-center gap-4 rounded-lg border border-border/30 bg-card/20 p-6">
              {specIconUrl && (
                <Image
                  src={specIconUrl}
                  alt={specName ?? ""}
                  width={80}
                  height={80}
                  className="rounded-xl opacity-80"
                />
              )}
              {specName && wowClassName && (
                <div className="text-center">
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: activeColor,
                    }}
                  >
                    {specName}
                  </p>
                  <p className="text-sm font-bold text-foreground">{wowClassName}</p>
                  {bracketLabel && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{bracketLabel} · PvP</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-2">
            {RIGHT_SLOTS.map((slot, i) => renderSlot(slot, i))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
