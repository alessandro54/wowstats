"use client"

import type { MetaTalent } from "@/lib/api"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import Image from "next/image"
import { useState } from "react"
import { TalentCard } from "@/components/atoms/talent-card"
import { TalentIcon } from "@/components/atoms/talent-icon"
import { BORDER_SITUATIONAL } from "@/lib/utils/talent-tree"
import { cn } from "@/lib/utils"

const GOLD_BORDER = "border-amber-400 dark:border-amber-300 border-2"
const ICON_SIZE = 36

interface Props {
  talents: MetaTalent[]
  activeColor: string
  classSlug: WowClassSlug
}

export function PvpTalents({ talents, activeColor, classSlug }: Props) {
  const [hovered, setHovered] = useState(false)
  const sorted = [...talents].sort((a, b) => b.usage_pct - a.usage_pct)
  const top3 = sorted.slice(0, 3)
  const others = sorted.slice(3)
  const situational = others.filter(t => t.usage_pct > 20)
  const rest = others.filter(t => t.usage_pct <= 20)

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="mb-3 text-center text-sm font-semibold">PvP Talents</h2>
      <TalentCard classSlug={classSlug} className="p-3">
        <div className="flex flex-col items-center gap-2">
          {top3.map(t => (
            <div
              key={t.talent.id}
              className="flex flex-col items-center gap-0.5"
            >
              <TalentIcon
                talent={t}
                size={ICON_SIZE}
                activeColor={activeColor}
                borderClass={GOLD_BORDER}
                tooltipContent={<TalentTooltip talent={t} activeColor={activeColor} />}
              />
              <span className="font-mono text-[10px] font-bold tabular-nums text-amber-400">
                {t.usage_pct.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </TalentCard>

      {(situational.length > 0 || rest.length > 0) && (
        <div
          className={cn(
            "absolute left-0 z-30 transition-all duration-200",
            hovered ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{ top: 0, left: "100%", paddingLeft: 8 }}
        >
          <TalentCard classSlug={classSlug} className="p-3">
            <div className="flex flex-col items-center gap-2">
              {situational.length > 0 && (
                <>
                  <span className="text-[9px] font-medium uppercase tracking-wider text-purple-400">
                    situational
                  </span>
                  {situational.map(t => (
                    <div
                      key={t.talent.id}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <TalentIcon
                        talent={t}
                        size={ICON_SIZE}
                        activeColor={activeColor}
                        borderClass={BORDER_SITUATIONAL}
                        tooltipContent={<TalentTooltip talent={t} activeColor={activeColor} />}
                      />
                      <span className="font-mono text-[10px] font-bold tabular-nums text-purple-400">
                        {t.usage_pct.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </>
              )}
              {rest.length > 0 && (
                <>
                  {rest.map(t => (
                    <div
                      key={t.talent.id}
                      className="flex flex-col items-center gap-0.5 opacity-50"
                    >
                      <TalentIcon
                        talent={t}
                        size={ICON_SIZE}
                        activeColor={activeColor}
                        tooltipContent={<TalentTooltip talent={t} activeColor={activeColor} />}
                      />
                      <span className="font-mono text-[10px] font-bold tabular-nums text-muted-foreground">
                        {t.usage_pct.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </TalentCard>
        </div>
      )}
    </div>
  )
}

function TalentTooltip({ talent, activeColor }: { talent: MetaTalent, activeColor: string }) {
  return (
    <div className="min-w-36 space-y-1.5">
      <div className="flex items-center gap-2">
        {talent.talent.icon_url && (
          <Image
            src={talent.talent.icon_url}
            width={50}
            height={50}
            className="shrink-0 rounded-full"
            alt={talent.talent.name}
            unoptimized
          />
        )}
        <span className="text-xs font-semibold leading-tight">{talent.talent.name}</span>
      </div>
      {talent.talent.description && (
        <p className="text-muted-foreground max-w-52 text-[11px] leading-snug">
          {talent.talent.description}
        </p>
      )}
      <p className="font-mono text-[11px] font-bold" style={{ color: activeColor }}>
        {talent.usage_pct.toFixed(1)}%
      </p>
    </div>
  )
}
