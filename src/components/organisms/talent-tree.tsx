"use client"

import type { MetaTalent } from "@/lib/api"
import { TalentEdges } from "@/components/molecules/talent-tree-edges"
import { TalentNodeCard } from "@/components/molecules/talent-tree-node"
import { computeTreeLayout } from "@/lib/utils/talent-tree-layout"
import {
  APEX_NODE_SIZE,
  BORDER_BIS,
  BORDER_SITUATIONAL,
  buildEdgeSet,
  buildNodeMap,
  NODE_SIZE,
} from "@/lib/utils/talent-tree"

export { hasTreeData } from "@/lib/utils/talent-tree"

export function TalentTree({
  talents,
  activeColor,
  onlyChoicePct = false,
  fullOpacity = false,
  apexExtra = false,
  budget,
  hideStats,
  apexCircle = false,
}: {
  talents: MetaTalent[]
  activeColor: string
  onlyChoicePct?: boolean
  fullOpacity?: boolean
  apexExtra?: boolean
  budget?: number
  hideStats?: boolean
  apexCircle?: boolean
}) {
  const nodeMap = buildNodeMap(talents)
  const nodes = Array.from(nodeMap.values())

  if (nodes.length === 0) return null

  const layout = computeTreeLayout(nodes, {
    apexExtra,
    apexCircle,
  })
  const { svgW, svgH, maxRow, botApex, nodeCX, nodeY } = layout
  const useApex = apexCircle && botApex
  const edgeSet = buildEdgeSet(talents)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex justify-center">
        <div
          className="relative"
          style={{
            width: svgW,
            height: svgH,
          }}
        >
          <TalentEdges
            edgeSet={edgeSet}
            nodeMap={nodeMap}
            nodeCX={nodeCX}
            nodeY={nodeY}
            svgW={svgW}
            svgH={svgH}
            activeColor={activeColor}
            budget={budget}
          />
          {nodes.map((node) => {
            const isApex = useApex && node.row === maxRow
            const size = isApex ? APEX_NODE_SIZE : NODE_SIZE
            return (
              <TalentNodeCard
                key={node.nodeId}
                node={node}
                left={nodeCX(node) - size / 2}
                top={nodeY(node.row) - size / 2}
                budget={budget}
                fullOpacity={fullOpacity}
                onlyChoicePct={onlyChoicePct}
                activeColor={activeColor}
                hideStats={hideStats}
                isApex={isApex}
              />
            )
          })}
        </div>
      </div>

      {budget && (
        <div className="text-muted-foreground mt-auto flex justify-center gap-5 pt-5 text-[11px] lg:justify-start">
          <div className="flex items-center gap-1.5">
            <div className={`h-3 w-3 shrink-0 rounded border-2 ${BORDER_BIS}`} />
            BiS
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`h-3 w-3 shrink-0 rounded border-2 ${BORDER_SITUATIONAL}`} />
            Situational
          </div>
        </div>
      )}
    </div>
  )
}
