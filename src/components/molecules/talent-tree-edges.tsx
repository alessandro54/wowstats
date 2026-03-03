"use client"

import { useState } from "react"
import type { TalentNode } from "@/lib/talent-tree-utils"

type Props = {
  edgeSet:    Set<string>
  nodeMap:    Map<number, TalentNode>
  nodeCX:     (node: TalentNode) => number
  nodeY:      (row: number) => number
  svgW:       number
  svgH:       number
  activeColor: string
  budget?:    number
  topNodeIds: Set<number>
}

export function TalentEdges({ edgeSet, nodeMap, nodeCX, nodeY, svgW, svgH, activeColor, budget, topNodeIds }: Props) {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)

  return (
    <svg className="absolute inset-0" width={svgW} height={svgH} aria-hidden>
      {Array.from(edgeSet).map((key) => {
        const [fromId, toId] = key.split("→").map(Number)
        const from = nodeMap.get(fromId)
        const to   = nodeMap.get(toId)
        if (!from || !to) return null
        const hovered      = hoveredEdge === key
        const edgeTopBuild = !budget || (topNodeIds.has(fromId) && topNodeIds.has(toId))
        return (
          <g
            key={key}
            onMouseEnter={() => setHoveredEdge(key)}
            onMouseLeave={() => setHoveredEdge(null)}
          >
            <line
              x1={nodeCX(from)} y1={nodeY(from.row)}
              x2={nodeCX(to)}   y2={nodeY(to.row)}
              stroke="transparent"
              strokeWidth={14}
            />
            <line
              x1={nodeCX(from)} y1={nodeY(from.row)}
              x2={nodeCX(to)}   y2={nodeY(to.row)}
              stroke={activeColor}
              strokeOpacity={hovered ? 1 : edgeTopBuild ? 0.6 : 0.12}
              strokeWidth={hovered ? 3 : edgeTopBuild ? 2 : 1.5}
              strokeLinecap="round"
              style={{ transition: "stroke-opacity 0.15s ease, stroke-width 0.15s ease" }}
            />
          </g>
        )
      })}
    </svg>
  )
}
