"use client"

import type { MetaTalent } from "@/lib/api"
import { TalentList } from "@/components/molecules/talent-list"
import { hasTreeData, TalentTree } from "@/components/organisms/talent-tree"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Split hero talents into separate sub-trees via connected-component BFS.
// Hero trees share no prerequisite edges between them, so components = trees.
function splitHeroTrees(talents: MetaTalent[]): MetaTalent[][] {
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

export function HeroSection({
  heroEntries,
  activeColor,
}: {
  heroEntries: MetaTalent[]
  activeColor: string
}) {
  const trees = splitHeroTrees(heroEntries)
  if (trees.length === 0)
    return null

  const primary = trees[0]
  const alt = trees[1]

  const card = (
    <div className="border-border/40 bg-card/30 inline-block rounded-xl border p-4 backdrop-blur-sm">
      {hasTreeData(primary)
        ? (
            <TalentTree
              talents={primary}
              activeColor={activeColor}
              onlyChoicePct
              fullOpacity
              apexExtra
            />
          )
        : (
            <TalentList talents={primary} activeColor={activeColor} />
          )}
    </div>
  )

  return (
    <section className="w-full space-y-3 lg:w-auto">
      <h2 className="text-center text-lg font-semibold lg:text-left">Hero Talents</h2>

      {alt
        ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-fit cursor-default">{card}</div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={8}
                className="bg-popover text-popover-foreground max-w-none border p-4 shadow-xl"
                arrowClassName="fill-popover"
              >
                <p className="text-muted-foreground mb-3 font-mono text-xs">
                  Alt ·
                  {" "}
                  {Math.max(...alt.map(t => t.usage_pct)).toFixed(0)}
                  %
                </p>
                {hasTreeData(alt)
                  ? (
                      <TalentTree
                        talents={alt}
                        activeColor={activeColor}
                        onlyChoicePct
                        fullOpacity
                        apexExtra
                      />
                    )
                  : (
                      <TalentList talents={alt} activeColor={activeColor} />
                    )}
              </TooltipContent>
            </Tooltip>
          )
        : (
            card
          )}
    </section>
  )
}
