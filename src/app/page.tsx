import { Suspense } from "react"
import { LazySection } from "@/components/atoms/lazy-section"
import { ScrollHint } from "@/components/atoms/scroll-hint"
import { HomeBgCanvas } from "@/components/molecules/home-bg-canvas"
import type { BracketSummary } from "@/components/molecules/home-bracket-cards"
import { HomeBracketCards } from "@/components/molecules/home-bracket-cards"
import { HomeClassGrid } from "@/components/molecules/home-class-grid"
import { HomeHero } from "@/components/molecules/home-hero"
import { tier, tierByPercentile } from "@/config/app-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { fetchClassDistribution } from "@/lib/api"

export const dynamic = "force-dynamic"

const BRACKETS = [
  {
    bracket: "2v2",
    label: "2v2",
  },
  {
    bracket: "3v3",
    label: "3v3",
  },
  {
    bracket: "shuffle-overall",
    label: "Solo Shuffle",
  },
  {
    bracket: "blitz-overall",
    label: "Blitz",
  },
]

const SOLO_BRACKETS = [
  "shuffle-overall",
  "blitz-overall",
]

const classMap = new Map(
  WOW_CLASSES.map((c) => [
    c.slug,
    c,
  ]),
)

function normalizeClassSlug(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-")
}

function normalizeSpecName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[-_\s]/g, "")
}

function findSpecIcon(classSlug: string, specSlug: string): string | undefined {
  const cls = classMap.get(classSlug as WowClassSlug)
  return cls?.specs.find((s) => normalizeSpecName(s.name) === normalizeSpecName(specSlug))?.iconUrl
}

async function HomeContent() {
  const results = await Promise.all(
    BRACKETS.map(({ bracket }) =>
      fetchClassDistribution({
        bracket,
        region: "all",
        role: "all",
      }).catch(() => null),
    ),
  )

  let seasonId = 41
  let totalEntries = 0
  const bracketSummaries: BracketSummary[] = []
  let sPlusSpec:
    | {
        specName: string
        className: string
        bracket: string
        wrHat: number
        presence: number
        iconUrl?: string
        color: string
        specUrl: string
      }
    | undefined

  for (let i = 0; i < BRACKETS.length; i++) {
    const { bracket, label } = BRACKETS[i]
    const data = results[i]
    if (!data) {
      bracketSummaries.push({
        bracket,
        label,
        totalEntries: 0,
        href: `/pvp/meta/${bracket}/dps`,
        topSpecs: [],
      })
      continue
    }

    seasonId = data.season_id
    totalEntries += data.total_entries

    const sorted = [
      ...data.classes,
    ].sort((a, b) => b.score - a.score)
    const dps = sorted.filter((s) => s.role === "dps")
    const maxScore = dps[0]?.score ?? 1
    const isSolo = SOLO_BRACKETS.includes(bracket)

    const topSpecs = dps.slice(0, 3).map((spec) => {
      const classSlug = normalizeClassSlug(spec.class)
      return {
        specName: spec.spec,
        className: spec.class,
        iconUrl: findSpecIcon(classSlug, spec.spec),
        color: `var(--color-class-${classSlug})`,
        wrHat: spec.wr_hat,
      }
    })

    bracketSummaries.push({
      bracket,
      label,
      totalEntries: data.total_entries,
      href: `/pvp/meta/${bracket}/dps`,
      topSpecs,
    })

    if (dps.length > 0 && !sPlusSpec) {
      const topDps = dps[0]
      const normPct = (topDps.score / maxScore) * 100
      const t = isSolo ? tierByPercentile(1, dps.length) : tier(normPct)
      if (t === "S+") {
        const classSlug = normalizeClassSlug(topDps.class)
        const presenceTotal = sorted.reduce((s, r) => s + r.count, 0)
        sPlusSpec = {
          specName: topDps.spec,
          className: topDps.class,
          bracket,
          wrHat: topDps.wr_hat,
          presence: presenceTotal > 0 ? topDps.count / presenceTotal : 0,
          iconUrl: findSpecIcon(classSlug, topDps.spec),
          color: `var(--color-class-${classSlug})`,
          specUrl: `/pvp/meta/${bracket}/dps`,
        }
      }
    }
  }

  return (
    <>
      <div className="animate-stream-in relative z-[2] flex min-h-[calc(100dvh-3.75rem)] items-center justify-center px-4 py-12 lg:px-6">
        <HomeHero seasonId={seasonId} totalEntries={totalEntries} sPlus={sPlusSpec} />
        <ScrollHint />
      </div>
      <LazySection className="animate-stream-in relative z-[2] mx-auto w-full max-w-5xl space-y-10 px-4 pb-16 lg:px-6">
        <HomeBracketCards brackets={bracketSummaries} />
        <HomeClassGrid classes={WOW_CLASSES} />
      </LazySection>
    </>
  )
}

export default function Home() {
  return (
    <div className="animate-page-in relative">
      <HomeBgCanvas />
      <Suspense
        fallback={
          <div className="relative z-[2] flex min-h-[calc(100dvh-3.75rem)] items-center justify-center">
            <ScrollHint />
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </div>
  )
}
