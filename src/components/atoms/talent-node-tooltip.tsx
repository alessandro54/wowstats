import type { TalentNode } from "@/lib/utils/talent-tree"
import type { RankBar } from "@/lib/utils/talent-node-utils"
import Image from "next/image"

interface Props {
  node: TalentNode
  investedRank: number
  activeColor: string
  hideStats?: boolean
  rankBars: RankBar[] | null
  maxBarPct: number
}

export function TalentNodeTooltip({
  node,
  investedRank,
  activeColor,
  hideStats,
  rankBars,
  maxBarPct,
}: Props) {
  const alternatives = node.isChoice
    ? node.all.filter((t) => t.talent.id !== node.primary.talent.id)
    : []

  return (
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
          <div>
            <span className="text-xs leading-tight font-semibold">{node.primary.talent.name}</span>
            {node.maxRank > 1 && investedRank > 0 && (
              <p className="text-muted-foreground text-[10px]">
                Rank {investedRank}/{node.maxRank}
              </p>
            )}
          </div>
        </div>
        {node.primary.talent.description && (
          <p className="text-muted-foreground max-w-52 text-[11px] leading-snug">
            {node.primary.talent.description}
          </p>
        )}
        {!hideStats && !rankBars && (
          <p
            className="font-mono text-[11px] font-bold"
            style={{
              color: activeColor,
            }}
          >
            {node.primary.usage_pct.toFixed(1)}%
          </p>
        )}
      </div>

      {/* Rank distribution bars (meta only) */}
      {!hideStats && rankBars && (
        <div className="mt-2 space-y-1 border-t border-border/50 pt-2">
          {rankBars.map((bar, i) => (
            <div key={bar.label} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground w-6 text-[11px]">{bar.label}</span>
              <div className="bg-muted/30 relative h-1.5 w-20 overflow-hidden rounded-full">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${(bar.pct / maxBarPct) * 100}%`,
                    backgroundColor: activeColor,
                    opacity: 0.4 + (i / (rankBars.length - 1)) * 0.6,
                  }}
                />
              </div>
              <span
                className="shrink-0 font-mono text-[11px] font-bold tabular-nums"
                style={{
                  color: activeColor,
                }}
              >
                {bar.pct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Alternatives panel (meta, choice nodes) */}
      {!hideStats && alternatives.length > 0 && (
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
}
