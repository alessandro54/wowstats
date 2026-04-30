import type { BracketData } from "@/app/pvp/[classSlug]/[specSlug]/page"
import type { Tier } from "@/config/app-config"
import { BRACKET_COLORS } from "@/config/wow/brackets-config"
import { cn } from "@/lib/utils"

const TIER_TEXT_COLORS: Record<Tier, string> = {
  "S+": "text-red-600 dark:text-red-400",
  S: "text-purple-600 dark:text-purple-400",
  A: "text-amber-600 dark:text-amber-400",
  B: "text-blue-600 dark:text-blue-400",
  C: "text-emerald-600 dark:text-emerald-400",
  D: "text-muted-foreground",
}

interface Props {
  brackets: BracketData[]
}

type MetricRow = {
  label: string
  values: (string | null)[]
  bestIdx: number
  worstIdx: number
  cellClasses?: (string | undefined)[]
}

export function SpecComparisonTable({ brackets }: Props) {
  const withData = brackets.filter((b) => b.wrHat !== null)
  if (withData.length < 2) return null

  function bestWorst(nums: (number | null)[], higherIsBetter: boolean) {
    let best = -1
    let worst = -1
    let bestVal = higherIsBetter ? -Infinity : Infinity
    let worstVal = higherIsBetter ? Infinity : -Infinity

    nums.forEach((n, i) => {
      if (n === null) return
      if (higherIsBetter ? n > bestVal : n < bestVal) {
        bestVal = n
        best = i
      }
      if (higherIsBetter ? n < worstVal : n > worstVal) {
        worstVal = n
        worst = i
      }
    })

    return {
      best,
      worst,
    }
  }

  const metrics: MetricRow[] = []

  // Tier — each cell gets its own tier color
  metrics.push({
    label: "Tier",
    values: withData.map((b) => b.tier ?? "—"),
    bestIdx: -1,
    worstIdx: -1,
    cellClasses: withData.map((b) =>
      b.tier ? `font-bold ${TIER_TEXT_COLORS[b.tier]}` : "text-muted-foreground",
    ),
  })

  // Win Rate
  const wrNums = withData.map((b) => b.wrHat)
  const wrBW = bestWorst(wrNums, true)
  metrics.push({
    label: "Win Rate",
    values: withData.map((b) => (b.wrHat !== null ? `${(b.wrHat * 100).toFixed(1)}%` : "—")),
    bestIdx: wrBW.best,
    worstIdx: wrBW.worst,
  })

  // Presence
  const presNums = withData.map((b) => b.presence)
  const presBW = bestWorst(presNums, true)
  metrics.push({
    label: "Presence",
    values: withData.map((b) => (b.presence !== null ? `${(b.presence * 100).toFixed(1)}%` : "—")),
    bestIdx: presBW.best,
    worstIdx: presBW.worst,
  })

  // Avg Rating
  const ratingNums = withData.map((b) => b.meanRating)
  const ratingBW = bestWorst(ratingNums, true)
  metrics.push({
    label: "Avg. Rating",
    values: withData.map((b) =>
      b.meanRating !== null ? Math.round(b.meanRating).toLocaleString() : "—",
    ),
    bestIdx: ratingBW.best,
    worstIdx: ratingBW.worst,
  })

  // Players
  const playerNums = withData.map((b) => b.playerCount)
  const playerBW = bestWorst(playerNums, true)
  metrics.push({
    label: "Players",
    values: withData.map((b) => b.playerCount.toLocaleString()),
    bestIdx: playerBW.best,
    worstIdx: playerBW.worst,
  })

  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/30">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/30 bg-black/20">
            <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Metric
            </th>
            {withData.map((b) => (
              <th key={b.slug} className="px-5 py-3 text-center">
                <span className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{
                      background: BRACKET_COLORS[b.slug],
                    }}
                  />
                  {b.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((row) => (
            <tr
              key={row.label}
              className="border-b border-white/[0.03] transition-colors hover:bg-white/[0.02]"
            >
              <td className="px-5 py-3 text-xs font-medium">{row.label}</td>
              {row.values.map((val, i) => (
                <td
                  key={withData[i].slug}
                  className={cn(
                    "px-5 py-3 text-center text-xs",
                    row.cellClasses
                      ? row.cellClasses[i]
                      : cn(
                          i === row.bestIdx && "font-bold text-emerald-400",
                          i === row.worstIdx && row.values.length > 1 && "text-red-400",
                          i !== row.bestIdx && i !== row.worstIdx && "text-muted-foreground",
                        ),
                  )}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
