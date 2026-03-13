import type { MetaTalent } from "@/lib/api"
import { TalentList } from "@/components/molecules/talent-list"
import { hasTreeData, TalentTree } from "@/components/organisms/talent-tree"

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
      apexExtra
      hideStats={hideStats}
    />
  ) : (
    <TalentList talents={talents} activeColor={activeColor} hideStats={hideStats} />
  )
}
