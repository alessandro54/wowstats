import type { Metadata } from "next"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"

export const dynamic = "force-dynamic"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { MetaKpiRow } from "@/components/molecules/meta-kpi-row"
import { MetaStatsTable } from "@/components/molecules/meta-stats-table"
import { RegionSwitcher } from "@/components/molecules/region-switcher"
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
  const region = regionParam ?? "all"

  const data = await fetchClassDistribution({
    seasonId: seasonParam,
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

  // Sort by Bayesian score (descending)
  const sorted = [
    ...data.classes,
  ].sort((a, b) => b.score - a.score)
  const maxScore = sorted[0]?.score ?? 1

  // Compute presence as player share: count / sum(counts)
  const totalCount = data.total_entries
  const presenceMap = new Map(
    sorted.map((row) => [
      row.spec_id,
      totalCount > 0 ? row.count / totalCount : 0,
    ]),
  )

  const tableEntries: MetaStatsEntry[] = sorted.map((row) => {
    const classSlug = normalizeClassSlug(row.class) as WowClassSlug
    const classConfig = classMap.get(classSlug)
    const specConfig = classConfig?.specs.find(
      (s) => normalizeSpecName(s.name) === normalizeSpecName(row.spec),
    )
    const normPct = (row.score / maxScore) * 100
    return {
      key: `${row.class}-${row.spec_id}`,
      specName: row.spec,
      className: row.class,
      score: row.score,
      normPct,
      tier: tier(normPct),
      thetaHat: row.theta_hat,
      ratingCiLow: row.rating_ci_low,
      ratingCiHigh: row.rating_ci_high,
      meanRating: row.mean_rating,
      wrHat: row.wr_hat,
      presence: presenceMap.get(row.spec_id) ?? 0,
      bK: row.b_k,
      color: classConfig ? `var(--color-class-${classSlug})` : "#888",
      iconUrl: specConfig?.iconUrl,
    }
  })

  // KPIs using Bayesian fields
  const weightedRating = sorted.reduce((s, r) => s + r.theta_hat * r.count, 0) / (totalCount || 1)
  const weightedWR = sorted.reduce((s, r) => s + r.wr_hat * r.count, 0) / (totalCount || 1)

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

  // Most reliable: highest b_k (most data-backed shrinkage)
  const reliableRow = [
    ...sorted,
  ].sort((a, b) => b.b_k - a.b_k)[0]
  const reliableClassConfig = reliableRow
    ? classMap.get(normalizeClassSlug(reliableRow.class) as WowClassSlug)
    : undefined
  const mostReliable = {
    name: reliableRow?.spec ?? "",
    className: reliableRow?.class ?? "",
    color: reliableRow ? `var(--color-class-${normalizeClassSlug(reliableRow.class)})` : "#888",
    iconUrl: reliableClassConfig?.specs.find(
      (s) => normalizeSpecName(s.name) === normalizeSpecName(reliableRow?.spec ?? ""),
    )?.iconUrl,
    bK: reliableRow?.b_k ?? 0,
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
          mostReliable={mostReliable}
        />

        {/* Stats table */}
        <div className="rounded-lg border border-border bg-card/80">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Spec Rankings
            </h2>
            <RegionSwitcher />
          </div>
          <MetaStatsTable entries={tableEntries} />
        </div>
      </div>
    </>
  )
}
