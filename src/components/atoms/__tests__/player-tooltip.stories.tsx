import type { Meta, StoryObj } from "@storybook/react-vite"
import type { TopPlayer } from "@/lib/api"
import { PlayerTooltip } from "../player-tooltip"

const samplePlayer: TopPlayer = {
  name: "Cdew",
  realm: "Tichondrius",
  region: "us",
  rating: 2450,
  wins: 200,
  losses: 80,
  rank: 1,
  score: 2800,
  avatar_url: null,
  class_slug: "shaman",
}

const meta = {
  title: "Atoms/PlayerTooltip",
  component: PlayerTooltip,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip content for a top player showing name, realm, region, rating, W/L, win rate, and a link to their character page.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof PlayerTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    player: samplePlayer,
  },
}

export const NoRank: Story = {
  args: {
    player: {
      ...samplePlayer,
      rank: null,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Player without a rank — shows dash.",
      },
    },
  },
}

export const EUPlayer: Story = {
  args: {
    player: {
      ...samplePlayer,
      name: "Whaazz",
      region: "eu",
      realm: "Outland",
    },
  },
}
