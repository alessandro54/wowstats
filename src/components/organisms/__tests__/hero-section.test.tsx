import { act, fireEvent, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { MetaTalent } from "@/lib/api"

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

// Make signature names line up with the warrior hero-tree config so
// identifyHeroTree picks a real tree instead of returning null.
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
    tier: pct > 50 ? ("bis" as const) : pct > 15 ? ("situational" as const) : ("common" as const),
  }
}

// Two disconnected components = two hero trees. Names match warrior signatures.
const primaryTree = [
  makeTalent(1, "Lightning Strikes", 95, {
    row: 0,
    col: 0,
  }),
  makeTalent(2, "Thorim's Might", 90, {
    row: 1,
    col: 0,
    prereqs: [
      1,
    ],
  }),
]
const altTree = [
  makeTalent(10, "Slayer's Dominance", 40, {
    row: 0,
    col: 0,
    nodeId: 10,
  }),
  makeTalent(11, "Imminent Demise", 35, {
    row: 1,
    col: 0,
    nodeId: 11,
    prereqs: [
      10,
    ],
  }),
]

describe("heroSection", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })
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

  it("renders one card with current tree only (no flip stack)", () => {
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
    expect(getAllByTestId("talent-card").length).toBe(1)
    expect(getAllByTestId("hero-tree").length).toBe(1)
  })

  it("shows a switch button when more than one tree exists", () => {
    const { getByRole } = render(
      <HeroSection
        heroEntries={[
          ...primaryTree,
          ...altTree,
        ]}
        activeColor="#c79c6e"
        classSlug="warrior"
      />,
    )
    const button = getByRole("button")
    expect(button.textContent?.toLowerCase()).toContain("switch to")
    // The "next" tree's name should appear in the label.
    expect(button.textContent).toContain("Slayer")
  })

  it("does not render a switch button when only one tree exists", () => {
    const { queryByRole } = render(
      <HeroSection heroEntries={primaryTree} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(queryByRole("button")).toBeNull()
  })

  it("cycles to the next tree when the switch button is clicked", () => {
    const { getByRole, getAllByTestId } = render(
      <HeroSection
        heroEntries={[
          ...primaryTree,
          ...altTree,
        ]}
        activeColor="#c79c6e"
        classSlug="warrior"
      />,
    )
    expect(getAllByTestId("hero-tree")[0].textContent).toContain("2 nodes")
    fireEvent.click(getByRole("button"))
    // Cycle is async (fade-out → swap → fade-in). Flush the timer.
    act(() => {
      vi.advanceTimersByTime(300)
    })
    const buttonAfter = getByRole("button")
    expect(buttonAfter.textContent).toContain("Mountain Thane")
  })

  it("returns null for empty entries", () => {
    const { container } = render(
      <HeroSection heroEntries={[]} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(container.innerHTML).toBe("")
  })
})
