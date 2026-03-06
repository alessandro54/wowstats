"use client"

import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import type { MetaTalent } from "@/lib/api"
import { TalentCard } from "@/components/atoms/talent-card"
import { PvpTalents } from "@/components/molecules/pvp-talents"
import { TalentList } from "@/components/molecules/talent-list"
import { HeroSection } from "@/components/organisms/hero-section"
import { hasTreeData, TalentTree } from "@/components/organisms/talent-tree"
import { useActiveColor } from "@/hooks/use-active-color"

const TYPE_LABELS: Record<string, string> = {
  spec: "Spec Talents",
  class: "Class Talents",
  hero: "Hero Talents",
  pvp: "PvP Talents",
}

interface Props {
  classSlug: WowClassSlug
  talents: MetaTalent[]
}

export function Talents({ classSlug, talents }: Props) {
  const activeColor = useActiveColor(classSlug)

  if (talents.length === 0)
    return null

  const byType = Map.groupBy(talents, t => t.talent.talent_type)

  const specEntries = byType.get("spec")
  const classEntries = byType.get("class")
  const heroEntries = byType.get("hero")
  const pvpEntries = byType.get("pvp")

  const renderTree = (entries: MetaTalent[]) =>
    hasTreeData(entries)
      ? (
          <TalentTree talents={entries} activeColor={activeColor} budget={34} />
        )
      : (
          <TalentList talents={entries} activeColor={activeColor} />
        )

  return (
    <div className="space-y-8">
      {/* hero always centered, pvp below on mobile, floating right on lg+ */}
      {(heroEntries || pvpEntries) && (
        <div className="flex flex-col items-center">
          <div className="relative inline-flex flex-col items-center md:block">
            {heroEntries && (
              <HeroSection heroEntries={heroEntries} activeColor={activeColor} classSlug={classSlug} />
            )}
            {pvpEntries && (
              <div className="mt-6 md:absolute md:top-1/2 md:z-20 md:mt-0 md:left-[calc(100%+50px)] md:-translate-y-1/2">
                <PvpTalents talents={pvpEntries} activeColor={activeColor} classSlug={classSlug} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* class + spec */}
      {(classEntries?.length || specEntries?.length) && (
        <div className="sm:overflow-x-auto">
          <div className="flex flex-col items-stretch gap-6 sm:min-w-max sm:flex-row">
            {classEntries && (
              <div className="flex flex-1 flex-col">
                <h2 className="mb-3 text-center text-lg font-semibold">{TYPE_LABELS.class}</h2>
                <TalentCard classSlug={classSlug} className="flex flex-1 flex-col overflow-x-auto">
                  {renderTree(classEntries)}
                </TalentCard>
              </div>
            )}
            {specEntries && (
              <div className="flex flex-1 flex-col">
                <h2 className="mb-3 text-center text-lg font-semibold">{TYPE_LABELS.spec}</h2>
                <TalentCard classSlug={classSlug} className="flex flex-1 flex-col overflow-x-auto">
                  {renderTree(specEntries)}
                </TalentCard>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
