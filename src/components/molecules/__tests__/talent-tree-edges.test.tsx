import type { MetaTalent } from "@/lib/api"
import type { TalentNode } from "@/lib/utils/talent-tree"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TalentEdges } from "../talent-tree-edges"

function makeTalent(id: number): MetaTalent {
  return {
    id, talent: { id, blizzard_id: id + 5000, name: `Talent ${id}`, description: null, talent_type: "spec", spell_id: null, node_id: id, display_row: id - 1, display_col: 0, max_rank: 1, default_points: 0, icon_url: null, prerequisite_node_ids: [] },
    usage_count: 100, usage_pct: 85, in_top_build: true, top_build_rank: 1, tier: "bis", snapshot_at: null,
  }
}

function makeNode(id: number, row: number): TalentNode {
  const primary = makeTalent(id)
  return { nodeId: id, row, col: 0, maxRank: 1, defaultPoints: 0, prereqIds: [], primary, isChoice: false, all: [primary] }
}

const nodeMap = new Map<number, TalentNode>([
  [1, makeNode(1, 0)],
  [2, makeNode(2, 1)],
])

const edgeSet = new Set(["1→2"])

describe("talentEdges", () => {
  it("renders an SVG element", () => {
    const { container } = render(
      <TalentEdges edgeSet={edgeSet} nodeMap={nodeMap} nodeCX={() => 50} nodeY={(r) => r * 60} svgW={200} svgH={200} activeColor="#c79c6e" />,
    )
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders line elements for edges", () => {
    const { container } = render(
      <TalentEdges edgeSet={edgeSet} nodeMap={nodeMap} nodeCX={() => 50} nodeY={(r) => r * 60} svgW={200} svgH={200} activeColor="#c79c6e" />,
    )
    const lines = container.querySelectorAll("line")
    expect(lines.length).toBe(2) // visible line + transparent hit area
  })

  it("sets aria-hidden on SVG", () => {
    const { container } = render(
      <TalentEdges edgeSet={edgeSet} nodeMap={nodeMap} nodeCX={() => 50} nodeY={(r) => r * 60} svgW={200} svgH={200} activeColor="#c79c6e" />,
    )
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
  })

  it("skips edges with missing nodes", () => {
    const badEdges = new Set(["1→999"])
    const { container } = render(
      <TalentEdges edgeSet={badEdges} nodeMap={nodeMap} nodeCX={() => 50} nodeY={(r) => r * 60} svgW={200} svgH={200} activeColor="#c79c6e" />,
    )
    expect(container.querySelectorAll("line").length).toBe(0)
  })
})
