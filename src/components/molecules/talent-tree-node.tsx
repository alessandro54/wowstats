import type { TalentNode } from "@/lib/utils/talent-tree"
import Image from "next/image"
import { TalentIcon } from "@/components/atoms/talent-icon"
import { BORDER_BIS, BORDER_DEFAULT, BORDER_SITUATIONAL, NODE_SIZE } from "@/lib/utils/talent-tree"

interface Props {
  node: TalentNode
  left: number
  top: number
  budget?: number
  fullOpacity: boolean
  onlyChoicePct: boolean
  activeColor: string
}

export function TalentNodeCard({
  node,
  left,
  top,
  budget,
  fullOpacity,
  onlyChoicePct,
  activeColor,
}: Props) {
  const tier = node.primary.tier ?? (node.all.some((t) => t.in_top_build) ? "bis" : "common")
  const isBis = tier === "bis"
  const isSituational = tier === "situational"
  const isRelevant = isBis || isSituational
  const inTopBuild = fullOpacity || isRelevant
  const opacity = fullOpacity || isBis ? 1 : isSituational ? 0.75 : 0.25
  const isFree = node.defaultPoints >= node.maxRank
  const borderClass = budget
    ? isFree
      ? BORDER_DEFAULT
      : isBis
        ? BORDER_BIS
        : isSituational
          ? BORDER_SITUATIONAL
          : undefined
    : undefined
  const isPartialRank =
    inTopBuild &&
    node.maxRank > 1 &&
    node.primary.top_build_rank > node.defaultPoints &&
    node.primary.top_build_rank < node.maxRank

  const alternatives = node.isChoice
    ? node.all.filter((t) => t.talent.id !== node.primary.talent.id)
    : []

  const tooltipContent = (
    <div className={alternatives.length > 0 ? "flex gap-4" : ""}>
      {/* Main panel */}
      <div className="min-w-36 space-y-1.5">
        <div className="flex items-center gap-2">
          {node.primary.talent.icon_url && (
            <Image
              src={node.primary.talent.icon_url}
              width={50}
              height={50}
              className="shrink-0 rounded-full"
              alt={node.primary.talent.name}
              unoptimized
            />
          )}
          <span className="text-xs leading-tight font-semibold">{node.primary.talent.name}</span>
        </div>
        {node.maxRank > 1 && (
          <p className="text-muted-foreground text-[10px]">{node.maxRank} ranks</p>
        )}
        {node.primary.talent.description && (
          <p className="text-muted-foreground max-w-52 text-[11px] leading-snug">
            {node.primary.talent.description}
          </p>
        )}
        <p
          className="font-mono text-[11px] font-bold"
          style={{
            color: activeColor,
          }}
        >
          {node.primary.usage_pct.toFixed(1)}%
        </p>
      </div>

      {/* Alternatives panel (choice nodes) */}
      {alternatives.length > 0 && (
        <div className="border-border/50 min-w-36 space-y-1.5 border-l pl-4">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            Alternative
          </p>
          {alternatives.map((t) => (
            <div key={t.talent.id} className="flex items-center gap-2">
              {t.talent.icon_url && (
                <Image
                  src={t.talent.icon_url}
                  width={16}
                  height={16}
                  className="shrink-0 rounded opacity-80"
                  alt=""
                  unoptimized
                />
              )}
              <span className="flex-1 truncate text-xs">{t.talent.name}</span>
              <span className="text-muted-foreground shrink-0 font-mono text-[11px]">
                {t.usage_pct.toFixed(1)}%
              </span>
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
      style={{
        left,
        top,
        width: NODE_SIZE,
      }}
    >
      {/* Solid background blocks SVG lines from showing through dimmed icons */}
      <div
        className="relative"
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
        }}
      >
        <div className="bg-background absolute inset-0 rounded" />
        <div
          style={{
            opacity,
          }}
        >
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
          className="font-mono text-[10px] leading-none font-bold text-slate-600 tabular-nums dark:text-white"
          style={{
            opacity,
          }}
        >
          {node.primary.usage_pct.toFixed(0)}%
        </span>
      )}
      {node.isChoice && (
        <span
          className="text-muted-foreground text-[9px] leading-none"
          style={{
            opacity,
          }}
        >
          choice
        </span>
      )}
    </div>
  )
}
