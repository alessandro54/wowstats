import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "@/lib/api"
import type { TalentNode } from "@/lib/utils/talent-tree"
import { TalentNodeTooltip } from "../talent-node-tooltip"

const primary: MetaTalent = {
  id: 1,
  talent: {
    id: 1,
    blizzard_id: 1234,
    name: "Aimed Shot",
    talent_type: "active",
    spell_id: 1234,
    node_id: 1,
    display_row: 0,
    display_col: 0,
    max_rank: 2,
    default_points: 0,
    icon_url: "https://render.worldofwarcraft.com/us/icons/56/ability_hunter_aimedshot.jpg",
    prerequisite_node_ids: [],
  },
  usage_count: 100,
  usage_pct: 0.85,
  in_top_build: true,
  top_build_rank: 1,
  tier: "bis",
}

const node: TalentNode = {
  nodeId: 1,
  row: 0,
  col: 0,
  maxRank: 2,
  defaultPoints: 0,
  prereqIds: [],
  primary,
  isChoice: false,
  isRanked: false,
  all: [
    primary,
  ],
}

const meta = {
  title: "Atoms/TalentNodeTooltip",
  component: TalentNodeTooltip,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TalentNodeTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    node,
    investedRank: 2,
    activeColor: "#a330c9",
    rankBars: null,
    maxBarPct: 1,
  },
}
