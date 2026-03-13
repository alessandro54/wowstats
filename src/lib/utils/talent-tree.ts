import type { MetaTalent } from "@/lib/api"

export const NODE_SIZE = 44
export const APEX_NODE_SIZE = 56 // bigger circle for capstone nodes
export const CELL_SIZE = 64 // node + gap; preserves Blizzard's sparse column spacing
export const APEX_EXTRA = 20 // extra px pushed outward for single-node apex rows

// Border tiers — Tailwind classes with dark: variants
export const BORDER_BIS = "border-rose-400 dark:border-amber-300 border-4 dark:border-2"
export const BORDER_SITUATIONAL = "border-purple-500 dark:border-purple-400 border-4 dark:border-2"
export const BORDER_DEFAULT = "border-sky-300 dark:border-sky-400 border-2"

export interface TalentNode {
  nodeId: number
  row: number
  col: number
  maxRank: number
  defaultPoints: number // points granted for free (not counted against budget)
  prereqIds: number[] // prerequisite node IDs (must be picked before this node)
  primary: MetaTalent // highest usage_pct — shown as the main icon
  isChoice: boolean // two+ talents share this node (different abilities)
  isRanked: boolean // multiple ranks of the same talent (same name, different effects per rank)
  all: MetaTalent[]
}

export function buildNodeMap(talents: MetaTalent[]): Map<number, TalentNode> {
  const map = new Map<number, TalentNode>()

  for (const t of talents) {
    const { node_id, display_row, display_col, max_rank } = t.talent
    if (node_id == null || display_row == null || display_col == null) continue

    const existing = map.get(node_id)
    if (existing) {
      existing.all.push(t)
      if (t.usage_pct > existing.primary.usage_pct) existing.primary = t
      existing.isChoice = true
    } else {
      map.set(node_id, {
        nodeId: node_id,
        row: display_row,
        col: display_col,
        maxRank: max_rank,
        defaultPoints: t.talent.default_points,
        prereqIds: t.talent.prerequisite_node_ids,
        primary: t,
        isChoice: false,
        isRanked: false,
        all: [
          t,
        ],
      })
    }
  }

  // Distinguish ranked nodes (same talent, multiple ranks like apex 1/4–4/4)
  // from choice nodes (different talents, pick one).
  // Ranked nodes: all variants share the same name AND maxRank > 1.
  // Some nodes have 2 variants with identical names but maxRank=1 — these are
  // NOT ranked, they're two different spells that happen to share a name.
  for (const node of map.values()) {
    if (node.isChoice && node.all.length > 1) {
      const firstName = node.all[0].talent.name
      const allSameName = node.all.every((t) => t.talent.name === firstName)
      if (allSameName && node.maxRank > 1) {
        node.isRanked = true
        node.isChoice = false
        // Sort by blizzard_id ascending so rank order is consistent (lowest = earliest rank)
        node.all.sort((a, b) => a.talent.blizzard_id - b.talent.blizzard_id)
        // Primary = highest blizzard_id (the capstone rank, shows the full icon)
        node.primary = node.all[node.all.length - 1]
      } else if (allSameName) {
        // Same name but maxRank=1: collapse to single talent (not a real choice)
        node.isChoice = false
      }
    }
  }

  return map
}

/**
 * Graph-aware talent selection: picks top nodes by usage_pct while
 * respecting prerequisite edges. A node can only be picked if all its
 * prerequisites are already picked. Free talents (defaultPoints >= maxRank)
 * are always included at zero cost.
 *
 * For each candidate the algorithm computes the full prerequisite chain
 * and its total unlock cost. High-usage nodes "pull in" their ancestors
 * automatically, just like the in-game talent picker.
 */
