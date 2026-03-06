import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "../../lib/api"
import { PvpTalents } from "../../components/molecules/pvp-talents"

function makeTalent(id: number, name: string, pct: number): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 5000,
      name,
      description: `${name} — a powerful PvP talent.`,
      talent_type: "pvp",
      spell_id: null,
      node_id: id,
      display_row: null,
      display_col: null,
      max_rank: 1,
      default_points: 0,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: pct > 50,
    top_build_rank: 1,
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

const allTalents: MetaTalent[] = [
  makeTalent(1, "Gladiator's Resolve", 85),
  makeTalent(2, "Battle Trance", 70),
  makeTalent(3, "War Banner", 55),
  makeTalent(4, "Disarm", 30),
  makeTalent(5, "Spell Reflect", 25),
  makeTalent(6, "Storm of Swords", 10),
]

const meta = {
  title: "Molecules/PvpTalents",
  component: PvpTalents,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "PvP talents column — top 3 with gold borders, situational (>20%) with purple borders on hover, rest dimmed. Hover to reveal the dropdown.",
      },
    },
    layout: "centered",
  },
  decorators: [
    Story => (
      <div className="relative min-h-96 w-96 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PvpTalents>

export default meta
type Story = StoryObj<typeof meta>

export const WithAllTiers: Story = {
  args: {
    talents: allTalents,
    activeColor: "#c79c6e",
    classSlug: "warrior",
  },
  parameters: {
    docs: {
      description: { story: "All three tiers: top 3 gold, situational purple, rest dimmed. Hover to see dropdown." },
    },
  },
}

export const Top3Only: Story = {
  args: {
    talents: allTalents.slice(0, 3),
    activeColor: "#69ccf0",
    classSlug: "mage",
  },
  parameters: {
    docs: {
      description: { story: "Only 3 talents — no hover dropdown." },
    },
  },
}

export const WithSituationalOnly: Story = {
  args: {
    talents: [
      ...allTalents.slice(0, 3),
      makeTalent(7, "Sharpen Blade", 35),
    ],
    activeColor: "#abd473",
    classSlug: "hunter",
  },
  parameters: {
    docs: {
      description: { story: "Dropdown only has situational talents (no low-usage rest)." },
    },
  },
}
