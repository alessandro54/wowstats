import { describe, expect, it } from "vitest"
import type { MetaTalent } from "@/lib/api"
import type { TalentNode } from "@/lib/utils/talent-tree"
import { investedRank } from "@/lib/utils/talent-node-utils"

function makeTalent(overrides: Partial<MetaTalent> = {}): MetaTalent {
  return {
    id: 1,
    talent: {
      id: 1,
      blizzard_id: 1001,
      name: "Test Talent",
      talent_type: "spec",
      spell_id: null,
      node_id: 10,
      display_row: 0,
      display_col: 0,
      max_rank: 4,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: [],
    },
    usage_count: 50,
    usage_pct: 50.0,
    in_top_build: true,
    top_build_rank: 4,
    tier: "bis",
    ...overrides,
  }
}

function makeNode(overrides: Partial<TalentNode> = {}): TalentNode {
  const primary = makeTalent()
  return {
    nodeId: 10,
    row: 0,
    col: 0,
    maxRank: 4,
    defaultPoints: 0,
    prereqIds: [],
    primary,
    isChoice: false,
    isRanked: true,
    all: [
      primary,
    ],
    ...overrides,
  }
}

describe("investedRank", () => {
  it("returns primary top_build_rank for non-ranked nodes", () => {
    const t = makeTalent({
      top_build_rank: 1,
    })
    const node = makeNode({
      isRanked: false,
      all: [
        t,
      ],
      primary: t,
    })
    expect(investedRank(node)).toBe(1)
  })

  it("returns 0 when no in_top_build variants", () => {
    const t = makeTalent({
      in_top_build: false,
      top_build_rank: 2,
    })
    const node = makeNode({
      all: [
        t,
      ],
      primary: t,
    })
    expect(investedRank(node)).toBe(0)
  })

  it("returns max not sum — two variants each with tbr=1 should give 1, not 2", () => {
    // Bug scenario: two rank-1 variants both in_top_build → sum=2, max=1
    // max=1 is correct; sum=2 would wrongly show 2/4
    const v1 = makeTalent({
      top_build_rank: 1,
      in_top_build: true,
    })
    const v2 = makeTalent({
      top_build_rank: 1,
      in_top_build: true,
    })
    const node = makeNode({
      all: [
        v1,
        v2,
      ],
      primary: v1,
      maxRank: 4,
    })
    expect(investedRank(node)).toBe(1)
  })

  it("returns highest rank when variants have different top_build_ranks", () => {
    // Old variant (pre-patch tbr=2) coexists with new variant (post-patch tbr=4)
    const old = makeTalent({
      top_build_rank: 2,
      in_top_build: true,
    })
    const fresh = makeTalent({
      top_build_rank: 4,
      in_top_build: true,
    })
    const node = makeNode({
      all: [
        old,
        fresh,
      ],
      primary: fresh,
      maxRank: 4,
    })
    expect(investedRank(node)).toBe(4)
  })

  it("clamps to maxRank", () => {
    const t = makeTalent({
      top_build_rank: 5,
      in_top_build: true,
    })
    const node = makeNode({
      all: [
        t,
      ],
      primary: t,
      maxRank: 4,
    })
    expect(investedRank(node)).toBe(4)
  })

  it("handles single in_top_build variant correctly", () => {
    const t = makeTalent({
      top_build_rank: 4,
      in_top_build: true,
    })
    const node = makeNode({
      all: [
        t,
      ],
      primary: t,
    })
    expect(investedRank(node)).toBe(4)
  })
})
