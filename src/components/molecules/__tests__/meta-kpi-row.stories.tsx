import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetaKpiRow } from "../meta-kpi-row"

const meta = {
  title: "Molecules/MetaKpiRow",
  component: MetaKpiRow,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "KPI row showing total players, weighted avg rating, weighted avg win rate, and the top spec.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 900,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetaKpiRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    totalPlayers: 12483,
    weightedAvgRating: 1847,
    weightedAvgWinRate: 0.523,
    topSpec: {
      name: "Arms",
      className: "Warrior",
      color: "#c79c6e",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
    },
    mostReliable: {
      name: "Fire",
      className: "Mage",
      color: "#69ccf0",
      iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg",
      bK: 0.94,
    },
  },
}

export const NoIcon: Story = {
  args: {
    totalPlayers: 500,
    weightedAvgRating: 2100,
    weightedAvgWinRate: 0.618,
    topSpec: {
      name: "Frost",
      className: "Mage",
      color: "#69ccf0",
    },
    mostReliable: {
      name: "Subtlety",
      className: "Rogue",
      color: "#fff569",
      bK: 0.88,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Top spec without an icon URL.",
      },
    },
  },
}
