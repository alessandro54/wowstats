"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { MetaInsightsPanel } from "@/components/molecules/meta-insights-panel"
import { MetaKpiRow } from "@/components/molecules/meta-kpi-row"
import { MetaStatsSkeleton } from "@/components/molecules/meta-stats-skeleton"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import { MetaStatsTable } from "@/components/molecules/meta-stats-table"
import type { SpecBracketData } from "@/components/molecules/meta-tier-list"
import { MetaTierList } from "@/components/molecules/meta-tier-list"
import { RegionSwitcher } from "@/components/molecules/region-switcher"
import { RoleSwitcher } from "@/components/molecules/role-switcher"
import { useSetHoverSlug } from "@/components/providers/hover-provider"
import { tier, tierByPercentile } from "@/config/app-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"

const SOLO_BRACKETS = [
  "shuffle-overall",
  "blitz-overall",
]

const BRACKET_LABELS: Record<string, string> = {
  "2v2": "2v2",
  "3v3": "3v3",
  "shuffle-overall": "Shuffle",
  "blitz-overall": "Blitz",
}

const ALL_BRACKETS = [
  "2v2",
  "3v3",
  "shuffle-overall",
  "blitz-overall",
]

export type Region = "all" | "us" | "eu"
export type Role = "dps" | "healer" | "tank"

export interface MetaDataset {
  entries: MetaStatsEntry[]
  totalEntries: number
  weightedRating: number
  weightedWR: number
  topSpec: {
    name: string
    className: string
    color: string
    iconUrl?: string
  }
  mostReliable: {
    name: string
    className: string
    color: string
    iconUrl?: string
    bK: number
  }
}

interface Props {
  datasets: Record<Region, MetaDataset>
  allBrackets: Record<string, Record<Region, MetaDataset>>
  bracket: string
  initialRole: Role
  initialRegion: Region
}

function filterByRole(dataset: MetaDataset, role: Role, bracket: string): MetaDataset {
  const filtered = dataset.entries.filter((e) => e.role === role)
  if (filtered.length === 0) {
    return {
      ...dataset,
      entries: [],
    }
  }

  const isSolo = SOLO_BRACKETS.includes(bracket)
  const maxScore = filtered[0]?.score ?? 1
  const total = filtered.length
  const entries = filtered.map((e, i) => {
    const normPct = (e.score / maxScore) * 100
    let t = isSolo ? tierByPercentile(i + 1, total) : tier(normPct)
    if (role === "tank" && t === "S+") t = "S"
    return {
      ...e,
      normPct,
      tier: t,
    }
  })

  const totalCount = entries.reduce((s, e) => s + e.presence, 0) || 1
  const weightedRating = entries.reduce((s, e) => s + e.thetaHat * e.presence, 0) / totalCount
  const weightedWR = entries.reduce((s, e) => s + e.wrHat * e.presence, 0) / totalCount

  const topRow = entries[0]
  const reliableRow = [
    ...entries,
  ].sort((a, b) => b.bK - a.bK)[0]

  return {
    entries,
    totalEntries: dataset.totalEntries,
    weightedRating,
    weightedWR,
    topSpec: topRow
      ? {
          name: topRow.specName,
          className: topRow.className,
          color: topRow.color,
          iconUrl: topRow.iconUrl,
        }
      : dataset.topSpec,
    mostReliable: reliableRow
      ? {
          name: reliableRow.specName,
          className: reliableRow.className,
          color: reliableRow.color,
          iconUrl: reliableRow.iconUrl,
          bK: reliableRow.bK,
        }
      : dataset.mostReliable,
  }
}

