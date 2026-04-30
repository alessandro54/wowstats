"use client"

import Image from "next/image"
import { TransitionLink as Link } from "@/components/atoms/transition-link"
import { useState } from "react"
import type { MetaStatsEntry } from "@/features/meta/components/meta-stats-table"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import type { Tier } from "@/config/app-config"
import { TIER_COLORS } from "@/config/app-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { titleizeSlug } from "@/lib/utils"

interface BracketRank {
  bracket: string
  label: string
  tier: Tier
  score: number
  rank: number
}

export interface SpecBracketData {
  specId: string
  ranks: BracketRank[]
}

interface Props {
  entries: MetaStatsEntry[]
  bracketComparison: Map<string, SpecBracketData>
  currentBracket: string
  defaultClassSlug?: WowClassSlug
}

const TIER_ORDER: Tier[] = [
  "S+",
  "S",
  "A",
  "B",
  "C",
  "D",
]

const TIER_LABELS: Record<Tier, string> = {
  "S+": "Broken",
  S: "Optimal",
  A: "Strong",
  B: "Viable",
  C: "Niche",
  D: "Weak",
}

function ScoreBar({ score, color, maxScore }: { score: number; color: string; maxScore: number }) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  return (
    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          backgroundColor: color,
          opacity: 0.8,
        }}
      />
    </div>
  )
}

export function MetaTierList({
  entries,
  bracketComparison,
  currentBracket,
  defaultClassSlug,
}: Props) {
  const setHoverSlug = useSetHoverSlug()
  const [hoveredSpec, setHoveredSpec] = useState<string | null>(null)

  // Group entries by tier
  const tierGroups = new Map<Tier, MetaStatsEntry[]>()
  for (const t of TIER_ORDER) {
    tierGroups.set(t, [])
  }
  for (const entry of entries) {
    tierGroups.get(entry.tier)?.push(entry)
  }

  // Find max score across all bracket comparison data for scaling bars
  const allScores = Array.from(bracketComparison.values()).flatMap((d) =>
    d.ranks.map((r) => r.score),
  )
  const maxScore = Math.max(...allScores, 1)

  return (
    <div className="w-full space-y-1 p-2">
      {TIER_ORDER.map((t) => {
        const specs = tierGroups.get(t)
        if (!specs || specs.length === 0) return null

        return (
          <div key={t} className="flex items-stretch gap-0">
            {/* Tier label */}
            <div
              className={`flex w-14 shrink-0 flex-col items-center justify-center rounded-l-lg border-r-0 px-2 py-3 backdrop-blur-sm ${TIER_COLORS[t]}`}
            >
              <span className="text-sm font-bold">{t}</span>
              <span className="text-[8px] uppercase tracking-wider opacity-60">
                {TIER_LABELS[t]}
              </span>
            </div>

            {/* Spec icons row */}
            <div className="flex flex-1 flex-wrap items-center gap-3 rounded-r-lg border border-border/30 bg-card/15 px-4 py-3 min-h-16 ">
              {specs.map((entry) => {
                const comparison = bracketComparison.get(entry.key)
                const isHovered = hoveredSpec === entry.key

                return (
                  <HoverCard key={entry.key} openDelay={100} closeDelay={50}>
                    <HoverCardTrigger asChild>
                      <Link
                        href={entry.specUrl}
                        className="group relative rounded-lg transition-all hover:scale-110"
                        onMouseEnter={() => {
                          setHoverSlug(entry.className as WowClassSlug)
                          setHoveredSpec(entry.key)
                        }}
                        onMouseLeave={() => {
                          setHoverSlug(defaultClassSlug ?? null)
                          setHoveredSpec(null)
                        }}
                      >
                        {entry.iconUrl ? (
                          <Image
                            src={entry.iconUrl}
                            alt={`${titleizeSlug(entry.specName)} ${titleizeSlug(entry.className)}`}
                            width={48}
                            height={48}
                            className="rounded-lg transition-shadow"
                            style={{
                              border: isHovered
                                ? `2px solid ${entry.color}`
                                : `2px solid ${entry.color}80`,
                            }}
                            unoptimized
                          />
                        ) : (
                          <div
                            className="h-12 w-12 rounded-lg"
                            style={{
                              backgroundColor: entry.color,
                              border: isHovered
                                ? `2px solid ${entry.color}`
                                : `2px solid ${entry.color}80`,
                              opacity: 0.7,
                            }}
                          />
                        )}
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent side="bottom" className="w-56 p-3">
                      <div className="mb-2 flex items-center gap-2">
                        {entry.iconUrl && (
                          <Image
                            src={entry.iconUrl}
                            alt={entry.specName}
                            width={20}
                            height={20}
                            className="rounded-sm"
                            unoptimized
                          />
                        )}
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color: entry.color,
                          }}
                        >
                          {titleizeSlug(entry.specName)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {titleizeSlug(entry.className)}
                        </span>
                      </div>

                      {comparison && comparison.ranks.length > 0 ? (
                        <div className="space-y-1.5">
                          {comparison.ranks.map((r) => {
                            const isCurrent = r.bracket === currentBracket
                            return (
                              <div key={r.bracket} className="flex items-center gap-2">
                                <span
                                  className={`w-12 text-[10px] font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                                >
                                  {r.label}
                                </span>
                                <span
                                  className={`w-6 rounded px-1 py-0.5 text-center text-[9px] font-bold ${TIER_COLORS[r.tier]}`}
                                >
                                  {r.tier}
                                </span>
                                <ScoreBar score={r.score} color={entry.color} maxScore={maxScore} />
                                <span className="w-8 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                                  #{r.rank}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">No cross-bracket data</p>
                      )}
                    </HoverCardContent>
                  </HoverCard>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
