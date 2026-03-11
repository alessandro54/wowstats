import type { Meta, StoryObj } from "@storybook/react-vite"
import { StatPriority } from "../../components/organisms/stat-priority"

const stats = [
  {
    stat: "HASTE_RATING",
    median: 347,
  },
  {
    stat: "VERSATILITY",
    median: 310,
  },
  {
    stat: "CRIT_RATING",
    median: 197,
  },
  {
    stat: "MASTERY_RATING",
    median: 118,
  },
]

const meta = {
  title: "Organisms/StatPriority",
  component: StatPriority,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Stat priority section showing ranked stats with proportional bars based on crafting choices.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 500,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatPriority>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stats,
  },
}

export const TwoStats: Story = {
  args: {
    stats: stats.slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: "Only two stats to prioritize.",
      },
    },
  },
}

export const Empty: Story = {
  args: {
    stats: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Returns null for empty stats.",
      },
    },
  },
}
