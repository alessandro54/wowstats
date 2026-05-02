"use client"

import { SectionTitle } from "@/components/atoms/section-title"
import { TalentCard } from "@/components/atoms/talent-card"
import { PvpTalents } from "@/components/molecules/pvp-talents"
import { TalentList } from "@/components/molecules/talent-list"
import { Badge } from "@/components/ui/badge"
import { HeroSection } from "@/components/organisms/hero-section"
import { hasTreeData, TalentTree } from "@/components/organisms/talent-tree"
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
  /** Spec id of the page being rendered. Used to scope hero-tree options. */
  specId?: number
  talents: MetaTalent[]
  talentsMeta?: TalentsMeta
  hideStats?: boolean
}

/**
 * Top-level talent display orchestrator. Splits talents into class tree, spec
 * tree, hero trees, and PvP talents. Used by both character profile and spec
 * meta pages — `hideStats` toggles meta-stats columns for character page.
 */
export function Talents({ classSlug, specId, talents, talentsMeta, hideStats }: Props) {
  const activeColor = useActiveColor(classSlug)

  const safeTalents = Array.isArray(talents) ? talents : []

  if (safeTalents.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border/30 bg-card/20 py-16">
        <p className="text-sm text-muted-foreground">No talent data available for this bracket.</p>
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
      {talentsMeta && talentsMeta.data_confidence !== "high" && (
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
              <SectionTitle>{TYPE_LABELS.hero}</SectionTitle>
              <div
                className={`grid grid-cols-1 gap-6 lg:grid-cols-[auto_auto] lg:items-center lg:gap-10 ${
                  hideStats
                    ? "place-items-start lg:justify-start"
                    : "place-items-center lg:justify-center"
                }`}
              >
                <HeroSection
                  heroEntries={heroEntries}
                  activeColor={activeColor}
                  classSlug={classSlug}
                  specId={specId}
                  hideStats={hideStats}
                />
                {pvpEntries && (
                  <PvpTalents
                    talents={pvpEntries}
                    activeColor={activeColor}
                    classSlug={classSlug}
                    hideStats={hideStats}
                    vertical={hideStats}
                  />
                )}
              </div>
            </div>
          )}
          <div className="flex items-start justify-center gap-8">
            {classEntries && (
              <div className="flex flex-col">
                <SectionTitle>{TYPE_LABELS.class}</SectionTitle>
                <TalentCard classSlug={classSlug} className="flex flex-col overflow-x-auto">
                  {renderTree(classEntries)}
                </TalentCard>
              </div>
            )}
            {specEntries && (
              <div className="flex flex-col">
                <SectionTitle>{TYPE_LABELS.spec}</SectionTitle>
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
          <div
            className={`grid grid-cols-1 gap-6 lg:grid-cols-[auto_auto] lg:items-center lg:gap-10 ${
              hideStats
                ? "place-items-start lg:justify-start"
                : "place-items-center lg:justify-center"
            }`}
          >
            {heroEntries && (
              <HeroSection
                heroEntries={heroEntries}
                activeColor={activeColor}
                classSlug={classSlug}
                specId={specId}
                hideStats={hideStats}
              />
            )}
            {pvpEntries && (
              <PvpTalents
                talents={pvpEntries}
                activeColor={activeColor}
                classSlug={classSlug}
                hideStats={hideStats}
                vertical={hideStats}
              />
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
                <SectionTitle>{TYPE_LABELS.class}</SectionTitle>
                <TalentCard classSlug={classSlug} className="flex flex-1 flex-col overflow-x-auto">
                  {renderTree(classEntries)}
                </TalentCard>
              </div>
            )}
            {specEntries && (
              <div className="flex flex-1 flex-col">
                <SectionTitle>{TYPE_LABELS.spec}</SectionTitle>
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
