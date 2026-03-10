import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "../../lib/api"
import { PvpTalentTooltip } from "../../components/atoms/pvp-talent-tooltip"

function makeTalent(name: string, pct: number, desc: string | null = "A powerful PvP talent.", iconUrl: string | null = "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg"): MetaTalent {
  return {
    id: 1, talent: { id: 1, blizzard_id: 5001, name, description: desc, talent_type: "pvp", spell_id: null, node_id: 1, display_row: null, display_col: null, max_rank: 1, default_points: 0, icon_url: iconUrl, prerequisite_node_ids: [] },
    usage_count: Math.round(pct * 10), usage_pct: pct, in_top_build: true, top_build_rank: 1, tier: "bis", snapshot_at: null,
  }
}

const meta = {
  title: "Atoms/PvpTalentTooltip",
  component: PvpTalentTooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Tooltip content for PvP talents showing icon, name, description, and usage percentage.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof PvpTalentTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { talent: makeTalent("War Banner", 85.3), activeColor: "#c79c6e" },
}

export const NoIcon: Story = {
  args: { talent: makeTalent("War Banner", 85.3, "A powerful PvP talent.", null), activeColor: "#c79c6e" },
}

export const NoDescription: Story = {
  args: { talent: makeTalent("War Banner", 85.3, null), activeColor: "#69ccf0" },
}

export const LowUsage: Story = {
  args: { talent: makeTalent("Storm of Swords", 10.2), activeColor: "#c79c6e" },
}