export function buildTopNodeIds(nodes: TalentNode[], budget: number): Set<number> {
  const nodeById = new Map(
    nodes.map((n) => [
      n.nodeId,
      n,
    ]),
  )
  const picked = new Set<number>()
  let remaining = budget

  // Cost of a single node (0 for free talents)
  const nodeCost = (n: TalentNode) => Math.max(0, n.maxRank - n.defaultPoints)

  // Free talents — always included, no budget cost
  for (const node of nodes) {
    if (nodeCost(node) <= 0) picked.add(node.nodeId)
  }

  // Collect the full prerequisite chain (transitive) for a node,
  // returning only the unpicked ancestors + the node itself.
  // Prerequisites referencing nodes outside the current tree (e.g. gate
  // nodes without display coordinates) are treated as already satisfied.
  function unlockChain(nodeId: number): TalentNode[] {
    const chain: TalentNode[] = []
    const visited = new Set<number>()
    const stack = [
      nodeId,
    ]
    while (stack.length > 0) {
      const id = stack.pop()!
      if (picked.has(id) || visited.has(id)) continue
      visited.add(id)
      const n = nodeById.get(id)
      if (!n) continue // outside our tree — treat as satisfied
      chain.push(n)
      for (const prereqId of n.prereqIds) stack.push(prereqId)
    }
    return chain
  }

  // Sort candidates by usage_pct descending — highest value first.
  // For ranked nodes (apex), use the max usage across all variants
  // (rank 1 is always the highest since every investor gets it).
  const effectiveUsage = (n: TalentNode) =>
    n.isRanked ? Math.max(...n.all.map((t) => t.usage_pct)) : n.primary.usage_pct
  const sorted = [
    ...nodes,
  ].sort((a, b) => effectiveUsage(b) - effectiveUsage(a))

  for (const node of sorted) {
    if (picked.has(node.nodeId)) continue

    const chain = unlockChain(node.nodeId)
    const totalCost = chain.reduce((sum, n) => sum + nodeCost(n), 0)
    if (totalCost > remaining) continue

    // Pick the entire chain
    for (const n of chain) picked.add(n.nodeId)
    remaining -= totalCost
  }

  return picked
}

export function buildEdgeSet(talents: MetaTalent[]): Set<string> {
  const edgeSet = new Set<string>()
  for (const t of talents) {
    const { node_id, prerequisite_node_ids } = t.talent
    if (node_id == null) continue
    for (const pid of prerequisite_node_ids) {
      edgeSet.add(`${pid}→${node_id}`)
    }
  }
  return edgeSet
}

export function hasTreeData(talents: MetaTalent[]): boolean {
  return talents.some((t) => t.talent.display_row != null && t.talent.display_col != null)
}

// Split hero talents into separate sub-trees via connected-component BFS.
// Hero trees share no prerequisite edges between them, so components = trees.
export function splitHeroTrees(talents: MetaTalent[]): MetaTalent[][] {
  const heroNodeIds = new Set(
    talents.map((t) => t.talent.node_id).filter((id): id is number => id != null),
  )

  // Bidirectional adjacency — only traverse edges within the hero set
  const adj = new Map<number, Set<number>>()
  for (const id of heroNodeIds) adj.set(id, new Set())
  for (const t of talents) {
    const { node_id, prerequisite_node_ids } = t.talent
    if (node_id == null) continue
    for (const prereqId of prerequisite_node_ids) {
      if (heroNodeIds.has(prereqId)) {
        adj.get(node_id)!.add(prereqId)
        adj.get(prereqId)!.add(node_id)
      }
    }
  }

  // BFS connected components
  const visited = new Set<number>()
  const components: Set<number>[] = []
  for (const nodeId of heroNodeIds) {
    if (visited.has(nodeId)) continue
    const component = new Set<number>()
    const queue = [
      nodeId,
    ]
    while (queue.length > 0) {
      const curr = queue.shift()!
      if (visited.has(curr)) continue
      visited.add(curr)
      component.add(curr)
      for (const neighbor of adj.get(curr) ?? []) {
        if (!visited.has(neighbor)) queue.push(neighbor)
      }
    }
    components.push(component)
  }

  // Map components back to MetaTalent[], sorted dominant first
  const trees = components.map((ids) =>
    talents.filter((t) => t.talent.node_id != null && ids.has(t.talent.node_id)),
  )

  // Rank by max usage_pct in each tree (highest = dominant)
  return trees.sort(
    (a, b) => Math.max(...b.map((t) => t.usage_pct)) - Math.max(...a.map((t) => t.usage_pct)),
  )
}
