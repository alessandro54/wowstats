import type { Metadata } from "next"
import type { MetaEnchant, MetaGem, MetaItem, TalentsResponse, TopPlayersResponse } from "@/lib/api"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
import { Equipment } from "@/components/organisms/equipment"
import { Talents } from "@/components/organisms/talents"
import { TopPlayers } from "@/components/organisms/top-players"
import { apiBracket } from "@/config/app-config"
import { SLOT_ORDER } from "@/config/equipment-config"
import { BRACKETS } from "@/config/wow/brackets-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { fetchEnchants, fetchGems, fetchItems, fetchTalents, fetchTopPlayers } from "@/lib/api"
import { getLocale } from "@/lib/locale"
import { titleizeSlug } from "@/lib/utils"

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

export default async function SpecPage({ params }: PageProps) {
  const { classSlug, specSlug, bracket } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  const resolvedBracket = apiBracket(bracket, classSlug, specSlug)
  const locale = await getLocale()

  const [items, enchants, gems, talentsResponse, topAll, topUs, topEu] = await Promise.all([
    fetchItems(resolvedBracket, spec.id, locale).catch((): MetaItem[] => []),
    fetchEnchants(resolvedBracket, spec.id, locale).catch((): MetaEnchant[] => []),
    fetchGems(resolvedBracket, spec.id, locale).catch((): MetaGem[] => []),
    fetchTalents(resolvedBracket, spec.id, locale).catch(
      (): TalentsResponse => ({
        meta: {
          bracket: resolvedBracket,
          spec_id: spec.id,
          total_players: 0,
          total_weighted: 0,
          snapshot_at: null,
        },
        talents: [],
      }),
    ),
    fetchTopPlayers(resolvedBracket, spec.id, undefined, locale).catch(
      (): TopPlayersResponse => ({
        bracket: resolvedBracket,
        spec_id: spec.id,
        regions: [],
        players: [],
        snapshot_at: null,
      }),
    ),
    fetchTopPlayers(resolvedBracket, spec.id, "us", locale).catch(
      (): TopPlayersResponse => ({
        bracket: resolvedBracket,
        spec_id: spec.id,
        regions: [],
        players: [],
        snapshot_at: null,
      }),
    ),
    fetchTopPlayers(resolvedBracket, spec.id, "eu", locale).catch(
      (): TopPlayersResponse => ({
        bracket: resolvedBracket,
        spec_id: spec.id,
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
    <div className="animate-page-in space-y-8 px-6 pb-8">
      <TopPlayers
        playersByRegion={{
          all: topAll.players,
          us: topUs.players,
          eu: topEu.players,
        }}
      />
      <Talents
        classSlug={cls.slug}
        talents={talentsResponse.talents}
        talentsMeta={talentsResponse.meta}
      />
      <Equipment
        classSlug={cls.slug}
        itemGroups={itemGroups}
        enchantGroups={enchantGroups}
        gemGroups={gemGroups}
        fiberGems={fiberGems}
      />
    </div>
  )
}
