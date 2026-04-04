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
