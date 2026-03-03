import Image from "next/image"
import { TalentIcon } from "@/components/atoms/talent-icon"
import { BORDER_BIS, BORDER_SITUATIONAL, NODE_SIZE } from "@/lib/talent-tree-utils"
import type { TalentNode } from "@/lib/talent-tree-utils"

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
  const isPartialRank = inTopBuild && node.maxRank > 1 &&
    node.primary.top_build_rank > 0 && node.primary.top_build_rank < node.maxRank

  const alternatives = node.isChoice
    ? node.all.filter((t) => t.talent.id !== node.primary.talent.id)
    : []

  const tooltipContent = (
    <div className={alternatives.length > 0 ? "flex gap-4" : ""}>
      {/* Main panel */}
      <div className="space-y-1.5 min-w-36">
        <div className="flex items-center gap-2">
          {node.primary.talent.icon_url && (
            <Image
              src={node.primary.talent.icon_url}
              width={50}
              height={50}
              className="rounded-full shrink-0"
              alt={node.primary.talent.name}
              unoptimized
            />
          )}
          <span className="text-xs font-semibold leading-tight">{node.primary.talent.name}</span>
        </div>
        {node.maxRank > 1 && (
          <p className="text-[10px] text-muted-foreground">{node.maxRank} ranks</p>
        )}
        {node.primary.talent.description && (
          <p className="text-[11px] text-muted-foreground leading-snug max-w-52">
            {node.primary.talent.description}
          </p>
        )}
        <p className="text-[11px] font-mono font-bold" style={{ color: activeColor }}>
          {node.primary.usage_pct.toFixed(1)}%
        </p>
      </div>

      {/* Alternatives panel (choice nodes) */}
      {alternatives.length > 0 && (
        <div className="border-l border-border/50 pl-4 space-y-1.5 min-w-36">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Alternative</p>
          {alternatives.map((t) => (
            <div key={t.talent.id} className="flex items-center gap-2">
              {t.talent.icon_url && (
                <Image
                  src={t.talent.icon_url}
                  width={16}
                  height={16}
                  className="rounded shrink-0 opacity-80"
                  alt=""
                  unoptimized
                />
              )}
              <span className="text-xs flex-1 truncate">{t.talent.name}</span>
              <span className="text-[11px] font-mono text-muted-foreground shrink-0">{t.usage_pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
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
            partialRank={isPartialRank}
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
