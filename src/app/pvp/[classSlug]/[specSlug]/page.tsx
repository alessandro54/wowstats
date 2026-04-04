import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SpecBracketCards } from "@/components/molecules/spec-bracket-cards"
import { SpecWinRateChart } from "@/components/molecules/spec-winrate-chart"
import { SpecDistributionChart } from "@/components/molecules/spec-distribution-chart"
import { SpecComparisonTable } from "@/components/molecules/spec-comparison-table"
import { SpecStatBar } from "@/components/molecules/spec-stat-bar"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { fetchClassDistribution } from "@/lib/api"
import { tier, tierByPercentile } from "@/config/app-config"
import type { Tier } from "@/config/app-config"
import { titleizeSlug } from "@/lib/utils"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    classSlug: string
    specSlug: string
  }>
}

const BRACKETS = [
  {
    slug: "2v2",
    label: "2v2",
    description: "Two vs Two Arena",
    apiSlug: "2v2",
  },
  {
    slug: "3v3",
    label: "3v3",
    description: "Three vs Three Arena",
    apiSlug: "3v3",
  },
  {
    slug: "shuffle",
    label: "Solo Shuffle",
    description: "6-player round-robin arena",
    apiSlug: "shuffle-overall",
  },
  {
    slug: "blitz",
    label: "Blitz",
    description: "10-player rated battleground",
    apiSlug: "blitz-overall",
  },
]

const SOLO_BRACKETS = [
  "shuffle-overall",
  "blitz-overall",
]

function normalizeClassSlug(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-")
}

function normalizeSpecName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[-_\s]/g, "")
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { classSlug, specSlug } = await params
  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  return {
    title: `${titleizeSlug(specSlug)} ${cls?.name ?? titleizeSlug(classSlug)} PvP | WoW Meta`,
  }
}

export interface BracketData {
  slug: string
  label: string
  description: string
  href: string
  tier: Tier | null
  wrHat: number | null
  presence: number | null
  playerCount: number
  totalInBracket: number
  meanRating: number | null
}

export default async function SpecIndexPage({ params }: PageProps) {
  const { classSlug, specSlug } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  const results = await Promise.all(
    BRACKETS.map(({ apiSlug }) =>
      fetchClassDistribution({
        bracket: apiSlug,
        region: "all",
        role: "all",
      }).catch(() => null),
    ),
  )

  const bracketData: BracketData[] = BRACKETS.map((bracket, i) => {
    const data = results[i]
    const href = `/pvp/${classSlug}/${specSlug}/${bracket.slug}`

    if (!data) {
      return {
        slug: bracket.slug,
        label: bracket.label,
        description: bracket.description,
        href,
        tier: null,
        wrHat: null,
        presence: null,
        playerCount: 0,
        totalInBracket: 0,
        meanRating: null,
      }
    }

    const sorted = [
      ...data.classes,
    ].sort((a, b) => b.score - a.score)
    const specEntry = data.classes.find(
      (s) =>
        normalizeClassSlug(s.class) === classSlug &&
        normalizeSpecName(s.spec) === normalizeSpecName(specSlug),
    )

    if (!specEntry) {
      return {
        slug: bracket.slug,
        label: bracket.label,
        description: bracket.description,
        href,
        tier: null,
        wrHat: null,
        presence: null,
        playerCount: 0,
        totalInBracket: data.total_entries,
        meanRating: null,
      }
    }

    const isSolo = SOLO_BRACKETS.includes(bracket.apiSlug)
    const maxScore = sorted[0]?.score ?? 1
    const normPct = (specEntry.score / maxScore) * 100
    const rank =
      sorted.findIndex(
        (s) =>
          normalizeClassSlug(s.class) === classSlug &&
          normalizeSpecName(s.spec) === normalizeSpecName(specSlug),
      ) + 1
    const specTier: Tier = isSolo ? tierByPercentile(rank, sorted.length) : tier(normPct)
    const presenceTotal = sorted.reduce((s, r) => s + r.count, 0)
    const presence = presenceTotal > 0 ? specEntry.count / presenceTotal : 0

    return {
      slug: bracket.slug,
      label: bracket.label,
      description: bracket.description,
      href,
      tier: specTier,
      wrHat: specEntry.wr_hat,
      presence,
      playerCount: specEntry.count,
      totalInBracket: data.total_entries,
      meanRating: specEntry.mean_rating,
    }
  })

  const withData = bracketData.filter((b) => b.wrHat !== null)
  const avgWr =
    withData.length > 0 ? withData.reduce((s, b) => s + (b.wrHat ?? 0), 0) / withData.length : 0
  const avgPresence =
    withData.length > 0 ? withData.reduce((s, b) => s + (b.presence ?? 0), 0) / withData.length : 0
  const totalPlayers = bracketData.reduce((s, b) => s + b.playerCount, 0)
  const classColor = `var(--color-class-${classSlug})`

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-12 lg:px-6">
      <SpecStatBar
        winRate={avgWr}
        presence={avgPresence}
        playerCount={totalPlayers}
        classColor={classColor}
      />
      <section>
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Choose Bracket
        </p>
        <SpecBracketCards brackets={bracketData} classSlug={classSlug} />
      </section>

      <section>
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Bracket Comparison
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <SpecWinRateChart brackets={bracketData} />
          <SpecDistributionChart brackets={bracketData} />
        </div>
      </section>

      <section>
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Side-by-Side Stats
        </p>
        <SpecComparisonTable brackets={bracketData} />
      </section>
    </div>
  )
}
