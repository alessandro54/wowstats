import { TalentIcon } from "./talent-icon"
import { BORDER_BIS, BORDER_SITUATIONAL, NODE_SIZE } from "./talent-tree-utils"
import type { TalentNode } from "./talent-tree-utils"

type Props = {
  node:          TalentNode
  left:          number
  top:           number
  topNodeIds:    Set<number>
  budget?:       number
  fullOpacity:   boolean
  onlyChoicePct: boolean
  activeColor:   string
}

export function TalentNodeCard({ node, left, top, topNodeIds, budget, fullOpacity, onlyChoicePct, activeColor }: Props) {
  const inTopBuild    = fullOpacity || (budget ? topNodeIds.has(node.nodeId) : node.all.some((t) => t.in_top_build))
  const isSituational = !inTopBuild && node.primary.usage_pct >= 30
  const opacity       = inTopBuild ? 1 : (isSituational ? 0.75 : 0.25)
  const borderClass   = budget
    ? (inTopBuild ? BORDER_BIS : (isSituational ? BORDER_SITUATIONAL : undefined))
    : undefined

  const tooltipContent = node.isChoice ? (
    <div className="space-y-1">
      {node.all.map((t) => (
        <div key={t.talent.id} className="flex items-center justify-between gap-4">
          <span className={t.talent.id === node.primary.talent.id ? "font-semibold" : ""}>
            {t.talent.name}
          </span>
          <span className="font-mono font-bold">{t.usage_pct.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-between gap-4">
      <span>{node.primary.talent.name}</span>
      <span className="font-mono font-bold text-white">{node.primary.usage_pct.toFixed(1)}%</span>
    </div>
  )

  // Top-build non-choice nodes: hide %, they're "the build"
  const showPct = (!inTopBuild || node.isChoice) && (!onlyChoicePct || node.isChoice)

  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{ left, top, width: NODE_SIZE }}
    >
      {/* Solid background blocks SVG lines from showing through dimmed icons */}
      <div className="relative" style={{ width: NODE_SIZE, height: NODE_SIZE }}>
        <div className="absolute inset-0 rounded bg-background" />
        <div style={{ opacity }}>
          <TalentIcon
            talent={node.primary}
            size={NODE_SIZE}
            activeColor={activeColor}
            borderClass={borderClass}
            tooltipContent={tooltipContent}
          />
        </div>
      </div>
      {showPct && (
        <span
          className="text-[10px] font-mono font-bold tabular-nums leading-none text-slate-600 dark:text-white"
          style={{ opacity }}
        >
          {node.primary.usage_pct.toFixed(0)}%
        </span>
      )}
      {node.isChoice && (
        <span className="text-[9px] text-muted-foreground leading-none" style={{ opacity }}>
          choice
        </span>
      )}
    </div>
  )
}
