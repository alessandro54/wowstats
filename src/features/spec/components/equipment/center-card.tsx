"use client"

import Image from "next/image"
import { ClickableTooltip } from "@/components/atoms/clickable-tooltip"
import { gemStatColors, getStatMeta } from "@/config/equipment-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import type { MetaGem, MetaStats } from "@/lib/api"

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

interface Props {
  classSlug: WowClassSlug
  activeColor: string
  specIconUrl?: string
  specName?: string
  className?: string
  bracketLabel?: string
  pvpGem?: MetaGem
  topGem?: MetaGem
  statsData?: MetaStats
}

export function CenterCard({
  classSlug,
  activeColor,
  specIconUrl,
  specName,
  className,
  bracketLabel,
  pvpGem,
  topGem,
  statsData,
}: Props) {
  return (
    <div
      className="w-full rounded-xl border border-border/40 px-6 py-8 backdrop-blur-sm xl:w-72"
      style={{
        background: `linear-gradient(-45deg, color-mix(in oklch, var(--color-class-${classSlug}) 8%, transparent), transparent 60%)`,
      }}
    >
      <div className="grid grid-cols-3 items-center gap-4 xl:flex xl:flex-col xl:items-center xl:gap-5">
        {/* Col 1 — icon + spec name + avg ilvl */}
        <div className="flex flex-col items-center gap-3">
          {specIconUrl && (
            <div
              className="rounded-full border-2 p-1"
              style={{
                borderColor: activeColor,
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
          {specName && className && (
            <div className="text-center leading-tight">
              <p
                className="text-sm font-bold uppercase tracking-wider"
                style={{
                  color: activeColor,
                }}
              >
                {specName}
              </p>
              <p className="text-sm font-bold text-foreground">{className}</p>
              {bracketLabel && (
                <p className="mt-0.5 text-[10px] text-muted-foreground">{bracketLabel} · PvP</p>
              )}
            </div>
          )}
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
        </div>

        {/* Col 2 — PvP gem + Top gem */}
        <div className="flex flex-col gap-4 xl:w-full">
          {pvpGem && (
            <div className="xl:border-border/30 xl:border-t xl:pt-4">
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
                        <p className="text-sm font-medium text-foreground">{pvpGem.item.name}</p>
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
                  <p className="truncate text-xs font-medium text-foreground">{pvpGem.item.name}</p>
                </div>
              </ClickableTooltip>
            </div>
          )}

          {topGem && (
            <div className="xl:border-border/30 xl:border-t xl:pt-4">
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
                  <p className="truncate text-xs font-medium text-foreground">{topGem.item.name}</p>
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
        </div>

        {/* Col 3 — stat bars */}
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
  )
}
