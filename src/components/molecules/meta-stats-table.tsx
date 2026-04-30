"use client"

import Image from "next/image"
import { TransitionLink as Link } from "@/components/atoms/transition-link"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Tier } from "@/config/app-config"
import { TIER_COLORS } from "@/config/app-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useSortableTable } from "@/hooks/use-sortable-table"
import { titleizeSlug } from "@/lib/utils"

export interface MetaStatsEntry {
  key: string
  specName: string
  className: string
  role: string
  score: number
  normPct: number
  tier: Tier
  thetaHat: number
  ratingCiLow: number
  ratingCiHigh: number
  meanRating: number
  wrHat: number
  presence: number
  bK: number
  color: string
  iconUrl?: string
  specUrl: string
  rankChange?: number | null
}

type SortKey = "rank" | "score" | "rating" | "winrate" | "presence" | "confidence"

const SORT_COMPARATORS: Record<SortKey, (a: MetaStatsEntry, b: MetaStatsEntry) => number> = {
  rank: (a, b) => b.score - a.score,
  score: (a, b) => b.score - a.score,
  rating: (a, b) => b.thetaHat - a.thetaHat,
  winrate: (a, b) => b.wrHat - a.wrHat,
  presence: (a, b) => b.presence - a.presence,
  confidence: (a, b) => b.bK - a.bK,
}

function RankTrend({ change }: { change: number | null | undefined }) {
  if (change == null) return null
  if (change > 0)
    return <span className="ml-0.5 text-[9px] font-bold text-emerald-400">▲{change}</span>
  if (change < 0)
    return <span className="ml-0.5 text-[9px] font-bold text-red-400">▼{Math.abs(change)}</span>
  return <span className="ml-0.5 text-[9px] text-muted-foreground">—</span>
}

function wrColor(wr: number): string {
  if (wr >= 0.53) return "text-emerald-400"
  if (wr >= 0.48) return "text-foreground"
  return "text-red-400"
}

function confidenceLevel(bK: number): {
  dots: number
  label: string
} {
  if (bK >= 0.85)
    return {
      dots: 4,
      label: "Very High",
    }
  if (bK >= 0.65)
    return {
      dots: 3,
      label: "High",
    }
  if (bK >= 0.4)
    return {
      dots: 2,
      label: "Medium",
    }
  return {
    dots: 1,
    label: "Low",
  }
}

function scoreHeatBg(tier: Tier): string {
  return (
    {
      "S+": "bg-red-500/15",
      S: "bg-purple-500/15",
      A: "bg-amber-500/10",
      B: "bg-blue-500/10",
      C: "bg-emerald-500/10",
      D: "bg-muted/20",
    }[tier] || "bg-muted/20"
  )
}

