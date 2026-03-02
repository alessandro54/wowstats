"use client"

import { useActiveColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes"
import type { MetaTalent } from "@/lib/api"
import { TalentTree, hasTreeData } from "./talent-tree"
import { TalentList } from "./talent-list"
import { HeroSection } from "./hero-section"

const TYPE_LABELS: Record<string, string> = {
  spec:  "Spec Talents",
  class: "Class Talents",
  hero:  "Hero Talents",
  pvp:   "PvP Talents",
}

type Props = {
  classSlug: WowClassSlug
  talents:   MetaTalent[]
}

export function Talents({ classSlug, talents }: Props) {
  const activeColor = useActiveColor(classSlug)

  if (talents.length === 0) return null

  const byType = Map.groupBy(talents, (t) => t.talent.talent_type)

  const specEntries  = byType.get("spec")
  const classEntries = byType.get("class")
  const heroEntries  = byType.get("hero")
  const pvpEntries   = byType.get("pvp")

  const renderTree = (entries: MetaTalent[]) =>
    hasTreeData(entries) ? (
      <TalentTree talents={entries} activeColor={activeColor} budget={34} />
    ) : (
      <TalentList talents={entries} activeColor={activeColor} />
    )

  return (
    <div className="space-y-8">
      {/* hero: dominant tree shown, alt revealed on hover */}
      {heroEntries && (
        <div className="flex flex-col items-center">
          <HeroSection heroEntries={heroEntries} activeColor={activeColor} />
        </div>
      )}

      {/* spec + class: stacked + centered on narrow; side by side on wide */}
      {(specEntries || classEntries) && (
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
          {classEntries && (
            <section className="space-y-3 w-full lg:w-auto">
              <h2 className="text-lg font-semibold text-center">
                {TYPE_LABELS.class}
              </h2>
              {renderTree(classEntries)}
            </section>
          )}
          {specEntries && (
            <section className="space-y-3 w-full lg:w-auto">
              <h2 className="text-lg font-semibold text-center">
                {TYPE_LABELS.spec}
              </h2>
              {renderTree(specEntries)}
            </section>
          )}
        </div>
      )}

      {/* pvp: always flat list */}
      {pvpEntries && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">{TYPE_LABELS.pvp}</h2>
          <TalentList talents={pvpEntries} activeColor={activeColor} />
        </section>
      )}
    </div>
  )
}
