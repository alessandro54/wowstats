"use client"

import { APEX_EXTRA, BORDER_BIS, BORDER_SITUATIONAL, CELL_SIZE, NODE_SIZE, buildEdgeSet, buildNodeMap, buildTopNodeIds } from "./talent-tree-utils"
import type { MetaTalent } from "@/lib/api"
import { TalentEdges } from "./talent-tree-edges"
import { TalentNodeCard } from "./talent-tree-node"

export { hasTreeData } from "./talent-tree-utils"

export function TalentTree({
  talents,
  activeColor,
  onlyChoicePct = false,
  fullOpacity   = false,
  apexExtra     = false,
  budget,
}: {
  talents:        MetaTalent[]
  activeColor:    string
  onlyChoicePct?: boolean
  fullOpacity?:   boolean
  apexExtra?:     boolean
  /** How many talent points can be spent in this tree (e.g. 34 for class/spec).
   *  Top nodes by usage_pct (weighted by maxRank) are treated as the best build. */
  budget?:        number
}) {
  const nodeMap = buildNodeMap(talents)
  const nodes   = Array.from(nodeMap.values())

  if (nodes.length === 0) return null

  const topNodeIds = budget ? buildTopNodeIds(nodes, budget) : new Set<number>()

  const minRow = Math.min(...nodes.map((n) => n.row))
  const minCol = Math.min(...nodes.map((n) => n.col))
  const maxRow = Math.max(...nodes.map((n) => n.row))
  const maxCol = Math.max(...nodes.map((n) => n.col))

  const rowCounts = new Map<number, number>()
  for (const node of nodes) {
    rowCounts.set(node.row, (rowCounts.get(node.row) ?? 0) + 1)
  }

  const topApex = rowCounts.get(minRow) === 1
  const botApex = rowCounts.get(maxRow) === 1
  const extra   = apexExtra ? APEX_EXTRA : 0

  const svgW = (maxCol - minCol) * CELL_SIZE + NODE_SIZE
  const svgH = (maxRow - minRow) * CELL_SIZE + NODE_SIZE +
    (topApex ? extra : 0) + (botApex ? extra : 0)

  const cx    = (col: number) => (col - minCol) * CELL_SIZE + NODE_SIZE / 2
  const nodeY = (row: number) => {
    if (topApex && row === minRow) return NODE_SIZE / 2
    if (botApex && row === maxRow) return svgH - NODE_SIZE / 2
    return (row - minRow) * CELL_SIZE + NODE_SIZE / 2 + (topApex ? extra : 0)
  }
  const nodeCX = (node: { row: number; col: number }) =>
    (node.row === minRow || node.row === maxRow) && rowCounts.get(node.row) === 1
      ? svgW / 2
      : cx(node.col)

  const edgeSet = buildEdgeSet(talents)

  return (
    <>
      <div className="flex justify-center lg:justify-start [zoom:0.9] lg:[zoom:1]">
        <div className="relative" style={{ width: svgW, height: svgH }}>
          <TalentEdges
            edgeSet={edgeSet}
            nodeMap={nodeMap}
            nodeCX={nodeCX}
            nodeY={nodeY}
            svgW={svgW}
            svgH={svgH}
            activeColor={activeColor}
            budget={budget}
            topNodeIds={topNodeIds}
          />
          {nodes.map((node) => (
            <TalentNodeCard
              key={node.nodeId}
              node={node}
              left={nodeCX(node) - NODE_SIZE / 2}
              top={nodeY(node.row) - NODE_SIZE / 2}
              topNodeIds={topNodeIds}
              budget={budget}
              fullOpacity={fullOpacity}
              onlyChoicePct={onlyChoicePct}
              activeColor={activeColor}
            />
          ))}
        </div>
      </div>
      {budget && (
        <div className="flex gap-5 justify-center lg:justify-start text-[11px] text-muted-foreground mt-5">
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded border-2 shrink-0 ${BORDER_BIS}`} />
            BIS
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded border-2 shrink-0 ${BORDER_SITUATIONAL}`} />
            Situational
          </div>
        </div>
      )}
    </>
  )
}
