import type { Meta, StoryObj } from "@storybook/react-vite"
import type { TopPlayer } from "../../lib/api"
import { PlayerRow } from "../../components/molecules/player-row"

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
  title: "Molecules/PlayerRow",
  component: PlayerRow,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Player card row with tooltip showing name, realm, rating, W/L, win rate, and region badge.",
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
} satisfies Meta<typeof PlayerRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    player: samplePlayer,
    index: 0,
  },
}

export const WithAvatar: Story = {
  args: {
    player: {
      ...samplePlayer,
      avatar_url: "https://render.worldofwarcraft.com/us/icons/56/classicon_shaman.jpg",
    },
    index: 2,
  },
  parameters: {
    docs: {
      description: {
        story: "Player with an avatar image.",
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
      class_slug: "rogue",
    },
    index: 5,
  },
}
