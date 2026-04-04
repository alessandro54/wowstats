"use client"

import Image from "next/image"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import type { Tier } from "@/config/app-config"
import { TIER_COLORS } from "@/config/app-config"
import { titleizeSlug } from "@/lib/utils"

interface Props {
  entries: MetaStatsEntry[]
}

function shannonEntropy(values: number[]): number {
  const total = values.reduce((s, v) => s + v, 0)
  if (total === 0) return 0
  return -values.reduce((s, v) => {
    if (v === 0) return s
    const p = v / total
    return s + p * Math.log2(p)
  }, 0)
}

function MetaDiversityMeter({ entries }: { entries: MetaStatsEntry[] }) {
  const presences = entries.map((e) => e.presence)
  const entropy = shannonEntropy(presences)
  const maxEntropy = Math.log2(entries.length || 1)
  const diversity = maxEntropy > 0 ? entropy / maxEntropy : 0
  const viable = entries.filter(
    (e) => e.tier === "S+" || e.tier === "S" || e.tier === "A" || e.tier === "B",
  ).length

  const label =
    diversity >= 0.85
      ? "Healthy"
      : diversity >= 0.7
        ? "Balanced"
        : diversity >= 0.5
          ? "Narrow"
          : "Solved"
  const color =
    diversity >= 0.85
      ? "text-emerald-400"
      : diversity >= 0.7
        ? "text-blue-400"
        : diversity >= 0.5
          ? "text-amber-400"
          : "text-red-400"
  const barColor =
    diversity >= 0.85
      ? "bg-emerald-400"
      : diversity >= 0.7
        ? "bg-blue-400"
        : diversity >= 0.5
          ? "bg-amber-400"
          : "bg-red-400"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Meta Health
        </span>
        <span className={`text-xs font-bold ${color}`}>{label}</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all ${barColor}`}
          style={{
            width: `${diversity * 100}%`,
          }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>
          {viable}/{entries.length} specs viable
        </span>
        <span>{(diversity * 100).toFixed(0)}% diversity</span>
      </div>
    </div>
  )
}

function ClassWheel({ entries }: { entries: MetaStatsEntry[] }) {
  // Group presence by class
  const classPresence = new Map<
    string,
    {
      total: number
      color: string
      iconUrl?: string
    }
  >()
  for (const e of entries) {
    const existing = classPresence.get(e.className) ?? {
      total: 0,
      color: e.color,
    }
    existing.total += e.presence
    if (!existing.iconUrl && e.iconUrl) existing.iconUrl = e.iconUrl
    classPresence.set(e.className, existing)
  }

  const sorted = [
    ...classPresence.entries(),
  ].sort((a, b) => b[1].total - a[1].total)
  const total = sorted.reduce((s, [, v]) => s + v.total, 0) || 1

  const cx = 60
  const cy = 60
  const outerR = 52
  const innerR = 32

  let currentAngle = -90 // start from top

  const slices = sorted.map(([className, { total: presence, color }]) => {
    const angle = (presence / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const largeArc = angle > 180 ? 1 : 0

    const x1o = cx + outerR * Math.cos(startRad)
    const y1o = cy + outerR * Math.sin(startRad)
    const x2o = cx + outerR * Math.cos(endRad)
    const y2o = cy + outerR * Math.sin(endRad)
    const x1i = cx + innerR * Math.cos(startRad)
    const y1i = cy + innerR * Math.sin(startRad)
    const x2i = cx + innerR * Math.cos(endRad)
    const y2i = cy + innerR * Math.sin(endRad)

    const d = [
      `M ${x1o} ${y1o}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2o} ${y2o}`,
      `L ${x2i} ${y2i}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1i} ${y1i}`,
      "Z",
    ].join(" ")

    return {
      className,
      color,
      d,
      pct: ((presence / total) * 100).toFixed(1),
    }
  })

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 120 120" width={120} height={120} className="shrink-0">
        {slices.map((s) => (
          <path
            key={s.className}
            d={s.d}
            fill={s.color}
            opacity={0.8}
            className="transition-opacity hover:opacity-100"
          />
        ))}
        <text
          x={cx}
          y={cy - 3}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={8}
          className="fill-foreground font-semibold"
          style={{
            pointerEvents: "none",
          }}
        >
          Class
        </text>
        <text
          x={cx}
          y={cy + 7}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={7}
          className="fill-muted-foreground"
          style={{
            pointerEvents: "none",
          }}
        >
          Spread
        </text>
      </svg>
      <div className="flex flex-col gap-0.5 overflow-hidden">
        {sorted.slice(0, 6).map(([className, { color, total: presence }]) => (
          <div key={className} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />
            <span className="truncate text-[10px] text-muted-foreground">
              {titleizeSlug(className)}
            </span>
            <span className="ml-auto font-mono text-[10px] tabular-nums text-muted-foreground">
              {((presence / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopPerformers({ entries }: { entries: MetaStatsEntry[] }) {
  const top3 = entries.slice(0, 3)
  const medals = [
    "🥇",
    "🥈",
    "🥉",
  ]

  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        Top Performers
      </span>
      <div className="space-y-1.5">
        {top3.map((entry, i) => (
          <div key={entry.key} className="flex items-center gap-2">
            <span className="text-sm">{medals[i]}</span>
            {entry.iconUrl && (
              <Image
                src={entry.iconUrl}
                alt={entry.specName}
                width={20}
                height={20}
                className="rounded-sm"
                style={{
                  border: `1px solid ${entry.color}80`,
                }}
                unoptimized
              />
            )}
            <div className="min-w-0 flex-1">
              <span
                className="text-xs font-medium"
                style={{
                  color: entry.color,
                }}
              >
                {titleizeSlug(entry.specName)}
              </span>
              <span className="ml-1 text-[10px] text-muted-foreground">
                {titleizeSlug(entry.className)}
              </span>
            </div>
            <span className={`rounded px-1 py-0.5 text-[9px] font-bold ${TIER_COLORS[entry.tier]}`}>
              {entry.tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetaHighlights({ entries }: { entries: MetaStatsEntry[] }) {
  const highestWr = [
    ...entries,
  ].sort((a, b) => b.wrHat - a.wrHat)[0]
  const mostPresence = [
    ...entries,
  ].sort((a, b) => b.presence - a.presence)[0]
  const widestCi = [
    ...entries,
  ].sort((a, b) => b.ratingCiHigh - b.ratingCiLow - (a.ratingCiHigh - a.ratingCiLow))[0]

  const highlights = [
    {
      label: "Highest Win Rate",
      spec: highestWr,
      value: `${(highestWr?.wrHat * 100).toFixed(1)}%`,
    },
    {
      label: "Most Popular",
      spec: mostPresence,
      value: `${(mostPresence?.presence * 100).toFixed(1)}%`,
    },
    {
      label: "Most Volatile",
      spec: widestCi,
      value: `±${((widestCi?.ratingCiHigh - widestCi?.ratingCiLow) / 2).toFixed(0)}`,
    },
  ]

  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Highlights</span>
      <div className="space-y-1.5">
        {highlights.map(
          (h) =>
            h.spec && (
              <div key={h.label} className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">{h.label}</span>
                <div className="flex items-center gap-1.5">
                  {h.spec.iconUrl && (
                    <Image
                      src={h.spec.iconUrl}
                      alt={h.spec.specName}
                      width={14}
                      height={14}
                      className="rounded-sm"
                      unoptimized
                    />
                  )}
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: h.spec.color,
                    }}
                  >
                    {titleizeSlug(h.spec.specName)}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-foreground">
                    {h.value}
                  </span>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  )
}

export function MetaInsightsPanel({ entries }: Props) {
  if (entries.length === 0) return null

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Meta Insights
      </h3>
      <MetaDiversityMeter entries={entries} />
      <ClassWheel entries={entries} />
      <TopPerformers entries={entries} />
      <MetaHighlights entries={entries} />
    </div>
  )
}
