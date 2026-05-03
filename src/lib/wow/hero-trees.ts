import {
  type HeroTreeConfig,
  type WowClassSlug,
  WOW_CLASSES,
} from "@/config/wow/classes/classes-config"
import type { MetaTalent } from "@/lib/api"

const HERO_TREES_BY_CLASS: Record<WowClassSlug, HeroTreeConfig[]> = WOW_CLASSES.reduce(
  (acc, cfg) => {
    acc[cfg.slug] = cfg.heroTrees ?? []
    return acc
  },
  {} as Record<WowClassSlug, HeroTreeConfig[]>,
)

// Match a set of hero talents to its tree by signature talent name.
export function identifyHeroTree(
  talents: MetaTalent[],
  classSlug: WowClassSlug,
): HeroTreeConfig | null {
  const trees = HERO_TREES_BY_CLASS[classSlug] ?? []
  if (trees.length === 0) return null

  const names = new Set(talents.map((t) => t.talent.name))
  return trees.find((t) => t.signatures.some((sig) => names.has(sig))) ?? null
}

// talents-heroclass-{class}-{tree}.webp — atlas slug omits hyphens.
export function heroTreeIconUrl(classSlug: WowClassSlug, treeSlug: string): string {
  const atlasClass = classSlug.replace(/-/g, "")
  return `https://wow.zamimg.com/images/wow/TextureAtlas/live/talents-heroclass-${atlasClass}-${treeSlug}.webp`
}
