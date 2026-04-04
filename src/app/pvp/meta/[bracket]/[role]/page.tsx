import type { Metadata } from "next"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import type { MetaDataset, Region, Role } from "@/components/molecules/meta-stats-dashboard"

export const dynamic = "force-dynamic"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { BracketDropdown } from "@/components/molecules/bracket-dropdown"
import { MetaStatsDashboard } from "@/components/molecules/meta-stats-dashboard"
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
import type { ClassDistributionResponse } from "@/lib/api"

type Bracket = "2v2" | "3v3" | "rbg" | "shuffle-overall" | "blitz-overall"

const ALL_BRACKETS = [
  "2v2",
  "3v3",
  "shuffle-overall",
  "blitz-overall",
]
const REGIONS: Region[] = [
  "all",
  "us",
  "eu",
]

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

const classMap = new Map(
  WOW_CLASSES.map((c) => [
    c.slug,
    c,
  ]),
)

function transformToEntries(data: ClassDistributionResponse, bracket: string): MetaStatsEntry[] {
  const sorted = [
    ...data.classes,
  ].sort((a, b) => b.score - a.score)
  const totalCount = data.total_entries

  return sorted.map((row) => {
    const classSlug = normalizeClassSlug(row.class) as WowClassSlug
    const classConfig = classMap.get(classSlug)
    const specConfig = classConfig?.specs.find(
      (s) => normalizeSpecName(s.name) === normalizeSpecName(row.spec),
    )
    return {
      key: `${row.class}-${row.spec_id}`,
      specName: row.spec,
      className: row.class,
      role: row.role,
      score: row.score,
      normPct: 0,
      tier: tier(0),
      thetaHat: row.theta_hat,
      ratingCiLow: row.rating_ci_low,
      ratingCiHigh: row.rating_ci_high,
      meanRating: row.mean_rating,
      wrHat: row.wr_hat,
      presence: totalCount > 0 ? row.count / totalCount : 0,
      bK: row.b_k,
      color: classConfig ? `var(--color-class-${classSlug})` : "#888",
      iconUrl: specConfig?.iconUrl,
      specUrl: `/pvp/${classSlug}/${row.spec}/${bracket}`,
    }
  })
}

function buildDataset(data: ClassDistributionResponse, bracket: string): MetaDataset {
  const entries = transformToEntries(data, bracket)
  const totalCount = data.total_entries
  const sorted = [
    ...data.classes,
  ].sort((a, b) => b.score - a.score)

  const weightedRating = sorted.reduce((s, r) => s + r.theta_hat * r.count, 0) / (totalCount || 1)
  const weightedWR = sorted.reduce((s, r) => s + r.wr_hat * r.count, 0) / (totalCount || 1)

  const topRow = sorted[0]
  const topClassSlug = topRow ? (normalizeClassSlug(topRow.class) as WowClassSlug) : undefined
  const topClassConfig = topClassSlug ? classMap.get(topClassSlug) : undefined

  const reliableRow = [
    ...sorted,
  ].sort((a, b) => b.b_k - a.b_k)[0]
  const reliableClassSlug = reliableRow
    ? (normalizeClassSlug(reliableRow.class) as WowClassSlug)
    : undefined
  const reliableClassConfig = reliableClassSlug ? classMap.get(reliableClassSlug) : undefined

  return {
    entries,
    totalEntries: totalCount,
    weightedRating,
    weightedWR,
    topSpec: {
      name: topRow?.spec ?? "",
      className: topRow?.class ?? "",
      color: topRow ? `var(--color-class-${normalizeClassSlug(topRow.class)})` : "#888",
      iconUrl: topClassConfig?.specs.find(
        (s) => normalizeSpecName(s.name) === normalizeSpecName(topRow?.spec ?? ""),
      )?.iconUrl,
    },
    mostReliable: {
      name: reliableRow?.spec ?? "",
      className: reliableRow?.class ?? "",
      color: reliableRow ? `var(--color-class-${normalizeClassSlug(reliableRow.class)})` : "#888",
      iconUrl: reliableClassConfig?.specs.find(
        (s) => normalizeSpecName(s.name) === normalizeSpecName(reliableRow?.spec ?? ""),
      )?.iconUrl,
      bK: reliableRow?.b_k ?? 0,
    },
  }
}

const emptyDataset: MetaDataset = {
  entries: [],
  totalEntries: 0,
  weightedRating: 0,
  weightedWR: 0,
  topSpec: {
    name: "",
    className: "",
    color: "#888",
  },
  mostReliable: {
    name: "",
    className: "",
    color: "#888",
    bK: 0,
  },
}

export default async function PvpBracketPage({ params, searchParams }: PageProps) {
  const { bracket, role } = await params
  const { region: regionParam, season: seasonParam } = await searchParams
  const initialRegion = (regionParam ?? "all") as Region
  const initialRole = role as Role
  const bracketStr = String(bracket)

  // Fetch all 4 brackets × 3 regions in parallel (12 calls)
  const fetchPromises = ALL_BRACKETS.flatMap((b) =>
    REGIONS.map((r) =>
      fetchClassDistribution({
        seasonId: seasonParam,
        bracket: b,
        region: r,
        role: "all",
      })
        .then((data) => ({
          bracket: b,
          region: r,
          data,
        }))
        .catch(() => ({
          bracket: b,
          region: r,
          data: null,
        })),
    ),
  )

  const results = await Promise.all(fetchPromises)

  // Build datasets for current bracket (used by KPIs + table)
  const currentDatasets: Record<Region, MetaDataset> = {
    all: emptyDataset,
    us: emptyDataset,
    eu: emptyDataset,
  }

  // Build all brackets data (used by tier list bracket comparison)
  const allBrackets: Record<string, Record<Region, MetaDataset>> = {}

  for (const { bracket: b, region: r, data } of results) {
    if (!allBrackets[b]) {
      allBrackets[b] = {
        all: emptyDataset,
        us: emptyDataset,
        eu: emptyDataset,
      }
    }
    const dataset = data ? buildDataset(data, b) : emptyDataset
    allBrackets[b][r as Region] = dataset

    if (b === bracketStr) {
      currentDatasets[r as Region] = dataset
    }
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
                <BracketDropdown current={bracketStr} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="p-4 lg:p-6 w-full">
        <MetaStatsDashboard
          datasets={currentDatasets}
          allBrackets={allBrackets}
          bracket={bracketStr}
          initialRole={initialRole}
          initialRegion={initialRegion}
        />
      </div>
    </>
  )
}
