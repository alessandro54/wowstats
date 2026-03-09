import type { MetaTalent } from "@/lib/api"
import { describe, expect, it } from "vitest"
import { buildEdgeSet, buildNodeMap, buildTopNodeIds, hasTreeData, splitHeroTrees } from "./talent-tree"

// ─── helpers ─────────────────────────────────────────────────────────────────

function makeTalent(
  id: number,
  nodeId: number | null,
  row: number | null,
  col: number | null,
  usagePct: number,
  maxRank = 1,
  prereqs: number[] = [],
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: 10000 + id,
      name: `Talent ${id}`,
      description: null,
      talent_type: "active",
      spell_id: null,
      node_id: nodeId,
      display_row: row,
      display_col: col,
      max_rank: maxRank,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: prereqs,
    },
    usage_count: Math.round(usagePct * 10),
    usage_pct: usagePct,
    in_top_build: true,
    top_build_rank: maxRank,
    tier: usagePct > 50 ? "bis" : usagePct > 15 ? "situational" : "common",
    snapshot_at: "2026-03-02T00:00:00Z",
  }
}

// ─── buildNodeMap ─────────────────────────────────────────────────────────────

describe("buildNodeMap", () => {
  it("creates one node per unique node_id", () => {
    const talents = [makeTalent(1, 10, 1, 1, 80), makeTalent(2, 20, 2, 1, 60)]
    const map = buildNodeMap(talents)
    expect(map.size).toBe(2)
  })

  it("sets node properties from the talent", () => {
    const talent = makeTalent(1, 10, 3, 4, 75, 2)
    const map = buildNodeMap([talent])
    const node = map.get(10)!
    expect(node.nodeId).toBe(10)
    expect(node.row).toBe(3)
    expect(node.col).toBe(4)
    expect(node.maxRank).toBe(2)
    expect(node.isChoice).toBe(false)
    expect(node.all).toHaveLength(1)
  })

  it("marks a node as choice when two talents share the same node_id", () => {
    const talents = [makeTalent(1, 10, 1, 1, 70), makeTalent(2, 10, 1, 1, 30)]
    const map = buildNodeMap(talents)
    const node = map.get(10)!
    expect(node.isChoice).toBe(true)
    expect(node.all).toHaveLength(2)
  })

  it("sets primary to the talent with the highest usage_pct", () => {
    const talents = [makeTalent(1, 10, 1, 1, 30), makeTalent(2, 10, 1, 1, 80)]
    const map = buildNodeMap(talents)
    expect(map.get(10)!.primary.talent.id).toBe(2)
  })

  it("primary updates even when the higher-pct talent is added second", () => {
    const talents = [makeTalent(1, 10, 1, 1, 20), makeTalent(2, 10, 1, 1, 95)]
    const map = buildNodeMap(talents)
    expect(map.get(10)!.primary.usage_pct).toBe(95)
  })

  it("skips talents with null node_id, display_row, or display_col", () => {
    const talents = [
      makeTalent(1, null, 1, 1, 80),
      makeTalent(2, 10, null, 1, 80),
      makeTalent(3, 10, 1, null, 80),
      makeTalent(4, 10, 1, 1, 80),
    ]
    const map = buildNodeMap(talents)
    expect(map.size).toBe(1)
    expect(map.has(10)).toBe(true)
  })

  it("returns an empty map for an empty talent list", () => {
    expect(buildNodeMap([])).toEqual(new Map())
  })
})

// ─── buildTopNodeIds ──────────────────────────────────────────────────────────

