import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaBarEntry } from "../../components/molecules/meta-bar-chart"
import { MetaSpecTable } from "../../components/molecules/meta-spec-table"

function makeEntry(
  specName: string,
  tier: MetaBarEntry["tier"],
  normPct: number,
  color: string,
  iconUrl?: string,
): MetaBarEntry {
  return {
    key: specName.toLowerCase().replace(/\s/g, "-"),
    specName,
    normPct,
    metaScore: normPct / 100,
    meanRating: 1800 + Math.round(normPct * 5),
    winRate: 0.45 + normPct * 0.003,
    presence: normPct / 200,
    color,
    iconUrl,
    tier,
  }
}

const entries: MetaBarEntry[] = [
  makeEntry(
    "Arms Warrior",
    "S",
    100,
    "#c79c6e",
    "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
  ),
  makeEntry(
    "Frost Mage",
    "S",
    88,
    "#69ccf0",
    "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
  ),
  makeEntry("Ret Paladin", "A", 72, "#f58cba"),
  makeEntry("Shadow Priest", "B", 55, "#9482c9"),
  makeEntry("Resto Druid", "C", 30, "#ff7d0a"),
  makeEntry("Surv Hunter", "D", 12, "#abd473"),
]

const meta = {
  title: "Molecules/MetaSpecTable",
  component: MetaSpecTable,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Table view of specs in the PvP meta showing rank, tier badge, inline meta bar, rating, win rate, and presence.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 700,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetaSpecTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entries,
  },
}

export const FewEntries: Story = {
  args: {
    entries: entries.slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: "Only two specs.",
      },
    },
  },
}
