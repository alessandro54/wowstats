"use client"

import { useMemo } from "react"
import { TalentEdges } from "@/components/molecules/talent-tree-edges"
import { TalentNodeCard } from "@/components/molecules/talent-tree-node"
import { Skeleton } from "@/components/ui/skeleton"
import type { MetaTalent } from "@/lib/api"
import {
  APEX_NODE_SIZE,
  BORDER_BIS,
  BORDER_SITUATIONAL,
  buildEdgeSet,
  buildNodeMap,
  CELL_SIZE,
  NODE_SIZE,
} from "@/lib/utils/talent-tree"
import { computeTreeLayout } from "@/lib/utils/talent-tree-layout"

export { hasTreeData } from "@/lib/utils/talent-tree"

// Deterministic sparse pattern — avoids hydration mismatches.
// Mirrors the diamond-like shape of real talent trees.
const SKIP = new Set([
  "0-0",
  "0-1",
  "0-5",
  "0-6",
  "1-0",
  "1-6",
  "8-0",
  "8-6",
  "9-0",
  "9-1",
  "9-5",
  "9-6",
])

export function TalentTreeSkeleton({ cols = 7, rows = 10 }: { cols?: number; rows?: number }) {
  const w = (cols - 1) * CELL_SIZE + NODE_SIZE
  const h = (rows - 1) * CELL_SIZE + NODE_SIZE

  return (
    <div className="flex justify-center">
      <div
        className="relative"
        style={{
          width: w,
          height: h,
        }}
      >
        {Array.from(
          {
            length: rows,
          },
          (_, row) =>
            Array.from(
              {
                length: cols,
              },
              (_, col) => {
                if (SKIP.has(`${row}-${col}`)) return null
                return (
                  <Skeleton
                    key={`${row}-${col}`}
                    className="absolute rounded-sm"
                    style={{
                      width: NODE_SIZE,
                      height: NODE_SIZE,
                      left: col * CELL_SIZE,
                      top: row * CELL_SIZE,
                    }}
                  />
                )
              },
            ),
        )}
      </div>
    </div>
  )
}

/**
 * Renders a class or spec talent tree as positioned nodes with edges.
 * Layout uses fixed CELL_SIZE grid (lib/utils/talent-tree.ts).
 *
 * Hero trees use `apexExtra` to render an additional apex node row.
 * `onlyChoicePct` and `fullOpacity` are character-page modes that disable
 * meta stat shading.
 */
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
  const nodeMap = useMemo(
    () => buildNodeMap(talents),
    [
      talents,
    ],
  )
  const nodes = useMemo(
    () => Array.from(nodeMap.values()),
    [
      nodeMap,
    ],
  )
  const layout = useMemo(
    () =>
      computeTreeLayout(nodes, {
        apexExtra,
        apexCircle,
      }),
    [
      nodes,
      apexExtra,
      apexCircle,
    ],
  )
  const edgeSet = useMemo(
    () => buildEdgeSet(talents),
    [
      talents,
    ],
  )

  if (nodes.length === 0) return null

  const { svgW, svgH, maxRow, botApex, nodeCX, nodeY } = layout
  const useApex = apexCircle && botApex

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
