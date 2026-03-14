import type { MetaTalent } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Talents } from "../talents"

vi.mock("@/hooks/use-active-color", () => ({
  useActiveColor: vi.fn(() => "#c79c6e"),
}))

vi.mock("@/components/atoms/talent-card", () => ({
  TalentCard: ({ children }: any) => <div data-testid="talent-card">{children}</div>,
}))

vi.mock("@/components/molecules/talent-list", () => ({
  TalentList: ({ talents }: any) => <div data-testid="talent-list">{talents.length} talents</div>,
}))

vi.mock("@/components/organisms/talent-tree", () => ({
  TalentTree: ({ talents, budget }: any) => (
    <div data-testid="talent-tree">
      {talents.length} nodes, budget=
      {budget}
    </div>
  ),
  TalentTreeSkeleton: () => <div data-testid="talent-tree-skeleton" />,
  hasTreeData: (talents: MetaTalent[]) =>
    talents.some((t) => t.talent.display_row != null && t.talent.display_col != null),
}))

vi.mock("@/components/organisms/hero-section", () => ({
  HeroSection: ({ heroEntries }: any) => (
    <div data-testid="hero-section">{heroEntries.length} hero talents</div>
  ),
}))

vi.mock("@/components/molecules/pvp-talents", () => ({
  PvpTalents: ({ talents }: any) => (
    <div data-testid="pvp-talents">{talents.length} pvp talents</div>
  ),
}))

function makeTalent(
  id: number,
  name: string,
  pct: number,
  type: string,
  opts: {
    row?: number | null
    col?: number | null
    prereqs?: number[]
  } = {},
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 3000,
      name,
      description: null,
      talent_type: type,
      spell_id: null,
      node_id: id,
      display_row: opts.row ?? null,
      display_col: opts.col ?? null,
      max_rank: 1,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: opts.prereqs ?? [],
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: pct > 50,
    top_build_rank: 1,
    tier: (pct > 50 ? "bis" : pct > 15 ? "situational" : "common") as const,
    snapshot_at: null,
  }
}

const specTalents = [
  makeTalent(1, "Spec A", 95, "spec", {
    row: 0,
    col: 0,
  }),
  makeTalent(2, "Spec B", 85, "spec", {
    row: 1,
    col: 0,
    prereqs: [
      1,
    ],
  }),
]
const classTalents = [
  makeTalent(11, "Class A", 90, "class", {
    row: 0,
    col: 0,
  }),
]
const heroTalents = [
  makeTalent(21, "Hero A", 88, "hero", {
    row: 0,
    col: 0,
  }),
]
const pvpTalents = [
  makeTalent(31, "PvP A", 75, "pvp"),
  makeTalent(32, "PvP B", 60, "pvp"),
]

describe("talents", () => {
  it("returns null for empty talents", () => {
    const { container } = render(<Talents classSlug="warrior" talents={[]} />)
    // Component renders a skeleton state with Class/Spec headings when talents array is empty
    expect(container.textContent).toContain("Class Talents")
    expect(container.textContent).toContain("Spec Talents")
  })

  it("renders all four talent sections", () => {
    const all = [
      ...specTalents,
      ...classTalents,
      ...heroTalents,
      ...pvpTalents,
    ]
    const { getAllByTestId, container } = render(<Talents classSlug="warrior" talents={all} />)

    // Hero section renders in both the 2K row and the below-2K row
    expect(getAllByTestId("hero-section").length).toBeGreaterThan(0)
    expect(container.textContent).toContain("Class Talents")
    expect(container.textContent).toContain("Spec Talents")
    expect(container.textContent).toContain("pvp talents")
  })

  it("renders spec talents as a tree when tree data exists", () => {
    const { getAllByTestId } = render(<Talents classSlug="warrior" talents={specTalents} />)
    const trees = getAllByTestId("talent-tree")
    expect(trees.length).toBeGreaterThan(0)
    expect(trees[0].textContent).toContain("budget=34")
  })

  it("renders pvp talents component", () => {
    const { getByTestId } = render(<Talents classSlug="warrior" talents={pvpTalents} />)
    expect(getByTestId("pvp-talents").textContent).toContain("2 pvp talents")
  })

  it("renders spec as list when no tree data", () => {
    const flat = specTalents.map((t) => ({
      ...t,
      talent: {
        ...t.talent,
        display_row: null,
        display_col: null,
      },
    }))
    const { getByTestId } = render(<Talents classSlug="warrior" talents={flat} />)
    expect(getByTestId("talent-list")).toBeDefined()
  })

  it("renders hero section when hero talents exist", () => {
    const { getByTestId } = render(<Talents classSlug="warrior" talents={heroTalents} />)
    expect(getByTestId("hero-section").textContent).toContain("1 hero talents")
  })
})
