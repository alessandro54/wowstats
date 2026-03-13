import type { TalentNode } from "@/lib/utils/talent-tree"
import { displayUsagePct } from "@/lib/utils/talent-node-utils"

interface Props {
  hideStats?: boolean
  showPct: boolean
  showRank: boolean
  node: TalentNode
  invested: number
  activeColor: string
  opacity: number
  position?: "right"
}

export function NodeStats({
  hideStats,
  showPct,
  showRank,
  node,
  invested,
  activeColor,
  opacity,
  position,
}: Props) {
  const hasPct = !hideStats && showPct
  const hasRank = showRank && (hideStats || !showPct)
  const hasInlineRank = !hideStats && showPct && showRank
  if (!hasPct && !hasRank && !hasInlineRank) return null

  const el = (
    <span
      className="font-mono text-[10px] leading-none font-bold tabular-nums whitespace-nowrap"
      style={{
        opacity,
      }}
    >
      {hasPct && (
        <span className="text-slate-600 dark:text-white">{displayUsagePct(node).toFixed(0)}%</span>
      )}
      {hasInlineRank && <span className="text-slate-600 dark:text-white"> · </span>}
      {(hasInlineRank || hasRank) && (
        <span
          style={{
            color: activeColor,
          }}
        >
          {invested}/{node.maxRank}
        </span>
      )}
    </span>
  )

  if (position === "right") {
    return (
      <div
        className="pointer-events-none absolute flex items-center"
        style={{
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: 6,
        }}
      >
        {el}
      </div>
    )
  }

  return el
}
