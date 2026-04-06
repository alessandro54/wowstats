import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import type { MetaEnchant, MetaGem, MetaItem, TalentsResponse, TopPlayersResponse } from "@/lib/api"

export const dynamic = "force-dynamic"

import { Equipment } from "@/components/organisms/equipment"
import { Talents } from "@/components/organisms/talents"
import { TopPlayers } from "@/components/organisms/top-players"
import { apiBracket } from "@/config/app-config"
import { SLOT_ORDER } from "@/config/equipment-config"
import { BRACKETS } from "@/config/wow/brackets-config"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { fetchEnchants, fetchGems, fetchItems, fetchTalents, fetchTopPlayers } from "@/lib/api"
import { getLocale } from "@/lib/locale"
import { titleizeSlug } from "@/lib/utils"
import BracketLoading from "./loading"

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
  const title = `${titleizeSlug(specSlug)} • ${cls.name} • ${bracketLabel} BiS`
  const description = `Best in slot items, enchants, and gems for ${cls.name} ${specSlug} in ${bracketLabel}. Based on real WoW PvP data.`
  const image = spec.iconRemasteredUrl ?? spec.iconUrl

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1024,
          height: 1024,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [
        image,
      ],
    },
  }
}

async function SpecContent({
  classSlug,
  specId,
  specSlug,
  bracket,
}: {
  classSlug: WowClassSlug
  specId: number
  specSlug: string
  bracket: string
}) {
  const resolvedBracket = apiBracket(bracket, classSlug, specSlug)
  const locale = await getLocale()

  const [items, enchants, gems, talentsResponse, topAll, topUs, topEu] = await Promise.all([
    fetchItems(resolvedBracket, specId, locale).catch((): MetaItem[] => []),
    fetchEnchants(resolvedBracket, specId, locale).catch((): MetaEnchant[] => []),
    fetchGems(resolvedBracket, specId, locale).catch((): MetaGem[] => []),
    fetchTalents(resolvedBracket, specId, locale).catch(
      (): TalentsResponse => ({
        meta: {
          bracket: resolvedBracket,
          spec_id: specId,
          total_players: 0,
          total_weighted: 0,
          snapshot_at: null,
        },
        talents: [],
      }),
    ),
    fetchTopPlayers(resolvedBracket, specId, undefined, locale).catch(
      (): TopPlayersResponse => ({
        bracket: resolvedBracket,
        spec_id: specId,
        regions: [],
        players: [],
        snapshot_at: null,
      }),
    ),
    fetchTopPlayers(resolvedBracket, specId, "us", locale).catch(
      (): TopPlayersResponse => ({
        bracket: resolvedBracket,
        spec_id: specId,
        regions: [],
        players: [],
        snapshot_at: null,
      }),
    ),
    fetchTopPlayers(resolvedBracket, specId, "eu", locale).catch(
      (): TopPlayersResponse => ({
        bracket: resolvedBracket,
        spec_id: specId,
        regions: [],
        players: [],
        snapshot_at: null,
      }),
    ),
  ])

  const itemGroups = sortedBySlotOrder(groupBy(items, (i) => i.slot.toUpperCase()))
  const enchantGroups = sortedBySlotOrder(groupBy(enchants, (e) => e.slot.toUpperCase()))
  const fiberGems = gems.filter((g) => g.socket_type === "FIBER")
  const gemGroups = Array.from(
    groupBy(
      gems.filter((g) => g.socket_type !== "FIBER"),
      (g) => g.socket_type,
    ),
  ).map(([socketType, entries]) => ({
    socketType,
    entries,
  }))

  return (
    <>
      <TopPlayers
        playersByRegion={{
          all: topAll.players,
          us: topUs.players,
          eu: topEu.players,
        }}
      />
      <Talents
        classSlug={classSlug}
        talents={talentsResponse.talents}
        talentsMeta={talentsResponse.meta}
      />
      <Equipment
        classSlug={classSlug}
        itemGroups={itemGroups}
        enchantGroups={enchantGroups}
        gemGroups={gemGroups}
        fiberGems={fiberGems}
      />
    </>
  )
}

export default async function SpecPage({ params }: PageProps) {
  const { classSlug, specSlug, bracket } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-12 lg:px-6">
      <Suspense fallback={<BracketLoading />}>
        <SpecContent
          classSlug={cls.slug as WowClassSlug}
          specId={spec.id}
          specSlug={specSlug}
          bracket={bracket}
        />
      </Suspense>
    </div>
  )
}