export function MetaStatsTable({
  entries,
  defaultClassSlug,
}: {
  entries: MetaStatsEntry[]
  defaultClassSlug?: WowClassSlug
}) {
  const setHoverSlug = useSetHoverSlug()
  const { sorted, handleSort, sortIndicator } = useSortableTable<MetaStatsEntry, SortKey>(
    entries,
    SORT_COMPARATORS,
    "rank",
  )

  const allCiLow = Math.min(...entries.map((e) => e.ratingCiLow))
  const allCiHigh = Math.max(...entries.map((e) => e.ratingCiHigh))
  const ciRange = allCiHigh - allCiLow || 1

  return (
    <Table className="min-w-[720px] table-fixed">
      <colgroup>
        <col className="w-10" />
        <col className="w-44" />
        <col className="w-12" />
        <col className="w-16" />
        <col className="w-40" />
        <col className="w-16" />
        <col className="w-20" />
        <col className="w-24" />
      </colgroup>
      <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm">
        <TableRow className="text-[11px] uppercase tracking-wide">
          <TableHead
            className="cursor-pointer select-none text-center"
            onClick={() => handleSort("rank")}
          >
            #{sortIndicator("rank")}
          </TableHead>
          <TableHead>Spec</TableHead>
          <TableHead className="text-center">Tier</TableHead>
          <TableHead
            className="cursor-pointer select-none text-center"
            onClick={() => handleSort("score")}
          >
            Score{sortIndicator("score")}
          </TableHead>
          <TableHead className="cursor-pointer select-none" onClick={() => handleSort("rating")}>
            Rating{sortIndicator("rating")}
          </TableHead>
          <TableHead
            className="cursor-pointer select-none text-right"
            onClick={() => handleSort("winrate")}
          >
            Win%{sortIndicator("winrate")}
          </TableHead>
          <TableHead
            className="cursor-pointer select-none text-right"
            onClick={() => handleSort("presence")}
          >
            Presence{sortIndicator("presence")}
          </TableHead>
          <TableHead
            className="cursor-pointer select-none text-center"
            onClick={() => handleSort("confidence")}
          >
            Confidence{sortIndicator("confidence")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((entry, index) => {
          const { dots, label } = confidenceLevel(entry.bK)
          const ciLeftPct = ((entry.ratingCiLow - allCiLow) / ciRange) * 100
          const ciWidthPct = ((entry.ratingCiHigh - entry.ratingCiLow) / ciRange) * 100
          const thetaPct = ((entry.thetaHat - allCiLow) / ciRange) * 100
          const presenceBarPct = Math.min(entry.presence * 100 * 5, 100)

          return (
            <TableRow
              key={entry.key}
              onMouseEnter={() => setHoverSlug(entry.className as WowClassSlug)}
              onMouseLeave={() => setHoverSlug(defaultClassSlug ?? null)}
            >
              <TableCell className="text-center font-mono text-xs">
                <span
                  className="inline-flex items-baseline gap-0"
                  style={{
                    color: entry.color,
                  }}
                >
                  {index + 1}
                  <RankTrend change={entry.rankChange} />
                </span>
              </TableCell>

              <TableCell className="truncate">
                <Link
                  href={entry.specUrl}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {entry.iconUrl ? (
                    <Image
                      src={entry.iconUrl}
                      alt={entry.specName}
                      width={20}
                      height={20}
                      className="shrink-0 rounded-sm"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="h-5 w-5 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: entry.color,
                        opacity: 0.7,
                      }}
                    />
                  )}
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: entry.color,
                    }}
                  >
                    {titleizeSlug(entry.specName)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {titleizeSlug(entry.className)}
                  </span>
                </Link>
              </TableCell>

              <TableCell className="text-center">
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${TIER_COLORS[entry.tier]}`}
                >
                  {entry.tier}
                </span>
              </TableCell>

              <TableCell className={`text-center ${scoreHeatBg(entry.tier)}`}>
                <span className="font-mono text-sm font-semibold tabular-nums">
                  {(entry.score * 100).toFixed(1)}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="w-10 shrink-0 font-mono text-sm font-semibold tabular-nums">
                    {entry.thetaHat.toFixed(0)}
                  </span>
                  <div
                    className="relative h-2 flex-1 rounded-full bg-muted"
                    title={`${entry.ratingCiLow.toFixed(0)} – ${entry.ratingCiHigh.toFixed(0)}`}
                  >
                    <div
                      className="absolute inset-y-0 rounded-full opacity-40"
                      style={{
                        left: `${ciLeftPct}%`,
                        width: `${ciWidthPct}%`,
                        backgroundColor: entry.color,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background"
                      style={{
                        left: `${thetaPct}%`,
                        backgroundColor: entry.color,
                      }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                    {entry.ratingCiLow.toFixed(0)}-{entry.ratingCiHigh.toFixed(0)}
                  </span>
                </div>
              </TableCell>

              <TableCell
                className={`text-right font-mono text-sm tabular-nums ${wrColor(entry.wrHat)}`}
              >
                {(entry.wrHat * 100).toFixed(1)}%
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  <div className="relative h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${presenceBarPct}%`,
                        backgroundColor: entry.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {(entry.presence * 100).toFixed(1)}%
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center" title={`${label} (b=${entry.bK.toFixed(2)})`}>
                <div className="flex items-center justify-center gap-0.5">
                  {[
                    1,
                    2,
                    3,
                    4,
                  ].map((d) => (
                    <div
                      key={d}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: d <= dots ? entry.color : undefined,
                        opacity: d <= dots ? 0.9 : 0.2,
                      }}
                    />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
