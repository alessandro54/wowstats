import type { MetaTalent } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { HeroSection } from "../hero-section"

vi.mock("@/components/molecules/talent-list", () => ({
  TalentList: ({ talents }: any) => (
    <div data-testid="talent-list">{talents.map((t: any) => t.talent.name).join(",")}</div>
  ),
}))

vi.mock("@/components/organisms/talent-tree", () => ({
  TalentTree: ({ talents }: any) => (
    <div data-testid="talent-tree">
      {talents.length}
      {" "}
      nodes
    </div>
  ),
  hasTreeData: (talents: MetaTalent[]) =>
    talents.some(t => t.talent.display_row != null && t.talent.display_col != null),
}))

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
}))

function makeTalent(
  id: number,
  name: string,
  pct: number,
  opts: { row?: number | null, col?: number | null, prereqs?: number[], nodeId?: number } = {},
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
      icon_url: null,
      prerequisite_node_ids: opts.prereqs ?? [],
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: pct > 50,
    top_build_rank: 1,
    snapshot_at: null,
  }
}

// Two disconnected components = two hero trees
const primaryTree = [
  makeTalent(1, "Primary A", 95, { row: 0, col: 0 }),
  makeTalent(2, "Primary B", 90, { row: 1, col: 0, prereqs: [1] }),
]
const altTree = [
  makeTalent(10, "Alt A", 40, { row: 0, col: 0, nodeId: 10 }),
  makeTalent(11, "Alt B", 35, { row: 1, col: 0, nodeId: 11, prereqs: [10] }),
]

describe("heroSection", () => {
  it("renders the Hero Talents heading", () => {
    const { container } = render(
      <HeroSection heroEntries={[...primaryTree, ...altTree]} activeColor="#c79c6e" />,
    )
    expect(container.textContent).toContain("Hero Talents")
  })

  it("renders the primary tree", () => {
    const { getByTestId } = render(
      <HeroSection heroEntries={primaryTree} activeColor="#c79c6e" />,
    )
    expect(getByTestId("talent-tree").textContent).toContain("2 nodes")
  })

  it("shows tooltip with alt tree when two trees exist", () => {
    const { getByTestId } = render(
      <HeroSection heroEntries={[...primaryTree, ...altTree]} activeColor="#c79c6e" />,
    )
    expect(getByTestId("tooltip-content").textContent).toContain("Alt")
  })

  it("does not render tooltip when only one tree exists", () => {
    const { queryByTestId } = render(
      <HeroSection heroEntries={primaryTree} activeColor="#c79c6e" />,
    )
    expect(queryByTestId("tooltip-content")).toBeNull()
  })

  it("returns null for empty entries", () => {
    const { container } = render(
      <HeroSection heroEntries={[]} activeColor="#c79c6e" />,
    )
    expect(container.innerHTML).toBe("")
  })

  it("falls back to TalentList when no tree data", () => {
    const flat = primaryTree.map(t => ({
      ...t,
      talent: { ...t.talent, display_row: null, display_col: null },
    }))
    const { getByTestId } = render(
      <HeroSection heroEntries={flat} activeColor="#c79c6e" />,
    )
    expect(getByTestId("talent-list")).toBeDefined()
  })
})
