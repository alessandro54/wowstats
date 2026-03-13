import type { TalentNode } from "@/lib/utils/talent-tree"
import { TalentIcon } from "@/components/atoms/talent-icon"
import { TalentNodeTooltip } from "@/components/atoms/talent-node-tooltip"
import { APEX_NODE_SIZE, NODE_SIZE } from "@/lib/utils/talent-tree"
import {
  bestTier,
  buildRankBars,
  displayUsagePct,
  investedRank as computeInvestedRank,
  metaBorderClass,
} from "@/lib/utils/talent-node-utils"

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

// ── Choice chevrons ────────────────────────────────────────────────────────

function ChoiceChevrons({ activeColor }: { activeColor: string }) {
  return (
    <>
      <svg
        className="pointer-events-none absolute"
        style={{
          left: -8,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        width="6"
        height="10"
        viewBox="0 0 6 10"
      >
        <path
          d="M5 1 L1 5 L5 9"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <svg
        className="pointer-events-none absolute"
        style={{
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        width="6"
        height="10"
        viewBox="0 0 6 10"
      >
        <path
          d="M1 1 L5 5 L1 9"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

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
    inTopBuild && node.maxRank > 1 && invested > node.defaultPoints && invested < node.maxRank

  const rankBars = buildRankBars(node)
  const maxBarPct = rankBars ? Math.max(...rankBars.map((b) => b.pct), 1) : 0

  const isVariable = node.isChoice || node.isRanked
  const showPct = (!inTopBuild || isVariable) && (!onlyChoicePct || isVariable)
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
      </div>

      {/* Meta: usage % below node */}
      {!hideStats && showPct && (
        <span
          className="font-mono text-[10px] leading-none font-bold text-slate-600 tabular-nums dark:text-white"
          style={{
            opacity,
          }}
        >
          {displayUsagePct(node).toFixed(0)}%
        </span>
      )}
      {!hideStats && node.isChoice && (
        <span
          className="text-muted-foreground text-[9px] leading-none"
          style={{
            opacity,
          }}
        >
          choice
        </span>
      )}

      {/* Character: invested rank below node */}
      {hideStats && node.maxRank > 1 && invested > 0 && (
        <span
          className="font-mono text-[10px] leading-none font-bold tabular-nums"
          style={{
            color: activeColor,
            opacity,
          }}
        >
          {invested}/{node.maxRank}
        </span>
      )}
    </div>
  )
}
