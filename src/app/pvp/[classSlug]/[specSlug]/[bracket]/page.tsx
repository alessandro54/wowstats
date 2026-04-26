import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import type {
  MetaEnchant,
  MetaGem,
  MetaItem,
  MetaStats,
  ItemsResponse,
  TalentsResponse,
  TopPlayersResponse,
} from "@/lib/api"

export const revalidate = 21600

import { Equipment } from "@/components/organisms/equipment"
import { TalentTreeSkeleton } from "@/components/organisms/talent-tree"
import { Talents } from "@/components/organisms/talents"
import { TopPlayers } from "@/components/organisms/top-players"
import { Skeleton } from "@/components/ui/skeleton"
import { apiBracket } from "@/config/app-config"
import { SLOT_ORDER } from "@/config/equipment-config"
import { BRACKETS } from "@/config/wow/brackets-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import {
  fetchEnchants,
  fetchGems,
  fetchItems,
  fetchStats,
  fetchTalents,
  fetchTopPlayers,
} from "@/lib/api"
import { DEFAULT_LOCALE } from "@/lib/locale"
import { titleizeSlug } from "@/lib/utils"

export function generateStaticParams() {
  if (process.env.NODE_ENV !== "production") return []
  const params: {
    classSlug: string
    specSlug: string
    bracket: string
  }[] = []
  for (const cls of WOW_CLASSES) {
    for (const spec of cls.specs) {
      for (const bracket of BRACKETS) {
        params.push({
          classSlug: cls.slug,
          specSlug: spec.name,
          bracket: bracket.slug,
        })
      }
    }
  }
  return params
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const k = key(item)
    const arr = map.get(k) ?? []
    arr.push(item)
    map.set(k, arr)
  }
  return map
}

function sortedBySlotOrder<T>(map: Map<string, T[]>): {
  slot: string
  entries: T[]
}[] {
  const result: {
    slot: string
    entries: T[]
  }[] = []
  for (const slot of SLOT_ORDER) {
    const entry = map.get(slot) ?? map.get(slot.toLowerCase())
    if (entry)
      result.push({
        slot,
        entries: entry,
      })
  }
  for (const [slot, entries] of map) {
    if (!result.some((r) => r.slot.toUpperCase() === slot.toUpperCase())) {
      result.push({
        slot,
        entries,
      })
    }
  }
  return result
}

interface PageProps {
  params: Promise<{
    classSlug: string
    specSlug: string
    bracket: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { classSlug, specSlug, bracket } = await params
  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) return {}

  const bracketLabel = BRACKETS.find((b) => b.slug === bracket)?.label ?? bracket
  const title = `${titleizeSlug(specSlug)} ${cls.name} ${bracketLabel} — BiS Gear & Meta | WoW Stats`
  const description =
    `Top ${titleizeSlug(specSlug)} ${cls.name} builds for ${bracketLabel} in WoW. ` +
    `Best in slot gear, enchants, gems, and talents from real ladder data. Updated every 6 hours.`
  const image = spec.iconRemasteredUrl ?? spec.iconUrl

