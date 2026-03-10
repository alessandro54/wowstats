import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetaDonutChart } from "../../components/molecules/meta-donut-chart"

const sampleSlices = [
  { key: "arms-warrior", label: "Arms Warrior", value: 0.15, color: "#c79c6e", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg" },
  { key: "frost-mage", label: "Frost Mage", value: 0.12, color: "#69ccf0", iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_frost_frostbolt02.jpg" },
  { key: "ret-paladin", label: "Ret Paladin", value: 0.10, color: "#f58cba" },
  { key: "shadow-priest", label: "Shadow Priest", value: 0.08, color: "#9482c9" },
  { key: "resto-druid", label: "Resto Druid", value: 0.06, color: "#ff7d0a" },
]

const meta = {
  title: "Molecules/MetaDonutChart",
  component: MetaDonutChart,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "SVG donut chart showing spec presence in the PvP meta with an interactive legend. Small slices are grouped into \"Other\".",
      },
    },
    layout: "centered",
  },
  decorators: [Story => <div style={{ width: 400, height: 300 }}><Story /></div>],
} satisfies Meta<typeof MetaDonutChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { slices: sampleSlices },
}

export const FewSlices: Story = {
  args: { slices: sampleSlices.slice(0, 2) },
  parameters: { docs: { description: { story: "Only two specs — larger donut arcs." } } },
}

export const WithOtherBucket: Story = {
  args: {
    slices: [
      ...sampleSlices,
      { key: "tiny1", label: "Tiny A", value: 0.01, color: "#555" },
      { key: "tiny2", label: "Tiny B", value: 0.01, color: "#666" },
      { key: "tiny3", label: "Tiny C", value: 0.005, color: "#777" },
    ],
  },
  parameters: { docs: { description: { story: "Small slices grouped into \"Other\"." } } },
}
