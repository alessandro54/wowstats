import type { Metadata } from "next"
import type { MetaBarEntry } from "@/components/molecules/meta-bar-chart"
import type { DonutSlice } from "@/components/molecules/meta-donut-chart"

export const dynamic = "force-dynamic"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { MetaBarChart } from "@/components/molecules/meta-bar-chart"
import { MetaDonutChart } from "@/components/molecules/meta-donut-chart"
import { MetaKpiRow } from "@/components/molecules/meta-kpi-row"
import { MetaSpecTable } from "@/components/molecules/meta-spec-table"
import { TopNavConfig } from "@/components/molecules/top-nav-config"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { tier } from "@/config/app-config"
import { fetchClassDistribution } from "@/lib/api"

type Bracket = "2v2" | "3v3" | "rbg" | "shuffle-overall" | "blitz-overall"

interface PageProps {
  params: Promise<{
    bracket: Bracket | string
    role: string
  }>
  searchParams: Promise<{
    region?: string
    season?: string
  }>
}

export const metadata: Metadata = {
  title: "PvP Meta",
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

export default async function PvpBracketPage({ params, searchParams }: PageProps) {
  const { bracket, role } = await params
  const { region: regionParam, season: seasonParam } = await searchParams
  const region = regionParam ?? "us"
  const season = seasonParam ?? "40"

  const data = await fetchClassDistribution({
    seasonId: season,
    role,
    bracket: String(bracket),
    region,
  })

  const classMap = new Map(
    WOW_CLASSES.map((c) => [
      c.slug,
      c,
    ]),
  )
  const sorted = [
    ...data.classes,
  ].sort((a, b) => b.meta_score - a.meta_score)
  const maxScore = sorted[0]?.meta_score ?? 1

  const barEntries: MetaBarEntry[] = sorted.map((row) => {
    const classSlug = normalizeClassSlug(row.class) as WowClassSlug
    const classConfig = classMap.get(classSlug)
    const specConfig = classConfig?.specs.find(
      (s) => normalizeSpecName(s.name) === normalizeSpecName(row.spec),
    )
    const normPct = (row.meta_score / maxScore) * 100
    return {
      key: `${row.class}-${row.spec_id}`,
      specName: row.spec,
      normPct,
      metaScore: row.meta_score,
      meanRating: row.mean_rating,
      winRate: row.shrunk_winrate,
      presence: row.games_share,
      color: classConfig ? `var(--color-class-${classSlug})` : "#888",
      iconUrl: specConfig?.iconUrl,
      tier: tier(normPct),
    }
  })

  const donutSlices: DonutSlice[] = sorted.map((row) => {
    const classSlug = normalizeClassSlug(row.class) as WowClassSlug
    const classConfig = classMap.get(classSlug)
    const specConfig = classConfig?.specs.find(
      (s) => normalizeSpecName(s.name) === normalizeSpecName(row.spec),
    )
    return {
      key: `${row.class}-${row.spec_id}`,
      label: row.spec,
      value: row.games_share,
      color: classConfig ? `var(--color-class-${classSlug})` : "#888",
      iconUrl: specConfig?.iconUrl,
    }
  })

  // KPIs
  const totalCount = data.total_entries
  const weightedRating = sorted.reduce((s, r) => s + r.mean_rating * r.count, 0) / (totalCount || 1)
  const weightedWR = sorted.reduce((s, r) => s + r.shrunk_winrate * r.count, 0) / (totalCount || 1)
  const topRow = sorted[0]
  const topClassConfig = topRow
    ? classMap.get(normalizeClassSlug(topRow.class) as WowClassSlug)
    : undefined
  const topSpec = {
    name: topRow?.spec ?? "",
    className: topRow?.class ?? "",
    color: topRow ? `var(--color-class-${normalizeClassSlug(topRow.class)})` : "#888",
    iconUrl: topClassConfig?.specs.find(
      (s) => normalizeSpecName(s.name) === normalizeSpecName(topRow?.spec ?? ""),
    )?.iconUrl,
  }

  return (
    <>
      <TopNavConfig
        left={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Meta</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>PvP</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{bracket}</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{role.toUpperCase()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="space-y-6 p-4 lg:p-6">
        {/* KPIs */}
        <MetaKpiRow
          totalPlayers={totalCount}
          weightedAvgRating={weightedRating}
          weightedAvgWinRate={weightedWR}
          topSpec={topSpec}
        />

        {/* Charts row */}
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          {/* Bar chart card */}
          <div className="rounded-lg border border-border bg-card/80 px-4 pb-2 pt-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Meta Score by Spec
            </h2>
            <MetaBarChart entries={barEntries} />
          </div>

          {/* Donut card */}
          <div className="rounded-lg border border-border bg-card/80 p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Spec Presence
            </h2>
            <MetaDonutChart slices={donutSlices} />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card/80">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Spec Rankings
            </h2>
          </div>
          <MetaSpecTable entries={barEntries} />
        </div>
      </div>
    </>
  )
}
