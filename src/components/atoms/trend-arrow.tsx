import type { Trend } from "@/lib/api"

interface Props {
  trend?: Trend
  className?: string
}

export function TrendArrow({ trend, className = "" }: Props) {
  if (!trend || trend === "stable") return null

  if (trend === "new") {
    return (
      <span
        className={`inline-block text-[8px] font-bold uppercase leading-none tracking-wide text-sky-400 ${className}`}
        title="New this sync"
      >
        new
      </span>
    )
  }

  if (trend === "up") {
    return (
      <span
        className={`inline-block text-[10px] leading-none text-emerald-400 ${className}`}
        title="Rising"
      >
        ▲
      </span>
    )
  }

  return (
    <span
      className={`inline-block text-[10px] leading-none text-red-400 ${className}`}
      title="Falling"
    >
      ▼
    </span>
  )
}
