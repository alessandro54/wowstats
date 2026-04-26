"use client"

import { TalentCard } from "@/components/atoms/talent-card"
import { PvpTalents } from "@/components/molecules/pvp-talents"
import { TalentList } from "@/components/molecules/talent-list"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/organisms/hero-section"
import { hasTreeData, TalentTree, TalentTreeSkeleton } from "@/components/organisms/talent-tree"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { useActiveColor } from "@/hooks/use-active-color"
import type { MetaTalent, TalentsMeta } from "@/lib/api"

const TYPE_LABELS: Record<string, string> = {
  spec: "Spec Talents",
  class: "Class Talents",
  hero: "Hero Talents",
  pvp: "PvP Talents",
}

interface Props {
  classSlug: WowClassSlug
  talents: MetaTalent[]
  talentsMeta?: TalentsMeta
  hideStats?: boolean
}

export function Talents({ classSlug, talents, talentsMeta, hideStats }: Props) {
  const activeColor = useActiveColor(classSlug)

  const safeTalents = Array.isArray(talents) ? talents : []

  if (safeTalents.length === 0) {
    return (
      <div className="sm:overflow-x-auto">
        <div className="flex flex-col items-stretch gap-6 sm:min-w-max sm:flex-row">
          {(
            [
              "Class Talents",
              "Spec Talents",
            ] as const
          ).map((label) => (
            <div key={label} className="flex flex-1 flex-col">
              <h2 className="mb-3 text-center text-lg font-semibold">{label}</h2>
              <div className="rounded-xl border p-4">
                <TalentTreeSkeleton />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const byType = Map.groupBy(safeTalents, (t) => t.talent.talent_type)

  const specEntries = byType.get("spec")
  const classEntries = byType.get("class")
  const heroEntries = byType.get("hero")
  const pvpEntries = byType.get("pvp")

  const renderTree = (entries: MetaTalent[], apexCircle?: boolean) =>
    hasTreeData(entries) ? (
      <TalentTree
        talents={entries}
        activeColor={activeColor}
        budget={hideStats ? undefined : 34}
        hideStats={hideStats}
        apexCircle={apexCircle}
      />
    ) : (
      <TalentList talents={entries} activeColor={activeColor} hideStats={hideStats} />
    )

  // On 2K+ screens all three trees sit side-by-side in one row.
  // Below that, hero stays in its own centered section.
  const allInOneRow = !!(heroEntries && (classEntries || specEntries))

  return (
    <div className="space-y-8">
      {talentsMeta?.data_confidence !== "high" && (
        <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
          {talentsMeta?.data_confidence === "low"
            ? "Limited data — may not reflect current patch"
            : "Partial data"}
        </Badge>
      )}
      {/* ── 2K+: hero at top, class + spec below ────────────── */}
      {allInOneRow && (
        <div className="hidden min-[1800px]:flex min-[1800px]:flex-col min-[1800px]:items-center min-[1800px]:gap-8">
          {heroEntries && (
            <div className="flex flex-col items-center">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1 text-center">
                {TYPE_LABELS.hero}
              </h2>
              <div className="relative inline-flex flex-col items-center md:block">
                <HeroSection
                  heroEntries={heroEntries}
                  activeColor={activeColor}
                  classSlug={classSlug}
                  hideStats={hideStats}
                />
                {pvpEntries && (
                  <div className="mt-6 md:absolute md:top-1/2 md:z-20 md:mt-0 md:left-[calc(100%+50px)] md:-translate-y-1/2">
                    <PvpTalents
                      talents={pvpEntries}
                      activeColor={activeColor}
                      classSlug={classSlug}
                      hideStats={hideStats}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex items-start justify-center gap-8">
            {classEntries && (
              <div className="flex flex-col">
                <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1 text-center">
                  {TYPE_LABELS.class}
                </h2>
                <TalentCard classSlug={classSlug} className="flex flex-col overflow-x-auto">
                  {renderTree(classEntries)}
                </TalentCard>
              </div>
            )}
            {specEntries && (
              <div className="flex flex-col">
                <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1 text-center">
                  {TYPE_LABELS.spec}
                </h2>
                <TalentCard classSlug={classSlug} className="flex flex-col overflow-x-auto">
                  {renderTree(specEntries, true)}
                </TalentCard>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Below 2K: hero centered at top ──────────────────── */}
      {(heroEntries || pvpEntries) && (
        <div
          className={
            allInOneRow
              ? "min-[1800px]:hidden flex flex-col items-center"
              : "flex flex-col items-center"
          }
        >
          <div className="relative inline-flex flex-col items-center md:block">
            {heroEntries && (
              <HeroSection
                heroEntries={heroEntries}
                activeColor={activeColor}
                classSlug={classSlug}
                hideStats={hideStats}
              />
            )}
            {pvpEntries && (
              <div className="mt-6 md:absolute md:top-1/2 md:z-20 md:mt-0 md:left-[calc(100%+50px)] md:-translate-y-1/2">
                <PvpTalents
                  talents={pvpEntries}
                  activeColor={activeColor}
                  classSlug={classSlug}
                  hideStats={hideStats}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Below 2K: class + spec row below hero ────────────── */}
      {(classEntries?.length || specEntries?.length) && (
        <div
          className={allInOneRow ? "min-[1800px]:hidden sm:overflow-x-auto" : "sm:overflow-x-auto"}
        >
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
                  {renderTree(specEntries, true)}
                </TalentCard>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
