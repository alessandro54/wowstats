const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000"

export type MetaItem = {
  id: number
  item: {
    id: number
    blizzard_id: number
    name: string
    icon_url: string
    quality: string
  }
  slot: string
  usage_count: number
  usage_pct: number
  snapshot_at: string
  crafted: boolean
  top_crafting_stats: string[]
}

export type MetaEnchant = {
  id: number
  enchantment: {
    id: number
    blizzard_id: number
    name: string
  }
  slot: string
  usage_count: number
  usage_pct: number
  snapshot_at: string
}

export type MetaGem = {
  id: number
  item: {
    id: number
    blizzard_id: number
    name: string
    icon_url: string
    quality: string
  }
  slot: string
  socket_type: string
  usage_count: number
  usage_pct: number
  snapshot_at: string
}

async function apiFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(path, BACKEND_URL)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  const res = await fetch(url.toString(), { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`Backend ${path} failed: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export function fetchItems(bracket: string, specId: number): Promise<MetaItem[]> {
  return apiFetch("/api/v1/pvp/meta/items", { bracket, spec_id: String(specId) })
}

export function fetchEnchants(bracket: string, specId: number): Promise<MetaEnchant[]> {
  return apiFetch("/api/v1/pvp/meta/enchants", { bracket, spec_id: String(specId) })
}

export function fetchGems(bracket: string, specId: number): Promise<MetaGem[]> {
  return apiFetch("/api/v1/pvp/meta/gems", { bracket, spec_id: String(specId) })
}

export type MetaTalent = {
  id: number | null
  talent: {
    id: number
    blizzard_id: number
    name: string
    talent_type: string
    spell_id: number | null
    node_id: number | null
    display_row: number | null
    display_col: number | null
    max_rank: number
    icon_url: string | null
    prerequisite_node_ids: number[]
  }
  usage_count:  number
  usage_pct:    number
  in_top_build: boolean
  snapshot_at:  string | null
}

export function fetchTalents(bracket: string, specId: number): Promise<MetaTalent[]> {
  return apiFetch("/api/v1/pvp/meta/talents", { bracket, spec_id: String(specId) })
}