describe("buildTopNodeIds", () => {
  const nodes = [
    { ...buildNodeMap([makeTalent(1, 1, 1, 1, 90)]).get(1)! },
    { ...buildNodeMap([makeTalent(2, 2, 1, 2, 70)]).get(2)! },
    { ...buildNodeMap([makeTalent(3, 3, 1, 3, 50)]).get(3)! },
    { ...buildNodeMap([makeTalent(4, 4, 1, 4, 30)]).get(4)! },
  ]

  it("returns the top nodes sorted by usage_pct within budget", () => {
    const ids = buildTopNodeIds(nodes, 3)
    expect(ids).toEqual(new Set([1, 2, 3]))
  })

  it("respects maxRank cost — a rank-2 node costs 2 points", () => {
    const twoRankNode = buildNodeMap([makeTalent(5, 5, 1, 5, 95, 2)]).get(5)!
    const ids = buildTopNodeIds([twoRankNode, ...nodes], 2)
    // node 5 (95 pct) costs 2 → exhausts the budget
    expect(ids).toEqual(new Set([5]))
  })

  it("returns all nodes when budget is larger than total cost", () => {
    const ids = buildTopNodeIds(nodes, 100)
    expect(ids.size).toBe(4)
  })

  it("returns an empty set for budget 0", () => {
    expect(buildTopNodeIds(nodes, 0).size).toBe(0)
  })

  it("returns an empty set for an empty node list", () => {
    expect(buildTopNodeIds([], 10).size).toBe(0)
  })

  it("includes free talents (default_points >= maxRank) without spending budget", () => {
    const freeTalent = makeTalent(9, 9, 1, 9, 80)
    const freeNode = { ...buildNodeMap([freeTalent]).get(9)!, defaultPoints: 1 }
    const ids = buildTopNodeIds([freeNode, ...nodes], 2)
    // free node included + 2 top nodes within budget
    expect(ids).toEqual(new Set([9, 1, 2]))
  })

  it("reduces cost for partially free talents", () => {
    const partialFree = makeTalent(8, 8, 1, 8, 95, 2)
    const partialNode = { ...buildNodeMap([partialFree]).get(8)!, defaultPoints: 1 }
    // maxRank=2, defaultPoints=1 → costs 1 instead of 2
    const ids = buildTopNodeIds([partialNode, ...nodes], 2)
    expect(ids).toEqual(new Set([8, 1]))
  })

  it("pulls in prerequisites when picking a high-usage node", () => {
    // A → B → C chain; C has highest usage but requires B which requires A
    const a = makeTalent(1, 1, 1, 1, 10, 1, [])
    const b = makeTalent(2, 2, 2, 1, 20, 1, [1])
    const c = makeTalent(3, 3, 3, 1, 90, 1, [2])
    const chain = [a, b, c].map(t => buildNodeMap([t]).get(t.talent.node_id!)!)
    // Give them correct prereqIds
    chain[0].prereqIds = []
    chain[1].prereqIds = [1]
    chain[2].prereqIds = [2]
    const ids = buildTopNodeIds(chain, 3)
    // All three should be picked — C pulls in B which pulls in A
    expect(ids).toEqual(new Set([1, 2, 3]))
  })

  it("skips nodes whose prerequisite chain exceeds remaining budget", () => {
    // A(10%) → B(90%) but budget=1, so only A or B alone
    // B requires A, so picking B costs 2 — too much
    // A alone costs 1 — fits
    const a = makeTalent(1, 1, 1, 1, 10, 1, [])
    const b = makeTalent(2, 2, 2, 1, 90, 1, [1])
    const chain = [a, b].map(t => buildNodeMap([t]).get(t.talent.node_id!)!)
    chain[0].prereqIds = []
    chain[1].prereqIds = [1]
    const ids = buildTopNodeIds(chain, 1)
    // B costs 2 (itself + prereq A) — skipped; A costs 1 — picked
    expect(ids).toEqual(new Set([1]))
  })

  it("treats prerequisites outside the tree as satisfied", () => {
    // Node B requires node 999 which is not in the tree (gate node / different section)
    const a = makeTalent(1, 1, 1, 1, 80, 1, [])
    const b = makeTalent(2, 2, 2, 1, 90, 1, [999])
    const nodeList = [a, b].map(t => buildNodeMap([t]).get(t.talent.node_id!)!)
    nodeList[0].prereqIds = []
    nodeList[1].prereqIds = [999] // missing from tree
    const ids = buildTopNodeIds(nodeList, 2)
    // Both picked — missing prereq 999 is ignored
    expect(ids).toEqual(new Set([1, 2]))
  })

  it("does not double-count shared prerequisites", () => {
    //   A(30%)
    //  / \
    // B(80%) C(70%)
    const a = makeTalent(1, 1, 1, 1, 30, 1, [])
    const b = makeTalent(2, 2, 2, 1, 80, 1, [1])
    const c = makeTalent(3, 3, 2, 2, 70, 1, [1])
    const nodeList = [a, b, c].map(t => buildNodeMap([t]).get(t.talent.node_id!)!)
    nodeList[0].prereqIds = []
    nodeList[1].prereqIds = [1]
    nodeList[2].prereqIds = [1]
    const ids = buildTopNodeIds(nodeList, 3)
    // B(80%) picked first → pulls in A → cost=2, remaining=1
    // C(70%) needs A (already picked) → cost=1, remaining=0
    expect(ids).toEqual(new Set([1, 2, 3]))
  })
})