function buildBracketComparison(
  allBrackets: Record<string, Record<Region, MetaDataset>>,
  region: Region,
  role: Role,
): Map<string, SpecBracketData> {
  const map = new Map<string, SpecBracketData>()

  for (const b of ALL_BRACKETS) {
    const bracketData = allBrackets[b]?.[region]
    if (!bracketData) continue

    const filtered = filterByRole(bracketData, role, b)

    for (let i = 0; i < filtered.entries.length; i++) {
      const entry = filtered.entries[i]
      const existing = map.get(entry.key) ?? {
        specId: entry.key,
        ranks: [],
      }
      existing.ranks.push({
        bracket: b,
        label: BRACKET_LABELS[b] ?? b,
        tier: entry.tier,
        score: entry.score,
        rank: i + 1,
      })
      map.set(entry.key, existing)
    }
  }

  return map
}

function DashboardInner({ datasets, allBrackets, bracket, initialRole, initialRegion }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const setHoverSlug = useSetHoverSlug()

  const [role, setRole] = useState<Role>(initialRole)
  const [region, setRegion] = useState<Region>(initialRegion)

  const dataset = filterByRole(datasets[region], role, bracket)
  const topClassName = dataset.entries[0]?.className as WowClassSlug | undefined

  const bracketComparison = buildBracketComparison(allBrackets, region, role)

  useEffect(() => {
    if (topClassName) setHoverSlug(topClassName)
    return () => setHoverSlug(null)
  }, [
    topClassName,
    setHoverSlug,
  ])

  // Sync state when browser back/forward hits a pushState entry
  useEffect(() => {
    const onPopState = () => {
      const segs = window.location.pathname.split("/")
      const urlRole = segs[4] as Role
      const urlParams = new URLSearchParams(window.location.search)
      const urlRegion = (urlParams.get("region") ?? "all") as Region
      if (
        [
          "dps",
          "healer",
          "tank",
        ].includes(urlRole)
      )
        setRole(urlRole)
      setRegion(urlRegion)
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const updateUrl = (newRole: Role, newRegion: Region) => {
    const segments = pathname.split("/")
    segments[4] = newRole
    const params = new URLSearchParams(searchParams.toString())
    if (newRegion === "all") {
      params.delete("region")
    } else {
      params.set("region", newRegion)
    }
    const qs = params.toString()
    const url = `${segments.join("/")}${qs ? `?${qs}` : ""}`
    window.history.pushState(null, "", url)
  }

  const handleRoleChange = (newRole: string) => {
    const r = newRole as Role
    setRole(r)
    updateUrl(r, region)
  }

  const handleRegionChange = (newRegion: string) => {
    const r = newRegion as Region
    setRegion(r)
    updateUrl(role, r)
  }

  return (
    <div className="space-y-6">
      <MetaKpiRow
        totalPlayers={dataset.totalEntries}
        weightedAvgRating={dataset.weightedRating}
        weightedAvgWinRate={dataset.weightedWR}
        topSpec={dataset.topSpec}
        mostReliable={dataset.mostReliable}
      />

      <div className="rounded-lg border border-border/30 bg-card/20 backdrop-blur-sm dark:bg-black/40">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Spec Rankings
          </h2>
          <div className="flex items-center gap-2">
            <RoleSwitcher current={role} onSwitch={handleRoleChange} />
            <RegionSwitcher current={region} onSwitch={handleRegionChange} />
          </div>
        </div>
        <div key={`${role}-${region}`} className="animate-fade-in">
          {/* Tier list + insights side by side */}
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_280px]">
            <MetaTierList
              entries={dataset.entries}
              bracketComparison={bracketComparison}
              currentBracket={bracket}
              defaultClassSlug={topClassName}
            />
            <MetaInsightsPanel entries={dataset.entries} />
          </div>
          {/* Full-width table */}
          <MetaStatsTable entries={dataset.entries} defaultClassSlug={topClassName} />
        </div>
      </div>
    </div>
  )
}

export function MetaStatsDashboard(props: Props) {
  return (
    <Suspense fallback={<MetaStatsSkeleton />}>
      <DashboardInner {...props} />
    </Suspense>
  )
}
