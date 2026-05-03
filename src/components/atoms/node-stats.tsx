import { displayUsagePct } from "@/lib/utils/talent-node-utils"
import type { TalentNode } from "@/lib/utils/talent-tree"

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

// >= this usage is "the pick" — % label is noise. Rank still renders.
const HIDE_PCT_THRESHOLD = 90

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
  const pctValue = displayUsagePct(node)
  const showPctEffective = showPct && pctValue < HIDE_PCT_THRESHOLD
  const hasPct = !hideStats && showPctEffective
  const hasRank = showRank && (hideStats || !showPctEffective)
  const hasInlineRank = !hideStats && showPctEffective && showRank
  if (!hasPct && !hasRank && !hasInlineRank) return null

  const el = (
    <span
      className="font-mono text-[10px] leading-none font-bold tabular-nums whitespace-nowrap"
      style={{
        opacity,
      }}
    >
      {hasPct && <span className="text-slate-600 dark:text-white">{pctValue.toFixed(0)}%</span>}
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
