/** Maps frontend class slugs (kebab-case) to Blizzard API slugs (no separator). */
export const API_CLASS_SLUG: Record<string, string> = {
  "death-knight": "deathknight",
  "demon-hunter": "demonhunter",
}

/** Resolves the API bracket string, handling shuffle's class-spec suffix. */
export function apiBracket(bracket: string, classSlug: string, specSlug: string): string {
  if (bracket === "shuffle") {
    const apiClass = API_CLASS_SLUG[classSlug] ?? classSlug
    return `shuffle-${apiClass}-${specSlug}`
  }
  return bracket
}

export type Tier = "S+" | "S" | "A" | "B" | "C" | "D"

/** Fixed-cutoff tiers for arena brackets (natural spread in scores). */
export function tier(normPct: number): Tier {
  if (normPct >= 94) return "S+"
  if (normPct >= 84) return "S"
  if (normPct >= 64) return "A"
  if (normPct >= 44) return "B"
  if (normPct >= 24) return "C"
  return "D"
}

/** Percentile-based tiers for solo brackets (shuffle/blitz) where scores compress. */
export function tierByPercentile(rank: number, total: number): Tier {
  const pct = rank / total
  if (pct <= 0.04) return "S+"
  if (pct <= 0.15) return "S"
  if (pct <= 0.35) return "A"
  if (pct <= 0.6) return "B"
  if (pct <= 0.82) return "C"
  return "D"
}

export const TIER_COLORS: Record<Tier, string> = {
  "S+": "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/40",
  S: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40",
  A: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40",
  B: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40",
  C: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40",
  D: "bg-muted/40 text-muted-foreground border border-border",
}

export const TIERLIST_LINKS = [
  {
    label: "2v2 Tierlist",
    href: "/pvp/meta/2v2/dps",
  },
  {
    label: "3v3 Tierlist",
    href: "/pvp/meta/3v3/dps",
  },
  {
    label: "Shuffle Tierlist",
    href: "/pvp/meta/shuffle-overall/dps",
  },
  {
    label: "Blitz Tierlist",
    href: "/pvp/meta/blitz-overall/dps",
  },
] as const

export const FOOTER_LINKS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
  {
    href: "/privacy",
    label: "Privacy",
  },
  {
    href: "/terms",
    label: "Terms",
  },
] as const
