"use client"

import Image from "next/image"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"

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
const STAT_COLORS: Record<string, string> = {
  VERSATILITY: "var(--color-stat-versatility)",
  MASTERY_RATING: "var(--color-stat-mastery)",
  HASTE_RATING: "var(--color-stat-haste)",
  CRIT_RATING: "var(--color-stat-crit)",
}

interface Props {
  classSlug: WowClassSlug
  characterName: string
  className: string
  specName?: string
  avatarUrl?: string | null
  specIconUrl?: string
  avgIlvl: number | null
  statPcts?: Record<string, number>
  activeColor: string
}

export function CenterCard({
  classSlug,
  characterName,
  className,
  specName,
  avatarUrl,
  specIconUrl,
  avgIlvl,
  statPcts,
  activeColor,
}: Props) {
  const portraitUrl = avatarUrl ?? specIconUrl

  const statVals = STAT_ORDER.map((k) => statPcts?.[k] ?? 0)
  const maxStat = Math.max(...statVals, 1)
  const hasStats = statVals.some((v) => v > 0)

  return (
    <div
      className="w-full rounded-xl border border-border/40 px-6 py-8 backdrop-blur-sm xl:w-72"
      style={{
        background: `linear-gradient(-45deg, color-mix(in oklch, var(--color-class-${classSlug}) 8%, transparent), transparent 60%)`,
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {portraitUrl && (
          <div
            className="rounded-full border-2 p-1"
            style={{
              borderColor: activeColor,
              background: `${activeColor}18`,
            }}
          >
            <Image
              src={portraitUrl}
              alt={characterName}
              width={72}
              height={72}
              className="size-16 rounded-full object-cover"
            />
          </div>
        )}

        <div className="text-center leading-tight">
          <p
            className="text-sm font-bold uppercase tracking-wider"
            style={{
              color: activeColor,
            }}
          >
            {characterName}
          </p>
          <p className="text-sm font-bold text-foreground">{className}</p>
          {specName && (
            <p className="mt-0.5 text-[10px] text-muted-foreground capitalize">{specName}</p>
          )}
        </div>

        {avgIlvl != null && (
          <div className="flex flex-col items-center leading-none">
            <span
              className="text-2xl font-bold tabular-nums"
              style={{
                color: activeColor,
              }}
            >
              {avgIlvl}
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Ilvl
            </span>
          </div>
        )}

        {hasStats && (
          <div className="w-full space-y-2 border-t border-border/30 pt-4">
            {STAT_ORDER.map((key, i) => {
              const val = statVals[i]
              if (val === 0) return null
              const color = STAT_COLORS[key]
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-7 shrink-0 text-[10px] text-muted-foreground">
                    {STAT_LABELS[key]}
                  </span>
                  <div className="h-1.5 flex-1 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(val / maxStat) * 100}%`,
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
            })}
          </div>
        )}
      </div>
    </div>
  )
}
