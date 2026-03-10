const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000"

export interface MetaItem {
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

export interface MetaEnchant {
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

export interface MetaGem {
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
  const res = await fetch(url.toString(), {
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Backend ${path} failed: ${res.status} ${res.statusText}`)
  const json = await res.json()
  if (
    json !== null &&
    typeof json === "object" &&
    "talents" in json &&
    !Array.isArray(json.talents)
  ) {
    console.error(`[apiFetch] unexpected shape at ${path}:`, JSON.stringify(json).slice(0, 300))
  }
  return json as T
}

export function fetchItems(bracket: string, specId: number): Promise<MetaItem[]> {
  return apiFetch("/api/v1/pvp/meta/items", {
    bracket,
    spec_id: String(specId),
  })
}

export function fetchEnchants(bracket: string, specId: number): Promise<MetaEnchant[]> {
  return apiFetch("/api/v1/pvp/meta/enchants", {
    bracket,
    spec_id: String(specId),
  })
}

export function fetchGems(bracket: string, specId: number): Promise<MetaGem[]> {
  return apiFetch("/api/v1/pvp/meta/gems", {
    bracket,
    spec_id: String(specId),
  })
}

export interface MetaTalent {
  id: number | null
  talent: {
    id: number
    blizzard_id: number
    name: string
    description: string | null
    talent_type: string
    spell_id: number | null
    node_id: number | null
    display_row: number | null
    display_col: number | null
    max_rank: number
    default_points: number
    icon_url: string | null
    prerequisite_node_ids: number[]
  }
  usage_count: number
  usage_pct: number
  in_top_build: boolean
  top_build_rank: number
  tier: "bis" | "situational" | "common"
  snapshot_at: string | null
}

export interface TalentsMeta {
  bracket: string
  spec_id: number
  total_players: number
  total_weighted: number
  snapshot_at: string | null
}

export interface TalentsResponse {
  meta: TalentsMeta
  talents: MetaTalent[]
}

export async function fetchTalents(bracket: string, specId: number): Promise<TalentsResponse> {
  return apiFetch("/api/v1/pvp/meta/talents", {
    bracket,
    spec_id: String(specId),
  })
}

export interface TopPlayer {
  name: string
  realm: string
  region: string
  rating: number
  wins: number
  losses: number
  rank: number | null
  score: number
  avatar_url: string | null
  class_slug: string
}

export interface TopPlayersResponse {
  bracket: string
  spec_id: number
  regions: string[]
  players: TopPlayer[]
  snapshot_at: string | null
}

export function fetchTopPlayers(
  bracket: string,
  specId: number,
  region?: string,
): Promise<TopPlayersResponse> {
  const params: Record<string, string> = {
    bracket,
    spec_id: String(specId),
  }
  if (region) params.region = region
  return apiFetch("/api/v1/pvp/meta/top_players", params)
}

export interface CharacterPvpEntry {
  bracket: string
  region: string
  rating: number
  wins: number
  losses: number
  rank: number | null
  spec_id: number | null
}

export interface CharacterProfile {
  name: string
  realm: string
  region: string
  class_slug: string
  race: string | null
  faction: string | null
  avatar_url: string | null
  inset_url: string | null
  pvp_entries: CharacterPvpEntry[]
}

export interface StatPriorityEntry {
  stat: string
  count: number
  pct: number
}

export interface StatPriorityResponse {
  bracket: string
  spec_id: number
  stats: StatPriorityEntry[]
}

export function fetchStatPriority(bracket: string, specId: number): Promise<StatPriorityResponse> {
  return apiFetch("/api/v1/pvp/meta/stat_priority", {
    bracket,
    spec_id: String(specId),
  })
}

export async function fetchCharacter(
  region: string,
  realm: string,
  name: string,
): Promise<CharacterProfile | null> {
  try {
    return await apiFetch(`/api/v1/characters/${region}/${realm}/${name}`, {})
  } catch {
    return null
  }
}

export interface ClassDistributionSpec {
  class: string
  spec: string
  spec_id: number
  role: string
  count: number
  total_games: number
  total_wins: number
  mean_rating: number
  p90_rating: number
  shrunk_winrate: number
  shrunk_rating: number
  volume_raw: number
  games_share: number
  percentage: number
  winrate_score: number
  rating_score: number
  power_score: number
  presence_score: number
  volume_factor: number
  meta_score: number
  hidden_score: number
}

export interface ClassDistributionResponse {
  season_id: number
  bracket: string
  region: string
  total_entries: number
  classes: ClassDistributionSpec[]
}

export function fetchClassDistribution(params: {
  seasonId: string
  bracket: string
  region: string
  role: string
}): Promise<ClassDistributionResponse> {
  return apiFetch("/api/v1/pvp/meta/class_distribution", {
    season_id: params.seasonId,
    bracket: params.bracket,
    region: params.region,
    role: params.role,
  })
}
