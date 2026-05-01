"use client"

import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import { DistributionTooltip } from "@/components/molecules/distribution-tooltip"
import { formatSlot, gemStatColors, getStatMeta, QUALITY_COLORS } from "@/config/equipment-config"
import type { MetaEnchant, MetaGem, MetaItem } from "@/lib/api"

function borderColor(isBis: boolean, isCrafted: boolean, activeColor: string): string {
  if (isCrafted) return "var(--color-tier-crafted-border)"
  if (isBis) return activeColor
  return "rgb(100 100 100 / 0.4)"
}

interface Props {
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
}

export function SlotCard({
  slot,
  entries,
  enchantBySlot,
  gemBySlot,
  activeColor,
  isBis,
  side,
}: Props) {
  if (!entries || entries.length === 0) return <div className="h-[72px]" />

  const borderClass =
    side === "left"
      ? "border-t-2 md:border-t-0 md:border-l-2"
      : "border-t-2 md:border-t-0 md:border-r-2"

  const primary = entries[0]
  const isCrafted = primary.crafted
  const border = borderColor(isBis, isCrafted, activeColor)

  const enchantGroup = enchantBySlot.get(slot)
  const primaryEnchant = enchantGroup?.entries[0]
  const gemGroup = gemBySlot.get(slot)

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
            <span className="flex items-center gap-1 rounded bg-[var(--color-tier-crafted-bg-light)] px-1.5 py-0.5 text-[8px] font-bold uppercase text-[var(--color-tier-crafted-fg-light)] shadow-sm dark:bg-[var(--color-tier-crafted-bg-dark)] dark:text-[var(--color-tier-crafted-fg-dark)]">
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