// ─── buildEdgeSet ─────────────────────────────────────────────────────────────

describe("buildEdgeSet", () => {
  it("creates edges from prerequisite_node_ids", () => {
    const talents = [
      makeTalent(1, 10, 1, 1, 80, 1, []),
      makeTalent(2, 20, 2, 1, 60, 1, [10]),
      makeTalent(3, 30, 3, 1, 40, 1, [10, 20]),
    ]
    const edges = buildEdgeSet(talents)
    expect(edges).toContain("10→20")
    expect(edges).toContain("10→30")
    expect(edges).toContain("20→30")
    expect(edges.size).toBe(3)
  })

  it("deduplicates edges when multiple talents share a node", () => {
    // Two talents on node 20, both listing node 10 as a prerequisite.
    const talents = [
      makeTalent(1, 10, 1, 1, 80, 1, []),
      makeTalent(2, 20, 2, 1, 60, 1, [10]),
      makeTalent(3, 20, 2, 1, 40, 1, [10]),
    ]
    const edges = buildEdgeSet(talents)
    expect(edges.size).toBe(1)
    expect(edges).toContain("10→20")
  })

  it("skips talents with null node_id", () => {
    const talents = [makeTalent(1, null, 1, 1, 80, 1, [10])]
    expect(buildEdgeSet(talents).size).toBe(0)
  })

  it("returns an empty set for talents with no prerequisites", () => {
    const talents = [makeTalent(1, 10, 1, 1, 80), makeTalent(2, 20, 2, 1, 60)]
    expect(buildEdgeSet(talents).size).toBe(0)
  })

  it("returns an empty set for an empty list", () => {
    expect(buildEdgeSet([]).size).toBe(0)
  })
})

// ─── hasTreeData ──────────────────────────────────────────────────────────────

describe("hasTreeData", () => {
  it("returns true when at least one talent has row and col", () => {
    const talents = [makeTalent(1, 10, null, null, 80), makeTalent(2, 20, 2, 3, 60)]
    expect(hasTreeData(talents)).toBe(true)
  })

  it("returns false when all talents have null display_row", () => {
    const talents = [makeTalent(1, 10, null, 1, 80)]
    expect(hasTreeData(talents)).toBe(false)
  })

  it("returns false when all talents have null display_col", () => {
    const talents = [makeTalent(1, 10, 1, null, 80)]
    expect(hasTreeData(talents)).toBe(false)
  })

  it("returns false for an empty list", () => {
    expect(hasTreeData([])).toBe(false)
  })
})

// ─── splitHeroTrees ──────────────────────────────────────────────────────────

describe("splitHeroTrees", () => {
  it("splits two disconnected components into two trees", () => {
    const talents = [
      makeTalent(1, 1, 0, 0, 90, 1, []),
      makeTalent(2, 2, 1, 0, 85, 1, [1]),
      makeTalent(10, 10, 0, 1, 40, 1, []),
      makeTalent(11, 11, 1, 1, 35, 1, [10]),
    ]
    const trees = splitHeroTrees(talents)
    expect(trees).toHaveLength(2)
  })

  it("sorts trees by highest usage_pct (dominant first)", () => {
    const talents = [
      makeTalent(10, 10, 0, 1, 40, 1, []),
      makeTalent(11, 11, 1, 1, 35, 1, [10]),
      makeTalent(1, 1, 0, 0, 90, 1, []),
      makeTalent(2, 2, 1, 0, 85, 1, [1]),
    ]
    const trees = splitHeroTrees(talents)
    expect(Math.max(...trees[0].map(t => t.usage_pct))).toBeGreaterThan(
      Math.max(...trees[1].map(t => t.usage_pct)),
    )
  })

  it("keeps connected talents in the same tree", () => {
    const talents = [
      makeTalent(1, 1, 0, 0, 90, 1, []),
      makeTalent(2, 2, 1, 0, 85, 1, [1]),
      makeTalent(3, 3, 2, 0, 80, 1, [2]),
    ]
    const trees = splitHeroTrees(talents)
    expect(trees).toHaveLength(1)
    expect(trees[0]).toHaveLength(3)
  })

  it("returns empty array for empty input", () => {
    expect(splitHeroTrees([])).toEqual([])
  })

  it("skips talents with null node_id", () => {
    const talents = [
      makeTalent(1, null, 0, 0, 90),
      makeTalent(2, 2, 0, 0, 80),
    ]
    const trees = splitHeroTrees(talents)
    expect(trees).toHaveLength(1)
    expect(trees[0]).toHaveLength(1)
  })
})
