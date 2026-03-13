import type { TalentNode } from "./talent-tree"
import { BORDER_BIS, BORDER_DEFAULT, BORDER_SITUATIONAL } from "./talent-tree"

// ── Tier ───────────────────────────────────────────────────────────────────

const TIER_WEIGHT: Record<string, number> = {
  bis: 2,
  situational: 1,
  common: 0,
}

export function bestTier(node: TalentNode): string {
  if (node.isRanked) {
    return node.all.reduce((best, t) => {
      const r = TIER_WEIGHT[t.tier ?? "common"] ?? 0
      return r > (TIER_WEIGHT[best] ?? 0) ? (t.tier ?? "common") : best
    }, node.primary.tier ?? "common")
  }
  return node.primary.tier ?? (node.all.some((t) => t.in_top_build) ? "bis" : "common")
}

// ── Border ─────────────────────────────────────────────────────────────────

export function metaBorderClass(tier: string, isFree: boolean): string | undefined {
  if (isFree) return BORDER_DEFAULT
  if (tier === "bis") return BORDER_BIS
  if (tier === "situational") return BORDER_SITUATIONAL
  return undefined
}

// ── Rank ───────────────────────────────────────────────────────────────────

export function investedRank(node: TalentNode): number {
  if (!node.isRanked) return node.primary.top_build_rank
  const sum = node.all.filter((t) => t.in_top_build).reduce((s, t) => s + t.top_build_rank, 0)
  return Math.min(sum, node.maxRank)
}

export interface RankBar {
  label: string
  pct: number
}

export function buildRankBars(node: TalentNode): RankBar[] | null {
  if (!node.isRanked || node.all.length < 2) return null

  const max = node.maxRank

  // Apex: 3 variants = 4 in-game ranks (variant[1] covers ranks 2 and 3)
  if (node.all.length === 3 && max === 4) {
    return [
      {
        label: "1/4",
        pct: node.all[0].usage_pct,
      },
      {
        label: "2/4",
        pct: node.all[1].usage_pct,
      },
      {
        label: "3/4",
        pct: node.all[1].usage_pct,
      },
      {
        label: "4/4",
        pct: node.all[2].usage_pct,
      },
    ]
  }

  // General case: one bar per variant, labeled by maxRank
  return node.all.map((t, i) => ({
    label: `${i + 1}/${max}`,
    pct: t.usage_pct,
  }))
}

// ── Usage % ────────────────────────────────────────────────────────────────

export function displayUsagePct(node: TalentNode): number {
  return node.isRanked ? Math.max(...node.all.map((t) => t.usage_pct)) : node.primary.usage_pct
}
