"use client"

import type { MetaTalent } from "@/lib/api"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useState } from "react"
import { TalentCard } from "@/components/atoms/talent-card"
import { TalentIcon } from "@/components/atoms/talent-icon"
import { PvpTalentTooltip } from "@/components/atoms/pvp-talent-tooltip"
import { BORDER_SITUATIONAL } from "@/lib/utils/talent-tree"
import { cn } from "@/lib/utils"

const GOLD_BORDER = "border-amber-400 dark:border-amber-300 border-2"
const ICON_SIZE = 36

interface Props {
  talents: MetaTalent[]
  activeColor: string
  classSlug: WowClassSlug
  hideStats?: boolean
}

export function PvpTalents({ talents, activeColor, classSlug, hideStats }: Props) {
  const [hovered, setHovered] = useState(false)
  const sorted = [
    ...talents,
  ].sort((a, b) => b.usage_pct - a.usage_pct)
  const top3 = sorted.slice(0, 3)
  const others = sorted.slice(3)
  const situational = others.filter((t) => t.usage_pct > 20)
  const rest = others.filter((t) => t.usage_pct <= 20)

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="mb-3 text-center text-sm font-semibold">PvP Talents</h2>
      <TalentCard classSlug={classSlug} className="p-3">
        <div className="flex flex-col items-center gap-2">
          {top3.map((t) => (
            <div key={t.talent.id} className="flex flex-col items-center gap-0.5">
              <TalentIcon
                talent={t}
                size={ICON_SIZE}
                activeColor={activeColor}
                borderClass={GOLD_BORDER}
                tooltipContent={<PvpTalentTooltip talent={t} activeColor={activeColor} />}
              />
              {!hideStats && (
                <span className="font-mono text-[10px] font-bold tabular-nums text-amber-400">
                  {t.usage_pct.toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </TalentCard>

      {!hideStats && (situational.length > 0 || rest.length > 0) && (
        <div
          className={cn(
            "absolute left-0 z-30 transition-all duration-200",
            hovered ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{
            top: 0,
            left: "100%",
            paddingLeft: 8,
          }}
        >
          <TalentCard classSlug={classSlug} className="p-3">
            <div className="flex flex-col items-center gap-2">
              {situational.length > 0 && (
                <>
                  <span className="text-[9px] font-medium uppercase tracking-wider text-purple-400">
                    situational
                  </span>
                  {situational.map((t) => (
                    <div key={t.talent.id} className="flex flex-col items-center gap-0.5">
                      <TalentIcon
                        talent={t}
                        size={ICON_SIZE}
                        activeColor={activeColor}
                        borderClass={BORDER_SITUATIONAL}
                        tooltipContent={<PvpTalentTooltip talent={t} activeColor={activeColor} />}
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
                  {rest.map((t) => (
                    <div
                      key={t.talent.id}
                      className="flex flex-col items-center gap-0.5 opacity-50"
                    >
                      <TalentIcon
                        talent={t}
                        size={ICON_SIZE}
                        activeColor={activeColor}
                        tooltipContent={<PvpTalentTooltip talent={t} activeColor={activeColor} />}
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
