import type { MetaTalent } from "@/lib/api"
import { TalentList } from "@/components/molecules/talent-list"
import { hasTreeData, TalentTree } from "@/components/organisms/talent-tree"

interface Props {
  talents: MetaTalent[]
  activeColor: string
}

export function HeroTree({ talents, activeColor }: Props) {
  return hasTreeData(talents)
    ? <TalentTree talents={talents} activeColor={activeColor} onlyChoicePct fullOpacity apexExtra />
    : <TalentList talents={talents} activeColor={activeColor} />
}
