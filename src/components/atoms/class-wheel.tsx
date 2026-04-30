"use client"

import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import { titleizeSlug } from "@/lib/utils"

interface Props {
  entries: MetaStatsEntry[]
}

export function ClassWheel({ entries }: Props) {
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

    const r4 = (n: number) => Math.round(n * 1e4) / 1e4
    const x1o = r4(cx + outerR * Math.cos(startRad))
    const y1o = r4(cy + outerR * Math.sin(startRad))
    const x2o = r4(cx + outerR * Math.cos(endRad))
    const y2o = r4(cy + outerR * Math.sin(endRad))
    const x1i = r4(cx + innerR * Math.cos(startRad))
    const y1i = r4(cy + innerR * Math.sin(startRad))
    const x2i = r4(cx + innerR * Math.cos(endRad))
    const y2i = r4(cy + innerR * Math.sin(endRad))

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
