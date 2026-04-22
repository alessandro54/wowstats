const API_URL = process.env.API_URL ?? "http://localhost:3000"

export type Trend = "up" | "down" | "stable" | "new"

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
  prev_usage_pct: number | null
  trend?: Trend
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
  prev_usage_pct: number | null
  trend?: Trend
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
  prev_usage_pct: number | null
  trend?: Trend
  snapshot_at: string
}

async function apiFetch<T>(
  path: string,
  params: Record<string, string>,
  locale?: string,
): Promise<T> {
  const url = new URL(path, API_URL)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  if (locale) url.searchParams.set("locale", locale)
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

export function fetchItems(bracket: string, specId: number, locale?: string): Promise<MetaItem[]> {
  return apiFetch(
    "/api/v1/pvp/meta/items",
    {
      bracket,
      spec_id: String(specId),
    },
    locale,
  )
}

export function fetchEnchants(
  bracket: string,
  specId: number,
  locale?: string,
): Promise<MetaEnchant[]> {
  return apiFetch(
    "/api/v1/pvp/meta/enchants",
    {
      bracket,
      spec_id: String(specId),
    },
    locale,
  )
}

export interface MetaStats {
  avg_ilvl: number | null
  stats: {
    VERSATILITY?: number
    MASTERY_RATING?: number
    HASTE_RATING?: number
    CRIT_RATING?: number
  }
}

export function fetchStats(bracket: string, specId: number, locale?: string): Promise<MetaStats> {
  return apiFetch(
    "/api/v1/pvp/meta/stats",
    {
      bracket,
      spec_id: String(specId),
    },
    locale,
  )
}

export function fetchGems(bracket: string, specId: number, locale?: string): Promise<MetaGem[]> {
  return apiFetch(
    "/api/v1/pvp/meta/gems",
    {
      bracket,
      spec_id: String(specId),
    },
    locale,
  )
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
  data_confidence: "low" | "medium" | "high"
  stale_count: number
}

export interface TalentsResponse {
  meta: TalentsMeta
  talents: MetaTalent[]
}

export async function fetchTalents(
  bracket: string,
  specId: number,
  locale?: string,
): Promise<TalentsResponse> {
  return apiFetch(
    "/api/v1/pvp/meta/talents",
    {
      bracket,
      spec_id: String(specId),
    },
    locale,
  )
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
  locale?: string,
): Promise<TopPlayersResponse> {
  const params: Record<string, string> = {
    bracket,
    spec_id: String(specId),
  }
  if (region) params.region = region
  return apiFetch("/api/v1/pvp/meta/top_players", params, locale)
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

export interface CharacterEquipmentItem {
  slot: string
  item_level: number | null
  quality: string | null
  blizzard_id: number | null
  name: string | null
  icon_url: string | null
  enchant: string | null
  sockets: string[]
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
  primary_spec_id: number | null
  stat_pcts: Record<string, number>
  pvp_entries: CharacterPvpEntry[]
  equipment: CharacterEquipmentItem[]
  talents: MetaTalent[]
}

export interface StatPriorityEntry {
  stat: string
  median: number
}

export interface StatPriorityResponse {
  bracket: string
  spec_id: number
  stats: StatPriorityEntry[]
}

export function fetchStatPriority(
  bracket: string,
  specId: number,
  locale?: string,
): Promise<StatPriorityResponse> {
  return apiFetch(
    "/api/v1/pvp/meta/stat_priority",
    {
      bracket,
      spec_id: String(specId),
    },
    locale,
  )
}

export async function fetchCharacter(
  region: string,
  realm: string,
  name: string,
  locale?: string,
): Promise<CharacterProfile | null> {
  try {
    return await apiFetch(`/api/v1/characters/${region}/${realm}/${name}`, {}, locale)
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
  total_in_bracket: number
  total_games: number
  total_wins: number
  mean_rating: number
  theta_hat: number
  b_k: number
  rating_ci_low: number
  rating_ci_high: number
  raw_winrate: number
  wr_hat: number
  score: number
}

export interface ClassDistributionResponse {
  season_id: number
  bracket: string
  region: string
  total_entries: number
  classes: ClassDistributionSpec[]
}

export function fetchClassDistribution(
  params: {
    seasonId?: string
    bracket: string
    region: string
    role: string
  },
  locale?: string,
): Promise<ClassDistributionResponse> {
  const query: Record<string, string> = {
    bracket: params.bracket,
    region: params.region,
    role: params.role,
    new_model: "true",
  }
  if (params.seasonId) {
    query.season_id = params.seasonId
  }
  return apiFetch("/api/v1/pvp/meta/class_distribution", query, locale)
}
