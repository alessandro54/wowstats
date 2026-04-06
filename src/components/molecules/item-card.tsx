import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import type { DistEntry } from "@/components/molecules/distribution-tooltip"
import { DistributionTooltip } from "@/components/molecules/distribution-tooltip"
import { formatSlot, isReshiiWraps, QUALITY_COLORS } from "@/config/equipment-config"
import type { MetaEnchant, MetaGem, MetaItem } from "@/lib/api"

export interface EnchantGroup {
  slot: string
  entries: MetaEnchant[]
}

interface ItemCardProps {
  slot: string
  entries?: MetaItem[]
  enchants: Map<string, EnchantGroup>
  fiberGems: MetaGem[]
  activeColor: string
  pillStyle: React.CSSProperties
}

export function ItemCard({
  slot,
  entries,
  enchants,
  fiberGems,
  activeColor,
  pillStyle,
}: ItemCardProps) {
  if (!entries) return <div key={slot} />

  const primary = entries[0]
  if (!primary) return <div key={slot} />

  const distribution = entries.slice(0, 6).map(
    (e): DistEntry => ({
      name: e.item.name,
      icon_url: e.item.icon_url,
      quality: e.item.quality,
      pct: e.usage_pct,
    }),
  )
  const hasFiber = fiberGems.length > 0 && isReshiiWraps(primary.item.name)
  const enchantGroup = enchants.get(slot)
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
                style={{
                  color: QUALITY_COLORS[primary.item.quality.toUpperCase()],
                }}
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
            style={{
              color: activeColor,
            }}
          >
            {primary.usage_pct.toFixed(1)}%
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
