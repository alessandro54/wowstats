"use client"

import { useState } from "react"
import type { MetaTalent } from "@/lib/api"
import { TalentIcon } from "./talent-icon"

// Pixel dimensions for the grid
const NODE_SIZE  = 44
const CELL_SIZE  = 64  // node + gap; preserves Blizzard's sparse column spacing
const APEX_EXTRA = 16  // extra px pushed outward for single-node apex rows

type TalentNode = {
  nodeId:   number
  row:      number
  col:      number
  maxRank:  number
  primary:  MetaTalent  // highest usage_pct — shown as the main icon
  isChoice: boolean     // two talents share this node
  all:      MetaTalent[]
}

function buildNodeMap(talents: MetaTalent[]): Map<number, TalentNode> {
  const map = new Map<number, TalentNode>()

  for (const t of talents) {
    const { node_id, display_row, display_col, max_rank } = t.talent
    if (node_id == null || display_row == null || display_col == null) continue

    const existing = map.get(node_id)
    if (existing) {
      existing.all.push(t)
      if (t.usage_pct > existing.primary.usage_pct) existing.primary = t
      existing.isChoice = true
    } else {
      map.set(node_id, {
        nodeId:   node_id,
        row:      display_row,
        col:      display_col,
        maxRank:  max_rank,
        primary:  t,
        isChoice: false,
        all:      [t],
      })
    }
  }

  return map
}

// Returns opacity based on usage percentage.
// Talents at or below 20% are dimmed to 50%; above that, fully opaque.
function usageOpacity(pct: number): number {
  return pct <= 20 ? 0.5 : 1
}

export function hasTreeData(talents: MetaTalent[]): boolean {
  return talents.some(
    (t) => t.talent.display_row != null && t.talent.display_col != null,
  )
}

export function TalentTree({
  talents,
  activeColor,
  onlyChoicePct = false,
  fullOpacity   = false,
}: {
  talents:         MetaTalent[]
  activeColor:     string
  onlyChoicePct?:  boolean
  fullOpacity?:    boolean
}) {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)

  const nodeMap = buildNodeMap(talents)
  const nodes   = Array.from(nodeMap.values())

  if (nodes.length === 0) return null

  const minRow = Math.min(...nodes.map((n) => n.row))
  const minCol = Math.min(...nodes.map((n) => n.col))
  const maxRow = Math.max(...nodes.map((n) => n.row))
  const maxCol = Math.max(...nodes.map((n) => n.col))

  // Count nodes per row to detect apex rows (single entry/exit node)
  const rowCounts = new Map<number, number>()
  for (const node of nodes) {
    rowCounts.set(node.row, (rowCounts.get(node.row) ?? 0) + 1)
  }

  const topApex = rowCounts.get(minRow) === 1
  const botApex = rowCounts.get(maxRow) === 1

  const svgW = (maxCol - minCol) * CELL_SIZE + NODE_SIZE
  const svgH = (maxRow - minRow) * CELL_SIZE + NODE_SIZE +
    (topApex ? APEX_EXTRA : 0) + (botApex ? APEX_EXTRA : 0)

  // cx: center X of a node at a given column
  const cx = (col: number) => (col - minCol) * CELL_SIZE + NODE_SIZE / 2

  // nodeY: center Y of a node at a given row.
  // Apex rows are pushed outward by APEX_EXTRA; interior rows shift down by APEX_EXTRA if there's a top apex.
  const nodeY = (row: number) => {
    if (topApex && row === minRow) return NODE_SIZE / 2
    if (botApex && row === maxRow) return svgH - NODE_SIZE / 2
    return (row - minRow) * CELL_SIZE + NODE_SIZE / 2 + (topApex ? APEX_EXTRA : 0)
  }

  // Apex nodes (single node at top/bottom row) are horizontally centered
  const nodeCX = (node: TalentNode) =>
    (node.row === minRow || node.row === maxRow) && rowCounts.get(node.row) === 1
      ? svgW / 2
      : cx(node.col)

  // Collect unique prerequisite edges from all talents in this tree group
  const edgeSet = new Set<string>()
  for (const t of talents) {
    const { node_id, prerequisite_node_ids } = t.talent
    if (node_id == null) continue
    for (const prereqId of prerequisite_node_ids) {
      edgeSet.add(`${prereqId}→${node_id}`)
    }
  }

  return (
    <div className="flex justify-center lg:justify-start [zoom:0.6] sm:[zoom:0.8] lg:[zoom:1]">
      <div className="relative" style={{ width: svgW, height: svgH }}>
        {/* prerequisite lines */}
        <svg
          className="absolute inset-0"
          width={svgW}
          height={svgH}
          aria-hidden
        >
          {Array.from(edgeSet).map((key) => {
            const [fromId, toId] = key.split("→").map(Number)
            const from = nodeMap.get(fromId)
            const to   = nodeMap.get(toId)
            if (!from || !to) return null
            const hovered = hoveredEdge === key
            return (
              <g
                key={key}
                onMouseEnter={() => setHoveredEdge(key)}
                onMouseLeave={() => setHoveredEdge(null)}
              >
                {/* wide invisible hit area */}
                <line
                  x1={nodeCX(from)} y1={nodeY(from.row)}
                  x2={nodeCX(to)}   y2={nodeY(to.row)}
                  stroke="transparent"
                  strokeWidth={14}
                />
                {/* visible connector */}
                <line
                  x1={nodeCX(from)} y1={nodeY(from.row)}
                  x2={nodeCX(to)}   y2={nodeY(to.row)}
                  stroke={activeColor}
                  strokeOpacity={hovered ? 1 : 0.3}
                  strokeWidth={hovered ? 3 : 1.5}
                  strokeLinecap="round"
                  style={{ transition: "stroke-opacity 0.15s ease, stroke-width 0.15s ease" }}
                />
              </g>
            )
          })}
        </svg>

        {/* talent nodes */}
        {nodes.map((node) => {
          const left    = nodeCX(node) - NODE_SIZE / 2
          const top     = nodeY(node.row) - NODE_SIZE / 2
          const opacity = fullOpacity ? 1 : usageOpacity(node.primary.usage_pct)

          const tooltipContent = node.isChoice ? (
            <div className="space-y-1">
              {node.all.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4">
                  <span>{t.talent.name}</span>
                  <span className="font-mono font-bold">{t.usage_pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <span>{node.primary.talent.name}</span>
              <span className="font-mono font-bold">{node.primary.usage_pct.toFixed(1)}%</span>
            </div>
          )

          return (
            <div
              key={node.nodeId}
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
                    tooltipContent={tooltipContent}
                  />
                </div>
              </div>
              {(!onlyChoicePct || node.isChoice) && (
                <span
                  className="text-[10px] font-mono font-bold tabular-nums leading-none"
                  style={{ color: activeColor, opacity }}
                >
                  {node.primary.usage_pct.toFixed(0)}%
                </span>
              )}
              {node.isChoice && (
                <span
                  className="text-[9px] text-muted-foreground leading-none"
                  style={{ opacity }}
                >
                  choice
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
