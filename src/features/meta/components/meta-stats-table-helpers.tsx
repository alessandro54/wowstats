import type { Tier } from "@/config/app-config"

export function RankTrend({ change }: { change: number | null | undefined }) {
  if (change == null) return null
  if (change > 0)
    return <span className="ml-0.5 text-[9px] font-bold text-emerald-400">▲{change}</span>
  if (change < 0)
    return <span className="ml-0.5 text-[9px] font-bold text-red-400">▼{Math.abs(change)}</span>
  return <span className="ml-0.5 text-[9px] text-muted-foreground">—</span>
}

export function wrColor(wr: number): string {
  if (wr >= 0.53) return "text-emerald-400"
  if (wr >= 0.48) return "text-foreground"
  return "text-red-400"
}

export function confidenceLevel(bK: number): {
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

export function scoreHeatBg(tier: Tier): string {
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
