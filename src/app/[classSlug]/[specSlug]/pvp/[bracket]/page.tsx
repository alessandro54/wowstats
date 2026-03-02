import { WOW_CLASSES } from "@/config/wow/classes"
import { BRACKETS } from "@/config/wow/brackets"
import { Equipment } from "@/components/pvp/equipment"
import { Talents } from "@/components/pvp/talents"
import { fetchItems, fetchEnchants, fetchGems, fetchTalents, type MetaItem, type MetaEnchant, type MetaGem, type MetaTalent } from "@/lib/api"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

const SLOT_ORDER = [
  "HEAD", "NECK", "SHOULDER", "BACK", "CHEST", "WRIST", "HANDS", "WAIST", "LEGS", "FEET",
  "FINGER_1", "FINGER_2", "TRINKET_1", "TRINKET_2", "MAIN_HAND", "OFF_HAND",
]

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

function sortedBySlotOrder<T>(map: Map<string, T[]>): { slot: string; entries: T[] }[] {
  const result: { slot: string; entries: T[] }[] = []
  for (const slot of SLOT_ORDER) {
    const entry = map.get(slot) ?? map.get(slot.toLowerCase())
    if (entry) result.push({ slot, entries: entry })
  }
  for (const [slot, entries] of map) {
    if (!result.some((r) => r.slot.toUpperCase() === slot.toUpperCase())) {
      result.push({ slot, entries })
    }
  }
  return result
}

type PageProps = {
  params: Promise<{ classSlug: string; specSlug: string; bracket: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { classSlug, specSlug, bracket } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) return {}

  const bracketLabel = BRACKETS.find((b) => b.slug === bracket)?.label ?? bracket
  const title = `${cls.name} ${specSlug} – ${bracketLabel} BIS`
  const description = `Best in slot items, enchants, and gems for ${cls.name} ${specSlug} in ${bracketLabel}. Based on real WoW PvP data.`
  const image = spec.iconRemasteredUrl ?? spec.iconUrl

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1024, height: 1024 }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [image],
    },
  }
}

export const dynamic = "force-dynamic"

const API_CLASS_SLUG: Record<string, string> = {
  "death-knight": "deathknight",
  "demon-hunter": "demonhunter",
}

function apiBracket(bracket: string, classSlug: string, specSlug: string): string {
  if (bracket === "shuffle") {
    const apiClass = API_CLASS_SLUG[classSlug] ?? classSlug
    return `shuffle-${apiClass}-${specSlug}`
  }
  return bracket
}

export default async function SpecPage({ params }: PageProps) {
  const { classSlug, specSlug, bracket } = await params

  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)
  if (!cls || !spec) notFound()

  const resolvedBracket = apiBracket(bracket, classSlug, specSlug)

  const [items, enchants, gems, talents] = await Promise.all([
    fetchItems(resolvedBracket, spec.id).catch((): MetaItem[] => []),
    fetchEnchants(resolvedBracket, spec.id).catch((): MetaEnchant[] => []),
    fetchGems(resolvedBracket, spec.id).catch((): MetaGem[] => []),
    fetchTalents(resolvedBracket, spec.id).catch((): MetaTalent[] => []),
  ])

  const itemGroups = sortedBySlotOrder(groupBy(items, (i) => i.slot.toUpperCase()))
  const enchantGroups = sortedBySlotOrder(groupBy(enchants, (e) => e.slot.toUpperCase()))
  const fiberGems = gems.filter((g) => g.socket_type === "FIBER")
  const gemGroups = Array.from(groupBy(gems.filter((g) => g.socket_type !== "FIBER"), (g) => g.socket_type)).map(([socketType, entries]) => ({ socketType, entries }))

  return (
    <div className="animate-page-in px-6 pb-8 space-y-8">
      <Equipment
        classSlug={cls.slug}
        itemGroups={itemGroups}
        enchantGroups={enchantGroups}
        gemGroups={gemGroups}
        fiberGems={fiberGems}
      />
      <Talents classSlug={cls.slug} talents={talents} />
    </div>
  )
}
