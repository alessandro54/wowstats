"use client"

import { useActiveColor } from "@/hooks/use-active-color"
import type { WowClassSlug } from "@/config/wow/classes"
import type { MetaTalent } from "@/lib/api"
import { TalentTree, hasTreeData } from "@/components/organisms/talent-tree"
import { TalentList } from "@/components/molecules/talent-list"
import { HeroSection } from "@/components/organisms/hero-section"

const TYPE_LABELS: Record<string, string> = {
  spec: "Spec Talents",
  class: "Class Talents",
  hero: "Hero Talents",
  pvp: "PvP Talents",
}

type Props = {
  classSlug: WowClassSlug
  talents: MetaTalent[]
}

export function Talents({ classSlug, talents }: Props) {
  const activeColor = useActiveColor(classSlug)

  if (talents.length === 0) return null

  const byType = Map.groupBy(talents, (t) => t.talent.talent_type)

  const specEntries = byType.get("spec")
  const classEntries = byType.get("class")
  const heroEntries = byType.get("hero")
  const pvpEntries = byType.get("pvp")

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

      {/* class + spec */}
        {(classEntries?.length || specEntries?.length) && (
        <div className="sm:overflow-x-auto">
          <div className="flex flex-col sm:flex-row gap-6 sm:min-w-max items-stretch">
            {classEntries && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-center mb-3">{TYPE_LABELS.class}</h2>
                <section className="flex-1 flex flex-col overflow-x-auto p-4 border border-border/40 bg-card/30 backdrop-blur-sm rounded-xl">
                  {renderTree(classEntries)}
                </section>
              </div>
            )}
            {specEntries && (
              <div className="flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-center mb-3">{TYPE_LABELS.spec}</h2>
                <section className="flex-1 flex flex-col overflow-x-auto p-4 border border-border/40 bg-card/30 backdrop-blur-sm rounded-xl">
                  {renderTree(specEntries)}
                </section>
              </div>
            )}
          </div>
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
