import type { MetaTalent } from "@/lib/api"

export const NODE_SIZE  = 44
export const CELL_SIZE  = 64  // node + gap; preserves Blizzard's sparse column spacing
export const APEX_EXTRA = 20  // extra px pushed outward for single-node apex rows

// Border tiers — Tailwind classes with dark: variants
export const BORDER_BIS         = "border-rose-400 dark:border-amber-300 border-4 dark:border-2"
export const BORDER_SITUATIONAL = "border-purple-500 dark:border-purple-400 border-4 dark:border-2"

export type TalentNode = {
  nodeId:   number
  row:      number
  col:      number
  maxRank:  number
  primary:  MetaTalent  // highest usage_pct — shown as the main icon
  isChoice: boolean     // two talents share this node
  all:      MetaTalent[]
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
        nodeId:   node_id,
        row:      display_row,
        col:      display_col,
        maxRank:  max_rank,
        primary:  t,
        isChoice: false,
        all:      [t],
      })
    }
  }

  return map
}

/** Top nodes by usage_pct until budget (talent points) is exhausted.
 *  Each node costs maxRank points (some talents require 2 ranks). */
export function buildTopNodeIds(nodes: TalentNode[], budget: number): Set<number> {
  const sorted = [...nodes].sort((a, b) => b.primary.usage_pct - a.primary.usage_pct)
  const ids = new Set<number>()
  let remaining = budget
  for (const node of sorted) {
    if (remaining <= 0) break
    ids.add(node.nodeId)
    remaining -= node.maxRank
  }
  return ids
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
  return talents.some(
    (t) => t.talent.display_row != null && t.talent.display_col != null,
  )
}
