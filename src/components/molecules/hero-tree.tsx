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
      nodeKeyMode="position"
      suppressEnforcedPct
    />
  ) : (
    <TalentList talents={talents} activeColor={activeColor} hideStats={hideStats} />
  )
}
