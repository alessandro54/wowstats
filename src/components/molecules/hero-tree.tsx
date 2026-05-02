import { TalentList } from "@/components/molecules/talent-list"
import { hasTreeData, TalentTree } from "@/components/organisms/talent-tree"
import type { MetaTalent } from "@/lib/api"

interface Props {
  talents: MetaTalent[]
  activeColor: string
  hideStats?: boolean
}

export function HeroTree({ talents, activeColor, hideStats }: Props) {
  return hasTreeData(talents) ? (
    <TalentTree
      talents={talents}
      activeColor={activeColor}
      onlyChoicePct
      fullOpacity
      hideStats={hideStats}
      // Position-based keying so swapping between hero trees of the same class
      // reuses each node's DOM — only the icon image inside changes (and fades
      // via the keyed <Image> in TalentIcon).
      nodeKeyMode="position"
      // Top gateway + bottom capstone are enforced picks for any build that
      // uses the tree, so their % is uninformative — hide it. Visual size
      // and shape stay the same as a regular node (no circle).
      suppressEnforcedPct
    />
  ) : (
    <TalentList talents={talents} activeColor={activeColor} hideStats={hideStats} />
  )
}
