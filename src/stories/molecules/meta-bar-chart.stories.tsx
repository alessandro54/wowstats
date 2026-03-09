import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetaBarChart } from "../../components/molecules/meta-bar-chart"

const meta = {
  title: "Molecules/MetaBarChart",
  component: MetaBarChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Vertical bar chart showing relative representation of specs/classes in the PvP meta. Bars scale proportionally to meta score.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof MetaBarChart>

export default meta
type Story = StoryObj<typeof meta>

const sampleEntries = [
  {
    key: "arms-warrior",
    specName: "Arms",
    normPct: 100,
    metaScore: 0.82,
    meanRating: 1850,
    winRate: 0.54,
    presence: 0.12,
    color: "#c79c6e",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
    tier: "S" as const,
  },
  {
    key: "ret-paladin",
    specName: "Ret",
    normPct: 79,
    metaScore: 0.65,
    meanRating: 1780,
    winRate: 0.52,
    presence: 0.09,
    color: "#f58cba",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_auraoflight.jpg",
    tier: "A" as const,
  },
  {
    key: "frost-mage",
    specName: "Frost",
    normPct: 66,
    metaScore: 0.54,
    meanRating: 1720,
    winRate: 0.51,
    presence: 0.08,
    color: "#69ccf0",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
    tier: "A" as const,
  },
  {
    key: "shadow-priest",
    specName: "Shadow",
    normPct: 50,
    metaScore: 0.41,
    meanRating: 1680,
    winRate: 0.5,
    presence: 0.07,
    color: "#9482c9",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_shadowwordpain.jpg",
    tier: "B" as const,
  },
  {
    key: "resto-druid",
    specName: "Resto",
    normPct: 45,
    metaScore: 0.37,
    meanRating: 1650,
    winRate: 0.49,
    presence: 0.06,
    color: "#ff7d0a",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_healingtouch.jpg",
    tier: "B" as const,
  },
  {
    key: "holy-paladin",
    specName: "Holy",
    normPct: 35,
    metaScore: 0.29,
    meanRating: 1600,
    winRate: 0.48,
    presence: 0.05,
    color: "#f58cba",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_holybolt.jpg",
    tier: "C" as const,
  },
]

export const Default: Story = {
  args: { entries: sampleEntries },
  decorators: [
    Story => (
      <div style={{ height: 300, width: 500, display: "flex" }}>
        <Story />
      </div>
    ),
  ],
}

export const FewEntries: Story = {
  args: { entries: sampleEntries.slice(0, 3) },
  decorators: [
    Story => (
      <div style={{ height: 300, width: 200, display: "flex" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: { description: { story: "Fewer entries — bars spread out more." } },
  },
}

export const WithoutIcons: Story = {
  args: {
    entries: sampleEntries.map(({ iconUrl: _, ...e }) => e),
  },
  decorators: [
    Story => (
      <div style={{ height: 300, width: 500, display: "flex" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: { description: { story: "Entries without icon URLs — colored squares shown instead." } },
  },
}
