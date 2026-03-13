import type { TalentNode } from "./talent-tree"
import { APEX_NODE_SIZE, CELL_SIZE, NODE_SIZE } from "./talent-tree"

export interface TreeLayout {
  svgW: number
  svgH: number
  minRow: number
  maxRow: number
  topApex: boolean
  botApex: boolean
  rowCounts: Map<number, number>
  nodeCX: (node: { row: number; col: number }) => number
  nodeY: (row: number) => number
}

export function computeTreeLayout(
  nodes: TalentNode[],
  opts: {
    apexExtra: boolean
    apexCircle: boolean
  },
): TreeLayout {
  const EXTRA = 20 // px pushed outward for single-node apex rows

  const uniqueRows = [
    ...new Set(nodes.map((n) => n.row)),
  ].sort((a, b) => a - b)

  const minRow = uniqueRows[0]
  const maxRow = uniqueRows[uniqueRows.length - 1]

  const rowCounts = new Map<number, number>()
  const rowColCounts = new Map<number, number>()
  for (const node of nodes) {
    rowCounts.set(node.row, (rowCounts.get(node.row) ?? 0) + 1)
  }
  // Count unique columns per row (multiple nodes at the same col count as 1)
  for (const row of uniqueRows) {
    const cols = new Set(nodes.filter((n) => n.row === row).map((n) => n.col))
    rowColCounts.set(row, cols.size)
  }

  const topApex = rowColCounts.get(minRow) === 1
  const botApex = rowColCounts.get(maxRow) === 1

  // Exclude apex rows from column calculation — they're always
  // centered at svgW/2, so their column value shouldn't affect the grid width.
  const colNodes = nodes.filter((n) => {
    if (topApex && n.row === minRow) return false
    if (botApex && n.row === maxRow) return false
    return true
  })
  const uniqueCols = [
    ...new Set(colNodes.map((n) => n.col)),
  ].sort((a, b) => a - b)
  const rowIdx = new Map(
    uniqueRows.map((r, i) => [
      r,
      i,
    ]),
  )
  const colIdx = new Map(
    uniqueCols.map((c, i) => [
      c,
      i,
    ]),
  )
  const extra = opts.apexExtra ? EXTRA : 0
  const useApex = opts.apexCircle && botApex
  const botNodeSize = useApex ? APEX_NODE_SIZE : NODE_SIZE

  const svgW = (uniqueCols.length - 1) * CELL_SIZE + NODE_SIZE

  const cx = (col: number) => colIdx.get(col)! * CELL_SIZE + NODE_SIZE / 2

  // All rows use uniform CELL_SIZE spacing. Top apex sits at the top edge;
  // remaining rows shift down by `extra` when topApex is present.
  const apexGap = useApex ? EXTRA : 0
  const nodeY = (row: number) => {
    if (topApex && row === minRow) return NODE_SIZE / 2
    const base = rowIdx.get(row)! * CELL_SIZE + NODE_SIZE / 2 + (topApex ? extra : 0)
    if (botApex && row === maxRow) return base + apexGap
    return base
  }

  // Derive svgH from the actual bottom node position
  const lastNodeY = nodeY(maxRow)
  const svgH = lastNodeY + botNodeSize / 2

  const nodeCX = (node: { row: number; col: number }) =>
    (node.row === minRow || node.row === maxRow) && rowColCounts.get(node.row) === 1
      ? svgW / 2
      : cx(node.col)

  return {
    svgW,
    svgH,
    minRow,
    maxRow,
    topApex,
    botApex,
    rowCounts,
    nodeCX,
    nodeY,
  }
}
