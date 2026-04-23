import { notFound } from "next/navigation"
import { SpecStatBar } from "@/components/molecules/spec-stat-bar"
import { StatPriority } from "@/components/organisms/stat-priority"
import { apiBracket } from "@/config/app-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { fetchClassDistribution, fetchStatPriority } from "@/lib/api"

interface Props {
  children: React.ReactNode
  params: Promise<{
    classSlug: string
    specSlug: string
    bracket: string
  }>
}

function normalizeClassSlug(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-")
}

function normalizeSpecName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[-_\s]/g, "")
}

const SOLO_BRACKETS = [
  "shuffle",
  "blitz",
]

function apiDistBracket(bracket: string): string {
  if (SOLO_BRACKETS.includes(bracket)) return `${bracket}-overall`
  return bracket
}

export default async function PvpBracketLayout({ children, params }: Props) {
  const { classSlug, specSlug, bracket } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  const resolvedBracket = apiBracket(bracket, classSlug, specSlug)
  const classColor = `var(--color-class-${classSlug})`

  const [statPriority, distData] = await Promise.all([
    fetchStatPriority(resolvedBracket, spec.id).catch(() => ({
      bracket: resolvedBracket,
      spec_id: spec.id,
      stats: [],
    })),
    fetchClassDistribution({
      bracket: apiDistBracket(bracket),
      region: "all",
      role: "all",
    }).catch(() => null),
  ])

  let bracketWr = 0
  let bracketPresence = 0
  let bracketPlayers = 0

  if (distData) {
    const specEntry = distData.classes.find(
      (s) =>
        normalizeClassSlug(s.class) === classSlug &&
        normalizeSpecName(s.spec) === normalizeSpecName(specSlug),
    )
    if (specEntry) {
      bracketWr = specEntry.wr_hat
      const total = distData.classes.reduce((s, r) => s + r.count, 0)
      bracketPresence = total > 0 ? specEntry.count / total : 0
      bracketPlayers = specEntry.count
    }
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <SpecStatBar
          winRate={bracketWr}
          presence={bracketPresence}
          playerCount={bracketPlayers}
          classColor={classColor}
        >
          {statPriority.stats.length > 0 && <StatPriority stats={statPriority.stats} compact />}
        </SpecStatBar>
      </div>
      {children}
    </>
  )
}
