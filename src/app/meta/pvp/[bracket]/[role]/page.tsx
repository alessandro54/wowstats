import type { Metadata } from "next"
import type { MetaBarEntry } from "@/components/molecules/meta-bar-chart"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { MetaBarChart } from "@/components/molecules/meta-bar-chart"
import { PageHeader } from "@/components/molecules/page-header"
// app/[classSlug]/[specSlug]/pvp/[bracket]/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

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

export const dynamic = "force-dynamic"

async function fetchClassDistribution(params: {
  seasonId: string
  role: string
  bracket: string
  region: string
}) {
  const baseUrl = process.env.BACKEND_URL ?? "http://localhost:3000"
  const url = new URL("/api/v1/pvp/meta/class_distribution", baseUrl)
  url.searchParams.set("season_id", params.seasonId)
  url.searchParams.set("role", params.role)
  url.searchParams.set("bracket", params.bracket)
  url.searchParams.set("region", params.region)

  const res = await fetch(url.toString(), { next: { revalidate: 300 } })
  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status} ${res.statusText}`)
  }
  return res.json()
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

  const topRows = (Array.isArray(data?.classes) ? data.classes : [])
    .slice()
    .sort((a: any, b: any) => Number(b?.meta_score ?? 0) - Number(a?.meta_score ?? 0))

  // Pre-build lookup map to avoid O(n) WOW_CLASSES.find() inside the render loop
  const classMap = new Map(WOW_CLASSES.map(c => [c.slug, c]))
  const maxScore = Number(topRows[0]?.meta_score ?? 1)
  const barEntries: MetaBarEntry[] = topRows.map((row: any) => {
    const classSlug = typeof row?.class === "string" ? normalizeClassSlug(row.class) : null
    const classConfig = classSlug ? classMap.get(classSlug as WowClassSlug) : undefined
    const specName = row?.spec ?? ""
    const specConfig = classConfig?.specs.find(
      s => normalizeSpecName(s.name) === normalizeSpecName(specName),
    )
    return {
      key: `bar-${row?.class ?? "unknown"}-${row?.spec_id ?? ""}`,
      specName,
      percentage: (Number(row?.meta_score ?? 0) / maxScore) * 100,
      color: classConfig?.color ?? "#888",
      iconUrl: specConfig?.iconUrl,
    }
  })

  return (
    <>
      <PageHeader>
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
      </PageHeader>
      <section className="mx-auto flex min-h-[calc(100vh-60px)] max-w-6xl flex-1 flex-col space-y-4 p-4">
        <h1 className="text-3xl font-bold">
          PvP meta –
          {" "}
          {bracket}
          {" "}
          {role.toUpperCase()}
        </h1>

        <p className="text-muted-foreground text-sm">
          Region:
          {" "}
          <span className="font-mono">{region}</span>
          {" "}
          · Season:
          {" "}
          <span className="font-mono">{season}</span>
        </p>

        <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-lg py-4">
          <h2 className="mb-4 text-lg font-semibold">Meta Score by Spec</h2>
          <div className="flex h-full w-full flex-1 items-center justify-center">
            <MetaBarChart entries={barEntries} />
          </div>
        </div>
      </section>
    </>
  )
}
