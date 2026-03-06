import type { MetaTalent } from "@/lib/api"

export const NODE_SIZE = 44
export const CELL_SIZE = 64 // node + gap; preserves Blizzard's sparse column spacing
export const APEX_EXTRA = 20 // extra px pushed outward for single-node apex rows

// Border tiers — Tailwind classes with dark: variants
export const BORDER_BIS = "border-rose-400 dark:border-amber-300 border-4 dark:border-2"
export const BORDER_SITUATIONAL = "border-purple-500 dark:border-purple-400 border-4 dark:border-2"

export interface TalentNode {
  nodeId: number
  row: number
  col: number
  maxRank: number
  defaultPoints: number // points granted for free (not counted against budget)
  primary: MetaTalent // highest usage_pct — shown as the main icon
  isChoice: boolean // two talents share this node
  all: MetaTalent[]
}

export function buildNodeMap(talents: MetaTalent[]): Map<number, TalentNode> {
  const map = new Map<number, TalentNode>()

  for (const t of talents) {
    const { node_id, display_row, display_col, max_rank } = t.talent
    if (node_id == null || display_row == null || display_col == null)
      continue

    const existing = map.get(node_id)
    if (existing) {
      existing.all.push(t)
      if (t.usage_pct > existing.primary.usage_pct)
        existing.primary = t
      existing.isChoice = true
    }
    else {
      map.set(node_id, {
        nodeId: node_id,
        row: display_row,
        col: display_col,
        maxRank: max_rank,
        defaultPoints: t.talent.default_points,
        primary: t,
        isChoice: false,
        all: [t],
      })
    }
  }

  return map
}

/**
 * Top nodes by usage_pct until budget (talent points) is exhausted.
 * Each node costs (maxRank - defaultPoints) points — talents with
 * default_points are free and always included.
 */
export function buildTopNodeIds(nodes: TalentNode[], budget: number): Set<number> {
  const sorted = [...nodes].sort((a, b) => b.primary.usage_pct - a.primary.usage_pct)
  const ids = new Set<number>()
  let remaining = budget
  for (const node of sorted) {
    const cost = node.maxRank - node.defaultPoints
    if (cost <= 0) {
      // Free talent — always included, no budget cost
      ids.add(node.nodeId)
      continue
    }
    if (remaining <= 0)
      break
    ids.add(node.nodeId)
    remaining -= cost
  }
  return ids
}

export function buildEdgeSet(talents: MetaTalent[]): Set<string> {
  const edgeSet = new Set<string>()
  for (const t of talents) {
    const { node_id, prerequisite_node_ids } = t.talent
    if (node_id == null)
      continue
    for (const pid of prerequisite_node_ids) {
      edgeSet.add(`${pid}→${node_id}`)
    }
  }
  return edgeSet
}

export function hasTreeData(talents: MetaTalent[]): boolean {
  return talents.some(t => t.talent.display_row != null && t.talent.display_col != null)
}

// Split hero talents into separate sub-trees via connected-component BFS.
// Hero trees share no prerequisite edges between them, so components = trees.
export function splitHeroTrees(talents: MetaTalent[]): MetaTalent[][] {
  const heroNodeIds = new Set(
    talents.map(t => t.talent.node_id).filter((id): id is number => id != null),
  )

  // Bidirectional adjacency — only traverse edges within the hero set
  const adj = new Map<number, Set<number>>()
  for (const id of heroNodeIds) adj.set(id, new Set())
  for (const t of talents) {
    const { node_id, prerequisite_node_ids } = t.talent
    if (node_id == null)
      continue
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
    if (visited.has(nodeId))
      continue
    const component = new Set<number>()
    const queue = [nodeId]
    while (queue.length > 0) {
      const curr = queue.shift()!
      if (visited.has(curr))
        continue
      visited.add(curr)
      component.add(curr)
      for (const neighbor of adj.get(curr) ?? []) {
        if (!visited.has(neighbor))
          queue.push(neighbor)
      }
    }
    components.push(component)
  }

  // Map components back to MetaTalent[], sorted dominant first
  const trees = components.map(ids =>
    talents.filter(t => t.talent.node_id != null && ids.has(t.talent.node_id)),
  )

  // Rank by max usage_pct in each tree (highest = dominant)
  return trees.sort(
    (a, b) => Math.max(...b.map(t => t.usage_pct)) - Math.max(...a.map(t => t.usage_pct)),
  )
}
