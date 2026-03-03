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
          "Vertical bar chart showing relative representation of specs/classes in the PvP meta. Bars scale proportionally to percentage.",
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
    percentage: 82,
    color: "#c79c6e",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
  },
  {
    key: "ret-paladin",
    specName: "Ret",
    percentage: 65,
    color: "#f58cba",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_auraoflight.jpg",
  },
  {
    key: "frost-mage",
    specName: "Frost",
    percentage: 54,
    color: "#69ccf0",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg",
  },
  {
    key: "shadow-priest",
    specName: "Shadow",
    percentage: 41,
    color: "#9482c9",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_shadow_shadowwordpain.jpg",
  },
  {
    key: "resto-druid",
    specName: "Resto",
    percentage: 37,
    color: "#ff7d0a",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_healingtouch.jpg",
  },
  {
    key: "holy-paladin",
    specName: "Holy",
    percentage: 29,
    color: "#f58cba",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_holybolt.jpg",
  },
]

export const Default: Story = {
  args: { entries: sampleEntries },
  decorators: [
    Story => (
      <div style={{ height: 300, width: 400, display: "flex" }}>
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
      <div style={{ height: 300, width: 400, display: "flex" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: { description: { story: "Entries without icon URLs — only labels are shown." } },
  },
}
