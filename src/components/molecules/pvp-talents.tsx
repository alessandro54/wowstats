"use client"

import { PvpTalentTooltip } from "@/components/atoms/pvp-talent-tooltip"
import { SectionTitle } from "@/components/atoms/section-title"
import { TalentCard } from "@/components/atoms/talent-card"
import { TalentIcon } from "@/components/atoms/talent-icon"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import type { MetaTalent } from "@/lib/api"
import { BORDER_BIS, BORDER_SITUATIONAL } from "@/lib/utils/talent-tree"

// Top 3 = the meta picks; render large + bordered. Others in a compact grid.
const ICON_SIZE_TOP = 56
const ICON_SIZE_REST = 36

interface Props {
  talents: MetaTalent[]
  activeColor: string
  classSlug: WowClassSlug
  hideStats?: boolean
  /**
   * Stack the top 3 meta picks vertically instead of side-by-side. Used on
   * the character page where horizontal real estate is tighter and the PvP
   * card sits beside a wider talent tree.
   */
  vertical?: boolean
}

export function PvpTalents({ talents, activeColor, classSlug, hideStats, vertical }: Props) {
  const sorted = [
    ...talents,
  ].sort((a, b) => b.usage_pct - a.usage_pct)
  const top3 = sorted.slice(0, 3)
  const others = sorted.slice(3)

  return (
    <section className="relative">
      <SectionTitle>PvP Talents</SectionTitle>
      <TalentCard classSlug={classSlug} className="p-4">
        <div className="flex flex-col items-center gap-3">
          {/* Top 3 — meta picks, large icons with legendary border. Layout
              flips to vertical when the parent has limited horizontal space. */}
          <div
            className={
              vertical
                ? "flex flex-col items-center gap-3"
                : "flex flex-row items-start justify-center gap-3"
            }
          >
            {top3.map((t) => (
              <div key={t.talent.id} className="flex flex-col items-center gap-1">
                <TalentIcon
                  talent={t}
                  size={ICON_SIZE_TOP}
                  activeColor={activeColor}
                  borderClass={BORDER_BIS}
                  tooltipContent={<PvpTalentTooltip talent={t} activeColor={activeColor} />}
                />
                {!hideStats && (
                  <span className="font-mono text-xs font-bold tabular-nums text-[var(--color-quality-legendary)]">
                    {t.usage_pct.toFixed(0)}%
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Rest — compact grid below. Situational gets purple border, the
              tail (usage <= 20%) keeps a neutral look + reduced opacity.    */}
          {others.length > 0 && (
            <>
              <div className="h-px w-3/4 bg-border/50" />
              <div className="grid grid-cols-4 gap-2">
                {others.map((t) => {
                  const isSituational = t.usage_pct > 20
                  return (
                    <div
                      key={t.talent.id}
                      className={`flex flex-col items-center gap-0.5 ${isSituational ? "" : "opacity-60"}`}
                    >
                      <TalentIcon
                        talent={t}
                        size={ICON_SIZE_REST}
                        activeColor={activeColor}
                        borderClass={isSituational ? BORDER_SITUATIONAL : undefined}
                        tooltipContent={<PvpTalentTooltip talent={t} activeColor={activeColor} />}
                      />
                      {!hideStats && (
                        <span
                          className={`font-mono text-[10px] font-bold tabular-nums ${
                            isSituational ? "text-purple-400" : "text-muted-foreground"
                          }`}
                        >
                          {t.usage_pct.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </TalentCard>
    </section>
  )
}
