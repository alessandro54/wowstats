import type { MetaTalent } from "@/lib/api"
import type { TalentNode } from "@/lib/utils/talent-tree"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TalentNodeCard } from "../talent-tree-node"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("@/components/atoms/talent-icon", () => ({
  TalentIcon: ({ talent }: any) => (
    <div data-testid={`talent-${talent.talent.id}`}>{talent.talent.name}</div>
  ),
}))

function makeTalent(
  id: number,
  name: string,
  pct: number,
  opts: {
    tier?: "bis" | "situational" | "common"
    inTopBuild?: boolean
    topBuildRank?: number
    maxRank?: number
  } = {},
): MetaTalent {
  const { tier = "bis", inTopBuild = pct > 50, topBuildRank = 1, maxRank = 1 } = opts
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 5000,
      name,
      description: null,
      talent_type: "spec",
      spell_id: null,
      node_id: id,
      display_row: 0,
      display_col: 0,
      max_rank: maxRank,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: inTopBuild,
    top_build_rank: topBuildRank,
    tier,
    snapshot_at: null,
  }
}

function makeNode(overrides: Partial<TalentNode> = {}): TalentNode {
  const primary = makeTalent(1, "Mortal Strike", 85)
  return {
    nodeId: 1,
    row: 0,
    col: 0,
    maxRank: 1,
    defaultPoints: 0,
    prereqIds: [],
    primary,
    isChoice: false,
    isRanked: false,
    all: [
      primary,
    ],
    ...overrides,
  }
}

describe("talentNodeCard", () => {
  it("renders talent name via TalentIcon", () => {
    const { getByTestId } = render(
      <TalentNodeCard
        node={makeNode()}
        left={0}
        top={0}
        fullOpacity
        onlyChoicePct={false}
        activeColor="#c79c6e"
      />,
    )
    expect(getByTestId("talent-1")).toBeInTheDocument()
  })

  it("applies absolute positioning", () => {
    const { container } = render(
      <TalentNodeCard
        node={makeNode()}
        left={100}
        top={200}
        fullOpacity
        onlyChoicePct={false}
        activeColor="#c79c6e"
      />,
    )
    const el = container.firstElementChild as HTMLElement
    expect(el.style.left).toBe("100px")
    expect(el.style.top).toBe("200px")
  })

  it("shows percentage for choice nodes on meta page", () => {
    const alt = makeTalent(2, "Overpower", 40, {
      tier: "common",
    })
    const node = makeNode({
      isChoice: true,
      all: [
        makeTalent(1, "Mortal Strike", 85),
        alt,
      ],
    })
    const { container } = render(
      <TalentNodeCard
        node={node}
        left={0}
        top={0}
        fullOpacity={false}
        onlyChoicePct={false}
        activeColor="#c79c6e"
      />,
    )
    expect(container.textContent).toContain("85%")
  })

  it("shows percentage for non-top-build nodes", () => {
    const primary = makeTalent(1, "Weak", 20, {
      tier: "common",
    })
    const node = makeNode({
      primary,
      all: [
        primary,
      ],
    })
    const { container } = render(
      <TalentNodeCard
        node={node}
        left={0}
        top={0}
        fullOpacity={false}
        onlyChoicePct={false}
        activeColor="#c79c6e"
      />,
    )
    expect(container.textContent).toContain("20%")
  })

  it("shows percentage for situational nodes", () => {
    const primary = makeTalent(1, "Shield Block", 39, {
      tier: "situational",
    })
    const node = makeNode({
      primary,
      all: [
        primary,
      ],
    })
    const { container } = render(
      <TalentNodeCard
        node={node}
        left={0}
        top={0}
        fullOpacity={false}
        onlyChoicePct={false}
        activeColor="#c79c6e"
      />,
    )
    expect(container.textContent).toContain("39%")
  })

  it("shows inline % and rank for ranked nodes on meta page", () => {
    const v1 = makeTalent(41, "Impale", 90, {
      topBuildRank: 1,
      maxRank: 2,
    })
    const v2 = makeTalent(42, "Impale", 85, {
      topBuildRank: 1,
      maxRank: 2,
    })
    const node = makeNode({
      maxRank: 2,
      isRanked: true,
      primary: v2,
      all: [
        v1,
        v2,
      ],
    })
    const { container } = render(
      <TalentNodeCard
        node={node}
        left={0}
        top={0}
        fullOpacity={false}
        onlyChoicePct={false}
        activeColor="#c79c6e"
        budget={34}
      />,
    )
    expect(container.textContent).toContain("90%")
    expect(container.textContent).toContain("2/2")
  })

  it("shows rank on character page (hideStats)", () => {
    const v1 = makeTalent(41, "Impale", 90, {
      topBuildRank: 1,
      maxRank: 2,
    })
    const v2 = makeTalent(42, "Impale", 85, {
      topBuildRank: 1,
      maxRank: 2,
    })
    const node = makeNode({
      maxRank: 2,
      isRanked: true,
      primary: v2,
      all: [
        v1,
        v2,
      ],
    })
    const { container } = render(
      <TalentNodeCard
        node={node}
        left={0}
        top={0}
        fullOpacity
        onlyChoicePct={false}
        activeColor="#c79c6e"
        hideStats
      />,
    )
    expect(container.textContent).toContain("2/2")
    expect(container.textContent).not.toContain("%")
  })

  it("hides percentage for BIS non-variable nodes", () => {
    const primary = makeTalent(1, "Mortal Strike", 98, {
      tier: "bis",
    })
    const node = makeNode({
      primary,
      all: [
        primary,
      ],
    })
    const { container } = render(
      <TalentNodeCard
        node={node}
        left={0}
        top={0}
        fullOpacity={false}
        onlyChoicePct={false}
        activeColor="#c79c6e"
        budget={34}
      />,
    )
    expect(container.textContent).not.toContain("%")
  })
})