  return {
    title,
    description,
    keywords: [
      `${specSlug} ${cls.name.toLowerCase()} bis`,
      `${specSlug} pvp gear`,
      `wow ${bracketLabel.toLowerCase()} meta`,
      `${cls.name.toLowerCase()} pvp build`,
      `${specSlug} talents pvp`,
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1024,
          height: 1024,
          alt: `${titleizeSlug(specSlug)} ${cls.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        image,
      ],
    },
    alternates: {
      canonical: `/pvp/${classSlug}/${specSlug}/${bracket}`,
    },
  }
}

// ── Top Players: only fetch "all" region server-side ─────────
async function TopPlayersSection({
  resolvedBracket,
  specId,
  classSlug,
}: {
  resolvedBracket: string
  specId: number
  classSlug: WowClassSlug
}) {
  const locale = DEFAULT_LOCALE
  const topAll = await fetchTopPlayers(resolvedBracket, specId, undefined, locale).catch(
    (): TopPlayersResponse => ({
      bracket: resolvedBracket,
      spec_id: specId,
      regions: [],
      players: [],
      snapshot_at: null,
    }),
  )

  return (
    <TopPlayers
      playersByRegion={{
        all: topAll.players,
        us: [],
        eu: [],
      }}
      lazyRegionsUrl={`/api/prefetch/top-players?bracket=${resolvedBracket}&spec_id=${specId}`}
      defaultClassSlug={classSlug}
    />
  )
}

// ── Talents ──────────────────────────────────────────────────
async function TalentsSection({
  resolvedBracket,
  specId,
  classSlug,
}: {
  resolvedBracket: string
  specId: number
  classSlug: WowClassSlug
}) {
  const locale = DEFAULT_LOCALE
  const talentsResponse = await fetchTalents(resolvedBracket, specId, locale).catch(
    (): TalentsResponse => ({
      meta: {
        bracket: resolvedBracket,
        spec_id: specId,
        total_players: 0,
        total_weighted: 0,
        snapshot_at: null,
        data_confidence: "low" as const,
        stale_count: 0,
      },
      talents: [],
    }),
  )

  return (
    <Talents
      classSlug={classSlug}
      talents={talentsResponse.talents}
      talentsMeta={talentsResponse.meta}
    />
  )
}

// ── Equipment: only fetch items server-side, enchants stream after ──
async function EquipmentSection({
  resolvedBracket,
  specId,
  classSlug,
  specIconUrl,
  specName,
  wowClassName,
  bracketLabel,
}: {
  resolvedBracket: string
  specId: number
  classSlug: WowClassSlug
  specIconUrl?: string
  specName?: string
  wowClassName?: string
  bracketLabel?: string
}) {
  const locale = DEFAULT_LOCALE
  const [itemsData, enchants, gems, statsData] = await Promise.all([
    fetchItems(resolvedBracket, specId, locale).catch(
      (): ItemsResponse => ({
        meta: {
          snapshot_at: null,
        },
        items: [],
      }),
    ),
    fetchEnchants(resolvedBracket, specId, locale).catch((): MetaEnchant[] => []),
    fetchGems(resolvedBracket, specId, locale).catch((): MetaGem[] => []),
    fetchStats(resolvedBracket, specId, locale).catch(
      (): MetaStats => ({
        avg_ilvl: null,
        stats: {},
      }),
    ),
  ])

  const rawItems = Array.isArray(itemsData) ? (itemsData as MetaItem[]) : (itemsData.items ?? [])
  const itemGroups = sortedBySlotOrder(groupBy(rawItems, (i) => i.slot.toUpperCase()))
  const enchantGroups = sortedBySlotOrder(groupBy(enchants, (e) => e.slot.toUpperCase()))
  const gemGroups = sortedBySlotOrder(groupBy(gems, (g) => g.slot.toUpperCase()))

  return (
    <Equipment
      classSlug={classSlug}
      itemGroups={itemGroups}
      enchantGroups={enchantGroups}
      gemGroups={gemGroups}
      specIconUrl={specIconUrl}
      specName={specName}
      className={wowClassName}
      bracketLabel={bracketLabel}
      statsData={statsData}
    />
  )
}

// ── Skeletons ───────────────────────────────────────────────
function TopPlayersSkeleton() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-2 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-9 w-44 rounded-lg" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/30">
        <table className="w-full">
          <tbody>
            {Array.from({
              length: 10,
            }).map((_, i) => (
              <tr key={i} className="border-b border-border/20">
                <td className="w-16 px-4 py-4 text-center">
                  <Skeleton className="mx-auto h-5 w-6" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 shrink-0 rounded-full" />
                    <div>
                      <Skeleton className="mb-1.5 h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </td>
                <td className="w-32 px-4 py-4 text-center">
                  <Skeleton className="mx-auto h-6 w-14" />
                </td>
                <td className="hidden w-28 px-4 py-4 text-center sm:table-cell">
                  <Skeleton className="mx-auto h-4 w-16" />
                </td>
                <td className="w-24 px-4 py-4 text-center">
                  <Skeleton className="mx-auto h-4 w-10" />
                </td>
                <td className="w-24 px-4 py-4 text-center">
                  <Skeleton className="mx-auto h-4 w-8" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function TalentsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero at top */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <Skeleton className="mx-auto mb-3 h-4 w-24" />
          <div className="rounded-xl border p-4">
            <TalentTreeSkeleton cols={5} rows={8} />
          </div>
        </div>
      </div>
      {/* Class + Spec below */}
      <div className="sm:overflow-x-auto">
        <div className="flex flex-col items-stretch gap-6 sm:min-w-max sm:flex-row">
          {(
            [
              "Class Talents",
              "Spec Talents",
            ] as const
          ).map((label) => (
            <div key={label} className="flex flex-1 flex-col">
              <Skeleton className="mx-auto mb-3 h-5 w-28" />
              <div className="rounded-xl border p-4">
                <TalentTreeSkeleton />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EquipmentSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-10" />
        <div className="ml-2 h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Array.from({
          length: 16,
        }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-border/30 bg-card/30 px-3 py-2.5"
          >
            <Skeleton className="size-9 shrink-0 rounded" />
            <div className="flex-1">
              <Skeleton className="mb-1 h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────
export default async function SpecPage({ params }: PageProps) {
  const { classSlug, specSlug, bracket } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  const resolvedBracket = apiBracket(bracket, classSlug, specSlug)

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-12 lg:px-6">
      <Suspense fallback={<TopPlayersSkeleton />}>
        <TopPlayersSection
          resolvedBracket={resolvedBracket}
          specId={spec.id}
          classSlug={cls.slug as WowClassSlug}
        />
      </Suspense>
      <Suspense fallback={<TalentsSkeleton />}>
        <TalentsSection
          resolvedBracket={resolvedBracket}
          specId={spec.id}
          classSlug={cls.slug as WowClassSlug}
        />
      </Suspense>
      <Suspense fallback={<EquipmentSkeleton />}>
        <EquipmentSection
          resolvedBracket={resolvedBracket}
          specId={spec.id}
          classSlug={cls.slug as WowClassSlug}
          specIconUrl={spec.iconRemasteredUrl ?? spec.iconUrl}
          specName={titleizeSlug(specSlug)}
          wowClassName={cls.name}
          bracketLabel={BRACKETS.find((b) => b.slug === bracket)?.label ?? bracket}
        />
      </Suspense>
    </div>
  )
}
