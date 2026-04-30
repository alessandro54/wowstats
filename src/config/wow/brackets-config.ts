export const BRACKETS = [
  {
    slug: "2v2",
    label: "2v2",
    description: "Two vs Two Arena",
  },
  {
    slug: "3v3",
    label: "3v3",
    description: "Three vs Three Arena",
  },
  {
    slug: "shuffle",
    label: "Solo",
    description: "6-player round-robin arena",
  },
  {
    slug: "blitz",
    label: "Blitz",
    description: "10-player battlegrounds",
  },
  //{ slug: "rbg", label: "RBG", description: "Rated Battleground" },
] as const

export type BracketSlug = (typeof BRACKETS)[number]["slug"]

export const BRACKET_COLORS: Record<string, string> = {
  "2v2": "#7ec8e3",
  "3v3": "#c8a84b",
  shuffle: "#7b68ee",
  blitz: "#ff6b35",
}

/** Returns the color for any bracket string (handles suffixed slugs like shuffle-overall). */
export function bracketColor(bracket: string): string {
  if (bracket.startsWith("shuffle")) return BRACKET_COLORS.shuffle
  if (bracket.startsWith("blitz")) return BRACKET_COLORS.blitz
  return BRACKET_COLORS[bracket] ?? "#888888"
}
