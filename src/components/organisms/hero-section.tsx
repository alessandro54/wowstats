"use client"

import type { MetaTalent } from "@/lib/api"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useState } from "react"
import { CornerPeel } from "@/components/atoms/corner-peel"
import { TalentCard } from "@/components/atoms/talent-card"
import { HeroTree } from "@/components/molecules/hero-tree"
import { splitHeroTrees } from "@/lib/utils/talent-tree"

interface Props {
  heroEntries: MetaTalent[]
  activeColor: string
  classSlug: WowClassSlug
  hideStats?: boolean
}

export function HeroSection({ heroEntries, activeColor, classSlug, hideStats }: Props) {
  const trees = splitHeroTrees(heroEntries)
  const [flipped, setFlipped] = useState(false)

  if (trees.length === 0) return null

  const primary = trees[0]
  const alt = trees[1]
  const altPct = alt ? Math.max(...alt.map((t) => t.usage_pct)).toFixed(0) : null
  const primaryPct = Math.max(...primary.map((t) => t.usage_pct)).toFixed(0)

  const toggle = () => setFlipped((f) => !f)

  return (
    <section className="w-full space-y-3 lg:w-auto">
      <h2 className="text-center text-lg font-semibold lg:text-left">Hero Talents</h2>

      <div
        className="relative inline-block"
        style={{
          perspective: "1200px",
        }}
      >
        <div
          className="relative transition-transform duration-500 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Both faces stacked in a grid so the taller one sizes the container */}
          <div
            className="grid items-stretch [&>*]:col-start-1 [&>*]:row-start-1"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front — primary tree */}
            <TalentCard
              classSlug={classSlug}
              className={`flex items-center justify-center p-4 ${flipped ? "pointer-events-none" : ""}`}
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              <HeroTree talents={primary} activeColor={activeColor} hideStats={hideStats} />
            </TalentCard>

            {/* Back — alt tree */}
            {alt && (
              <TalentCard
                classSlug={classSlug}
                className={`flex flex-col items-center justify-center p-4 ${!flipped ? "pointer-events-none" : ""}`}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {!hideStats && (
                  <p className="text-muted-foreground mb-3 text-center font-mono text-xs">
                    Alt · {altPct}%
                  </p>
                )}
                <HeroTree talents={alt} activeColor={activeColor} hideStats={hideStats} />
              </TalentCard>
            )}
          </div>
        </div>

        {/* Corner peel — shows opposite side label */}
        {!hideStats && alt && (
          <CornerPeel
            activeColor={activeColor}
            onClick={toggle}
            label={flipped ? `Main\n${primaryPct}%` : `Alt\n${altPct}%`}
          />
        )}
      </div>
    </section>
  )
}
