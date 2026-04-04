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

export function SpecWinRateChart({ brackets }: Props) {
  const sorted = [
    ...brackets,
  ]
    .filter((b) => b.wrHat !== null)
    .sort((a, b) => (b.wrHat ?? 0) - (a.wrHat ?? 0))

  if (sorted.length === 0) return null

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-6">
      <p className="text-sm font-semibold">Win Rate by Bracket</p>
      <p className="mb-6 text-[11px] text-muted-foreground">50% baseline · All ratings</p>

      <div className="space-y-4">
        {sorted.map((b) => {
          const wr = b.wrHat ?? 0
          const pct = wr * 100
          const color = BRACKET_COLORS[b.slug] ?? "var(--foreground)"

          return (
            <div key={b.slug} className="grid grid-cols-[60px_1fr_52px] items-center gap-4">
              <span
                className="text-xs font-semibold"
                style={{
                  color,
                }}
              >
                {b.label}
              </span>
              <div className="relative h-2 rounded-full bg-white/[0.04]">
                {/* 50% baseline */}
                <div className="absolute inset-y-[-4px] left-1/2 w-px bg-white/[0.08]" />
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, color-mix(in srgb, ${color} 40%, transparent), ${color})`,
                  }}
                />
              </div>
              <span
                className="text-right text-xs font-bold"
                style={{
                  color: pct > 52 ? "var(--color-stat-versatility)" : undefined,
                }}
              >
                {pct.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
