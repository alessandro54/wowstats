import type { MetaTalent } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { hasTreeData, TalentTree } from "../talent-tree"

vi.mock("@/components/molecules/talent-tree-edges", () => ({
  TalentEdges: () => <svg data-testid="talent-edges" />,
}))

vi.mock("@/components/molecules/talent-tree-node", () => ({
  TalentNodeCard: ({ node }: any) => <div data-testid="talent-node">{node.primary.talent.name}</div>,
}))

function makeTalent(
  id: number,
  name: string,
  pct: number,
  row: number,
  col: number,
  prereqs: number[] = [],
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 1000,
      name,
      description: null,
      talent_type: "spec",
      spell_id: null,
      node_id: id,
      display_row: row,
      display_col: col,
      max_rank: 1,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: prereqs,
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: pct > 50,
    top_build_rank: 1,
    tier: (pct > 50 ? "bis" : pct > 15 ? "situational" : "common") as const,
    snapshot_at: null,
  }
}

const tree: MetaTalent[] = [
  makeTalent(1, "Root", 99, 0, 1),
  makeTalent(2, "Left", 80, 1, 0, [1]),
  makeTalent(3, "Right", 60, 1, 2, [1]),
  makeTalent(4, "Bottom", 90, 2, 1, [2, 3]),
]

describe("talentTree", () => {
  it("renders all talent nodes", () => {
    const { getAllByTestId } = render(
      <TalentTree talents={tree} activeColor="#c79c6e" />,
    )
    expect(getAllByTestId("talent-node")).toHaveLength(4)
  })

  it("renders the edges SVG", () => {
    const { getByTestId } = render(
      <TalentTree talents={tree} activeColor="#c79c6e" />,
    )
    expect(getByTestId("talent-edges")).toBeDefined()
  })

  it("returns null for empty talents", () => {
    const { container } = render(
      <TalentTree talents={[]} activeColor="#c79c6e" />,
    )
    expect(container.innerHTML).toBe("")
  })

  it("shows legend when budget is provided", () => {
    const { container } = render(
      <TalentTree talents={tree} activeColor="#c79c6e" budget={3} />,
    )
    expect(container.textContent).toContain("BiS")
    expect(container.textContent).toContain("Situational")
  })

  it("does not show legend without budget", () => {
    const { container } = render(
      <TalentTree talents={tree} activeColor="#c79c6e" />,
    )
    expect(container.textContent).not.toContain("BiS")
  })

  it("hasTreeData returns true when rows/cols exist", () => {
    expect(hasTreeData(tree)).toBe(true)
  })

  it("hasTreeData returns false when no row/col data", () => {
    const flat = tree.map(t => ({
      ...t,
      talent: { ...t.talent, display_row: null, display_col: null },
    }))
    expect(hasTreeData(flat)).toBe(false)
  })
})
