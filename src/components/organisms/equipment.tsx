"use client"

import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import { DistributionTooltip } from "@/components/molecules/distribution-tooltip"
import type { EnchantGroup } from "@/components/molecules/item-card"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  formatSlot,
  gemStatColors,
  getStatMeta,
  PVP_GEM_BLIZZARD_IDS,
  QUALITY_COLORS,
} from "@/config/equipment-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useActiveColor } from "@/hooks/use-active-color"
import type { MetaEnchant, MetaGem, MetaItem, MetaStats } from "@/lib/api"

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
  slot: string
  entries: MetaGem[]
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

function borderColor(isBis: boolean, isCrafted: boolean, activeColor: string): string {
  if (isCrafted) return "rgb(245 158 11)" // amber-500
  if (isBis) return activeColor
  return "rgb(100 100 100 / 0.4)" // muted
}

function SlotCard({
  slot,
  entries,
  enchantBySlot,
  gemBySlot,
  activeColor,
  isBis,
  side,
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
  gemBySlot: Map<
    string,
    {
      slot: string
      entries: MetaGem[]
    }
  >
  activeColor: string
  isBis: boolean
  side: "left" | "right"
}) {
  if (!entries || entries.length === 0) return <div className="h-[72px]" />

  const borderClass =
    side === "left"
      ? "border-t-2 lg:border-t-0 lg:border-l-2"
      : "border-t-2 lg:border-t-0 lg:border-r-2"

  const primary = entries[0]
  const isCrafted = primary.crafted
  const border = borderColor(isBis, isCrafted, activeColor)

  const enchantGroup = enchantBySlot.get(slot)
  const primaryEnchant = enchantGroup?.entries[0]
  const gemGroup = gemBySlot.get(slot)
  const _primaryGem = gemGroup?.entries[0]

  const distribution = entries.slice(0, 6).map(
    (e): DistEntry => ({
      name: e.item.name,
      icon_url: e.item.icon_url,
      quality: e.item.quality,
      pct: e.usage_pct,
      trend: e.trend,
    }),
  )
  const enchantDist = enchantGroup?.entries.slice(0, 4).map(
    (e): DistEntry => ({
      name: e.enchantment.name,
      pct: e.usage_pct,
      trend: e.trend,
    }),
  )
  const gemDist = gemGroup?.entries.slice(0, 3).map(
    (e): DistEntry => ({
      name: e.item.name,
      icon_url: e.item.icon_url,
      quality: e.item.quality,
      pct: e.usage_pct,
      statDots: gemStatColors(e.item.name),
      trend: e.trend,
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
          gemEntries={gemDist}
          activeColor={activeColor}
          craftingStats={primary.crafted ? primary.top_crafting_stats : undefined}
        />
      }
    >
      <div
        className={`flex cursor-default items-center gap-3 rounded-lg bg-card/30 px-3 py-2.5 backdrop-blur-sm transition-colors hover:bg-muted/20 ${borderClass}`}
        style={{
          borderColor: border,
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
            <span className="flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[8px] font-bold uppercase text-amber-400">
              Crafted
              {primary.top_crafting_stats.slice(0, 2).map((stat) => {
                const { color } = getStatMeta(stat)
                return color ? (
                  <span
                    key={stat}
                    className="inline-block size-1.5 rounded-full"
                    style={{
                      background: color,
                    }}
                  />
                ) : null
              })}
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

const STAT_ORDER = [
  "VERSATILITY",
  "MASTERY_RATING",
  "HASTE_RATING",
  "CRIT_RATING",
] as const
const STAT_LABELS: Record<string, string> = {
  VERSATILITY: "Vers",
  MASTERY_RATING: "Mast",
  HASTE_RATING: "Hast",
  CRIT_RATING: "Crit",
}

export function Equipment({
  classSlug,
  itemGroups,
  enchantGroups,
  gemGroups,
  specIconUrl,
  specName,
  className: wowClassName,
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

  // PvP gem — hardcoded blizzard IDs for TWW S2 Heliotrope family
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

  // Most popular non-PvP gem across all slots by total usage_count
  const topGem = (() => {
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
  })()

  // Find the highest usage item across all slots to determine BIS threshold
  const allPrimaries = itemGroups.map((g) => g.entries[0]).filter(Boolean)
  const maxUsage = allPrimaries.length > 0 ? Math.max(...allPrimaries.map((e) => e.usage_pct)) : 0
  const bisThreshold = maxUsage * 0.7 // Top 70% usage = BIS

  const trinket1Id = itemBySlot.get("TRINKET_1")?.entries[0]?.item.blizzard_id

  const renderSlot = (slot: string, side: "left" | "right") => {
    const group = itemBySlot.get(slot)
    let entries = group?.entries

    // Trinkets are unique-equipped — skip if TRINKET_2 top item matches TRINKET_1
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
            {LEFT_SLOTS.map((slot) => renderSlot(slot, "left"))}
          </div>

          {/* Center card */}
          <div className="hidden lg:flex">
            <div
              className="flex w-56 flex-col items-center gap-5 rounded-xl border border-border/40 px-6 py-8 backdrop-blur-sm"
              style={{
                background: `linear-gradient(-45deg, color-mix(in oklch, var(--color-class-${classSlug}) 8%, transparent), transparent 60%)`,
              }}
            >
              {/* Spec icon with class-color ring */}
              {specIconUrl && (
                <div
                  className="rounded-full p-1"
                  style={{
                    boxShadow: `0 0 0 3px ${activeColor}40`,
                    background: `${activeColor}18`,
                  }}
                >
                  <Image
                    src={specIconUrl}
                    alt={specName ?? ""}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
              )}

              {/* Spec / class / bracket */}
              {specName && wowClassName && (
                <div className="text-center leading-tight">
                  <p
                    className="text-sm font-bold uppercase tracking-wider"
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

              {/* Avg ilvl */}
              {statsData?.avg_ilvl != null && (
                <div className="flex flex-col items-center leading-none">
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{
                      color: activeColor,
                    }}
                  >
                    {statsData.avg_ilvl}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Avg ilvl
                  </span>
                </div>
              )}

              {/* PvP gem — always required */}
              {pvpGem && (
                <div className="border-border/30 w-full border-t pt-4">
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    PvP gem
                  </p>
                  <ClickableTooltip
                    side="left"
                    align="center"
                    content={
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {pvpGem.item.icon_url && (
                            <Image
                              src={pvpGem.item.icon_url}
                              alt={pvpGem.item.name}
                              width={28}
                              height={28}
                              className="shrink-0 rounded"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {pvpGem.item.name}
                            </p>
                            <div className="mt-0.5 flex gap-0.5">
                              {gemStatColors(pvpGem.item.name).map((color, i) => (
                                <span
                                  key={i}
                                  className="inline-block size-2 rounded-full"
                                  style={{
                                    background: color,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Required in all PvP content.
                        </p>
                      </div>
                    }
                  >
                    <div
                      className="flex cursor-default items-center gap-2 rounded-md border px-2 py-1.5"
                      style={{
                        borderColor: activeColor,
                      }}
                    >
                      {pvpGem.item.icon_url && (
                        <Image
                          src={pvpGem.item.icon_url}
                          alt={pvpGem.item.name}
                          width={24}
                          height={24}
                          className="shrink-0 rounded"
                        />
                      )}
                      <p className="truncate text-xs font-medium text-foreground">
                        {pvpGem.item.name}
                      </p>
                    </div>
                  </ClickableTooltip>
                </div>
              )}

              {/* Top gem */}
              {topGem && (
                <div className="border-border/30 w-full border-t pt-4">
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Top gem
                  </p>
                  <div className="flex items-center gap-2">
                    {topGem.item.icon_url && (
                      <Image
                        src={topGem.item.icon_url}
                        alt={topGem.item.name}
                        width={24}
                        height={24}
                        className="shrink-0 rounded"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {topGem.item.name}
                      </p>
                      <div className="mt-0.5 flex gap-0.5">
                        {gemStatColors(topGem.item.name).map((color, i) => (
                          <span
                            key={i}
                            className="inline-block size-2 rounded-full"
                            style={{
                              background: color,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stat bars */}
              {statsData && (
                <div className="w-full space-y-2">
                  {(() => {
                    const vals = STAT_ORDER.map((k) => statsData.stats[k] ?? 0)
                    const maxVal = Math.max(...vals, 1)
                    return STAT_ORDER.map((key, i) => {
                      const val = vals[i]
                      if (val === 0) return null
                      const { color } = getStatMeta(key)
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="w-7 shrink-0 text-[10px] text-muted-foreground">
                            {STAT_LABELS[key]}
                          </span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(val / maxVal) * 100}%`,
                                background: color ?? activeColor,
                              }}
                            />
                          </div>
                          <span
                            className="w-8 shrink-0 text-right font-mono text-[10px]"
                            style={{
                              color: color ?? activeColor,
                            }}
                          >
                            {val}
                          </span>
                        </div>
                      )
                    })
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-2">
            {RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  )
}
