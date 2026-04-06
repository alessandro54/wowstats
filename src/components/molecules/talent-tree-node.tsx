import { ChoiceChevrons } from "@/components/atoms/choice-chevrons"
import { NodeStats } from "@/components/atoms/node-stats"
import { TalentIcon } from "@/components/atoms/talent-icon"
import { TalentNodeTooltip } from "@/components/atoms/talent-node-tooltip"
import {
  bestTier,
  buildRankBars,
  investedRank as computeInvestedRank,
  metaBorderClass,
} from "@/lib/utils/talent-node-utils"
import type { TalentNode } from "@/lib/utils/talent-tree"
import { APEX_NODE_SIZE, NODE_SIZE } from "@/lib/utils/talent-tree"

interface Props {
  node: TalentNode
  left: number
  top: number
  budget?: number
  fullOpacity: boolean
  onlyChoicePct: boolean
  activeColor: string
  hideStats?: boolean
  isApex?: boolean
}

export function TalentNodeCard({
  node,
  left,
  top,
  budget,
  fullOpacity,
  onlyChoicePct,
  activeColor,
  hideStats,
  isApex,
}: Props) {
  const tier = bestTier(node)
  const isBis = tier === "bis"
  const isSituational = tier === "situational"
  const inTopBuild = fullOpacity || isBis || isSituational
  const opacity = fullOpacity || isBis ? 1 : isSituational ? 0.75 : 0.25

  const borderClass = budget ? metaBorderClass(tier, node.defaultPoints >= node.maxRank) : undefined

  const invested = computeInvestedRank(node)
  const isPartialRank =
    !node.isChoice &&
    inTopBuild &&
    node.maxRank > 1 &&
    invested > node.defaultPoints &&
    invested < node.maxRank

  const rankBars = buildRankBars(node)
  const maxBarPct = rankBars ? Math.max(...rankBars.map((b) => b.pct), 1) : 0

  const isVariable = node.isChoice || node.isRanked
  const showPct =
    (!inTopBuild || isSituational || isVariable) && (!onlyChoicePct || isSituational || isVariable)
  const showRank = node.isRanked && node.maxRank > 1 && invested > 0
  const nodeSize = isApex ? APEX_NODE_SIZE : NODE_SIZE

  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left,
        top,
        width: nodeSize,
      }}
    >
      {/* Solid background blocks SVG lines from showing through dimmed icons */}
      <div
        className="relative"
        style={{
          width: nodeSize,
          height: nodeSize,
        }}
      >
        <div className={`bg-background absolute inset-0 ${isApex ? "rounded-full" : "rounded"}`} />
        <div
          style={{
            opacity,
          }}
        >
          <TalentIcon
            talent={node.primary}
            size={nodeSize}
            activeColor={activeColor}
            borderClass={borderClass}
            tooltipContent={
              <TalentNodeTooltip
                node={node}
                investedRank={invested}
                activeColor={activeColor}
                hideStats={hideStats}
                rankBars={rankBars}
                maxBarPct={maxBarPct}
              />
            }
            partialRank={isPartialRank}
            isApex={isApex}
            glowing={isApex && invested === node.maxRank}
          />
        </div>
        {node.isChoice && inTopBuild && <ChoiceChevrons activeColor={activeColor} />}
        {/* Apex: stats to the right of the icon */}
        {isApex && (
          <NodeStats
            hideStats={hideStats}
            showPct={showPct}
            showRank={showRank}
            node={node}
            invested={invested}
            activeColor={activeColor}
            opacity={opacity}
            position="right"
          />
        )}
      </div>

      {/* Non-apex: stats below the icon */}
      {!isApex && (
        <NodeStats
          hideStats={hideStats}
          showPct={showPct}
          showRank={showRank}
          node={node}
          invested={invested}
          activeColor={activeColor}
          opacity={opacity}
        />
      )}
    </div>
  )
}
