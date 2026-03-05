"use client"

import type { MetaTalent } from "@/lib/api"
import { TalentEdges } from "@/components/molecules/talent-tree-edges"
import { TalentNodeCard } from "@/components/molecules/talent-tree-node"
import {
  APEX_EXTRA,
  BORDER_BIS,
  BORDER_SITUATIONAL,
  buildEdgeSet,
  buildNodeMap,
  buildTopNodeIds,
  CELL_SIZE,
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
}: {
  talents: MetaTalent[]
  activeColor: string
  onlyChoicePct?: boolean
  fullOpacity?: boolean
  apexExtra?: boolean
  /**
   * How many talent points can be spent in this tree (e.g. 34 for class/spec).
   *  Top nodes by usage_pct (weighted by maxRank) are treated as the best build.
   */
  budget?: number
}) {
  const nodeMap = buildNodeMap(talents)
  const nodes = Array.from(nodeMap.values())

  if (nodes.length === 0)
    return null

  const topNodeIds = budget ? buildTopNodeIds(nodes, budget) : new Set<number>()

  // Normalize rows and cols to contiguous indices so gaps in Blizzard's
  // display_row / display_col values don't produce extra whitespace.
  const uniqueRows = [...new Set(nodes.map(n => n.row))].sort((a, b) => a - b)
  const uniqueCols = [...new Set(nodes.map(n => n.col))].sort((a, b) => a - b)
  const rowIdx = new Map(uniqueRows.map((r, i) => [r, i]))
  const colIdx = new Map(uniqueCols.map((c, i) => [c, i]))

  const minRow = uniqueRows[0]
  const maxRow = uniqueRows[uniqueRows.length - 1]

  const rowCounts = new Map<number, number>()
  for (const node of nodes) {
    rowCounts.set(node.row, (rowCounts.get(node.row) ?? 0) + 1)
  }

  const topApex = rowCounts.get(minRow) === 1
  const botApex = rowCounts.get(maxRow) === 1
  const extra = apexExtra ? APEX_EXTRA : 0

  const svgW = (uniqueCols.length - 1) * CELL_SIZE + NODE_SIZE
  const svgH
    = (uniqueRows.length - 1) * CELL_SIZE + NODE_SIZE + (topApex ? extra : 0) + (botApex ? extra : 0)

  const cx = (col: number) => colIdx.get(col)! * CELL_SIZE + NODE_SIZE / 2
  const nodeY = (row: number) => {
    if (topApex && row === minRow)
      return NODE_SIZE / 2
    if (botApex && row === maxRow)
      return svgH - NODE_SIZE / 2
    return rowIdx.get(row)! * CELL_SIZE + NODE_SIZE / 2 + (topApex ? extra : 0)
  }
  const nodeCX = (node: { row: number, col: number }) =>
    (node.row === minRow || node.row === maxRow) && rowCounts.get(node.row) === 1
      ? svgW / 2
      : cx(node.col)

  const edgeSet = buildEdgeSet(talents)

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex justify-center">
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
          {nodes.map(node => (
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
