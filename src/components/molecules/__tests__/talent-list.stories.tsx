import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "@/lib/api"
import { TalentList } from "../talent-list"

function makeTalent(
  id: number,
  name: string,
  iconUrl: string,
  usagePct: number,
  inTopBuild = true,
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: 10000 + id,
      name,
      description: null,
      talent_type: "active",
      spell_id: null,
      node_id: id,
      display_row: 1,
      display_col: 1,
      max_rank: 1,
      default_points: 0,
      icon_url: iconUrl,
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(usagePct * 12),
    usage_pct: usagePct,
    in_top_build: inTopBuild,
    top_build_rank: 1,
    tier: (usagePct > 50 ? "bis" : usagePct > 15 ? "situational" : "common") as
      | "bis"
      | "situational"
      | "common",
    snapshot_at: "2026-03-02T00:00:00Z",
  }
}

const warriorTalents: MetaTalent[] = [
  makeTalent(
    1,
    "Mortal Strike",
    "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
    98.4,
  ),
  makeTalent(
    2,
    "Warbreaker",
    "https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg",
    91.2,
  ),
  makeTalent(
    3,
    "Bladestorm",
    "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_bladestorm.jpg",
    74.6,
  ),
  makeTalent(
    4,
    "Dreadnaught",
    "https://wow.zamimg.com/images/wow/icons/large/inv_sword_05.jpg",
    63.0,
  ),
  makeTalent(
    5,
    "Fervor of Battle",
    "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_colossussmash.jpg",
    51.8,
    false,
  ),
]

const meta = {
  title: "Molecules/TalentList",
  component: TalentList,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Scrollable list of talents with icon, name, and usage percentage. Used in the PvP breakdown pages to show top talents by slot.",
      },
    },
    layout: "centered",
  },
  args: {
    talents: warriorTalents,
    activeColor: "#c79c6e",
  },
} satisfies Meta<typeof TalentList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export const PaladinColors: Story = {
  args: {
    activeColor: "#f58cba",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Same list with Paladin pink class color.",
      },
    },
  },
}

export const SingleEntry: Story = {
  args: {
    talents: warriorTalents.slice(0, 1),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "List with a single talent entry.",
      },
    },
  },
}
