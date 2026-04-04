import type { BracketData } from "@/app/pvp/[classSlug]/[specSlug]/page"

const BRACKET_COLORS: Record<string, string> = {
  "2v2": "#7ec8e3",
  "3v3": "#c8a84b",
  shuffle: "#7b68ee",
  blitz: "#ff6b35",
}

interface Props {
  brackets: BracketData[]
}

export function SpecDistributionChart({ brackets }: Props) {
  const withData = brackets.filter((b) => b.playerCount > 0)
  if (withData.length === 0) return null

  const total = withData.reduce((s, b) => s + b.playerCount, 0)
  const totalLabel =
    total >= 1000 ? `${(total / 1000).toFixed(total >= 10000 ? 0 : 1)}k` : total.toString()

  // SVG donut math
  const radius = 46
  const circumference = 2 * Math.PI * radius
  let offset = 0

  const segments = withData.map((b) => {
    const pct = b.playerCount / total
    const dash = circumference * pct
    const seg = {
      bracket: b,
      pct,
      dash,
      offset,
      color: BRACKET_COLORS[b.slug] ?? "#888",
    }
    offset -= dash
    return seg
  })

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-6">
      <p className="text-sm font-semibold">Player Distribution</p>
      <p className="mb-6 text-[11px] text-muted-foreground">Share of players per bracket</p>

      <div className="flex items-center justify-center gap-8">
        {/* Donut */}
        <div className="relative size-[120px] shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="14"
            />
            {segments.map((seg) => (
              <circle
                key={seg.bracket.slug}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={seg.offset}
                opacity="0.8"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{totalLabel}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Players
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5">
          {segments.map((seg) => (
            <div key={seg.bracket.slug} className="flex items-center gap-2">
              <div
                className="size-2 shrink-0 rounded-full"
                style={{
                  background: seg.color,
                }}
              />
              <span className="flex-1 text-xs text-muted-foreground">{seg.bracket.label}</span>
              <span
                className="text-xs font-semibold"
                style={{
                  color: seg.color,
                }}
              >
                {(seg.pct * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
