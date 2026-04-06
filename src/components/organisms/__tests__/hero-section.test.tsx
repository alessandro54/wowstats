import type { MetaTalent } from "@/lib/api"
import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { HeroSection } from "../hero-section"

vi.mock("@/components/molecules/hero-tree", () => ({
  HeroTree: ({ talents }: any) => <div data-testid="hero-tree">{talents.length} nodes</div>,
}))

vi.mock("@/components/atoms/talent-card", () => ({
  TalentCard: ({ children, style, className }: any) => (
    <div data-testid="talent-card" style={style} className={className}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/atoms/corner-peel", () => ({
  CornerPeel: ({ onClick, label }: any) => (
    <button data-testid="corner-peel" onClick={onClick}>
      {label}
    </button>
  ),
}))

function makeTalent(
  id: number,
  name: string,
  pct: number,
  opts: {
    row?: number | null
    col?: number | null
    prereqs?: number[]
    nodeId?: number
  } = {},
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 5000,
      name,
      description: null,
      talent_type: "hero",
      spell_id: null,
      node_id: opts.nodeId ?? id,
      display_row: opts.row ?? 0,
      display_col: opts.col ?? 0,
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

// Two disconnected components = two hero trees
const primaryTree = [
  makeTalent(1, "Primary A", 95, {
    row: 0,
    col: 0,
  }),
  makeTalent(2, "Primary B", 90, {
    row: 1,
    col: 0,
    prereqs: [
      1,
    ],
  }),
]
const altTree = [
  makeTalent(10, "Alt A", 40, {
    row: 0,
    col: 0,
    nodeId: 10,
  }),
  makeTalent(11, "Alt B", 35, {
    row: 1,
    col: 0,
    nodeId: 11,
    prereqs: [
      10,
    ],
  }),
]

describe("heroSection", () => {
  it("renders hero section with trees", () => {
    const { container } = render(
      <HeroSection
        heroEntries={[
          ...primaryTree,
          ...altTree,
        ]}
        activeColor="#c79c6e"
        classSlug="warrior"
      />,
    )
    expect(container.querySelector("section")).toBeInTheDocument()
  })

  it("renders the primary tree", () => {
    const { getAllByTestId } = render(
      <HeroSection heroEntries={primaryTree} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(getAllByTestId("hero-tree")[0].textContent).toContain("2 nodes")
  })

  it("shows corner peel when two trees exist", () => {
    const { getByTestId } = render(
      <HeroSection
        heroEntries={[
          ...primaryTree,
          ...altTree,
        ]}
        activeColor="#c79c6e"
        classSlug="warrior"
      />,
    )
    expect(getByTestId("corner-peel")).toBeInTheDocument()
    expect(getByTestId("corner-peel").textContent).toContain("Alt")
  })

  it("does not render corner peel when only one tree exists", () => {
    const { queryByTestId } = render(
      <HeroSection heroEntries={primaryTree} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(queryByTestId("corner-peel")).toBeNull()
  })

  it("returns null for empty entries", () => {
    const { container } = render(
      <HeroSection heroEntries={[]} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(container.innerHTML).toBe("")
  })

  it("renders both primary and alt tree cards when two trees exist", () => {
    const { getAllByTestId } = render(
      <HeroSection
        heroEntries={[
          ...primaryTree,
          ...altTree,
        ]}
        activeColor="#c79c6e"
        classSlug="warrior"
      />,
    )
    const cards = getAllByTestId("talent-card")
    expect(cards.length).toBe(2)
  })

  it("toggles corner peel label on click", () => {
    const { getByTestId } = render(
      <HeroSection
        heroEntries={[
          ...primaryTree,
          ...altTree,
        ]}
        activeColor="#c79c6e"
        classSlug="warrior"
      />,
    )
    const peel = getByTestId("corner-peel")
    expect(peel.textContent).toContain("Alt")
    fireEvent.click(peel)
    expect(peel.textContent).toContain("Main")
  })
})
