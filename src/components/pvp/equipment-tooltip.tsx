"use client"

import Image from "next/image"
import { useState, type ReactNode } from "react"
import type { MetaGem } from "@/lib/api"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { QUALITY_COLORS, getStatMeta } from "./equipment-config"

export type DistEntry = { name: string; icon_url?: string | null; quality?: string; pct: number }

const tooltipContentClass = "bg-card/20 backdrop-blur-2xl text-card-foreground border border-border/40 shadow-lg"
const tooltipArrowClass = "fill-transparent bg-transparent"

function DistList({ entries }: { entries: DistEntry[] }) {
  return (
    <div className="space-y-1">
      {entries.map((e, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {e.icon_url && (
            <Image src={e.icon_url} width={14} height={14} className="rounded shrink-0 opacity-80" alt="class icon" />
          )}
          <span className="text-xs truncate flex-1" style={{ color: e.quality ? QUALITY_COLORS[e.quality] : undefined }}>
            {e.name}
          </span>
          <span className="text-[11px] font-mono text-muted-foreground shrink-0">{e.pct.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export function DistributionTooltip({ entries, enchantEntries, activeColor, craftingStats, fiberGems }: {
  entries: DistEntry[]
  enchantEntries?: DistEntry[]
  activeColor: string
  craftingStats?: string[]
  fiberGems?: MetaGem[]
}) {
  const alternatives = entries.slice(1)
  const enchantAlternatives = enchantEntries?.slice(1)

  return (
    <div className={enchantEntries ? "flex gap-5" : "space-y-2.5 min-w-48"}>
      <div className="space-y-2.5 min-w-44">
        {alternatives.length > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Alternatives</p>
            <DistList entries={alternatives} />
          </>
        )}
        {craftingStats && craftingStats.length > 0 && (
          <div className="border-t border-border/50 pt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Crafted — top stats:</span>
            {craftingStats.map((stat) => {
              const { label, color } = getStatMeta(stat)
              return <span key={stat} className="text-[11px] font-semibold" style={{ color: color ?? "inherit" }}>{label}</span>
            })}
          </div>
        )}
        {fiberGems && fiberGems.length > 0 && (
          <div className="border-t border-border/50 pt-2 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fiber socket</p>
            {fiberGems.map((gem) => (
              <div key={gem.id} className="flex items-center justify-between gap-3">
                <span className="text-xs">{gem.item.name}</span>
                <span className="text-[11px] font-mono text-muted-foreground">{gem.usage_pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {enchantEntries && enchantAlternatives && enchantAlternatives.length > 0 && (
        <div className="space-y-2.5 min-w-40 border-l border-border/50 pl-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Enchant alternatives</p>
          <DistList entries={enchantAlternatives} />
        </div>
      )}
    </div>
  )
}

export function ClickableTooltip({ children, content, side, align }: {
  children: ReactNode
  content: ReactNode
  side: "left" | "bottom" | "top" | "right"
  align: "center" | "end" | "start"
}) {
  const [open, setOpen] = useState(false)
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild onClick={() => setOpen((v) => !v)}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} align={align} className={tooltipContentClass} arrowClassName={tooltipArrowClass}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
