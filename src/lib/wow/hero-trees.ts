import {
  type HeroTreeConfig,
  type WowClassSlug,
  WOW_CLASSES,
} from "@/config/wow/classes/classes-config"
import type { MetaTalent } from "@/lib/api"

// Class slug → list of hero trees, sourced from each class's own config file
// (e.g. src/config/wow/classes/rogue.ts). Keeping the data colocated with the
// rest of the per-class metadata (specs, icons, animations) avoids a second
// source of truth.
const HERO_TREES_BY_CLASS: Record<WowClassSlug, HeroTreeConfig[]> = WOW_CLASSES.reduce(
  (acc, cfg) => {
    acc[cfg.slug] = cfg.heroTrees ?? []
    return acc
  },
  {} as Record<WowClassSlug, HeroTreeConfig[]>,
)

/**
 * Match an arbitrary set of hero talents back to its tree config by checking
 * for any signature talent name. Returns null when no signature matches —
 * caller should hide the badge in that case.
 */
export function identifyHeroTree(
  talents: MetaTalent[],
  classSlug: WowClassSlug,
): HeroTreeConfig | null {
  const trees = HERO_TREES_BY_CLASS[classSlug] ?? []
  if (trees.length === 0) return null

  const names = new Set(talents.map((t) => t.talent.name))
  return trees.find((t) => t.signatures.some((sig) => names.has(sig))) ?? null
}

/**
 * Build the Wowhead-hosted Blizzard atlas URL for a hero tree icon.
 * Pattern: talents-heroclass-{class}-{tree}.webp
 * Atlas filenames omit the hyphen ("death-knight" → "deathknight").
 */
export function heroTreeIconUrl(classSlug: WowClassSlug, treeSlug: string): string {
  const atlasClass = classSlug.replace(/-/g, "")
  return `https://wow.zamimg.com/images/wow/TextureAtlas/live/talents-heroclass-${atlasClass}-${treeSlug}.webp`
}
