import type { Meta, StoryObj } from "@storybook/react-vite"
import type { TopPlayer } from "../../lib/api"
import { TopPlayers } from "../../components/organisms/top-players"

function makePlayer(
  name: string,
  region: "us" | "eu",
  rating: number,
  classSlug: string,
): TopPlayer {
  return {
    name,
    realm: "Tichondrius",
    region,
    rating,
    wins: 150,
    losses: 60,
    rank: 1,
    score: rating + 200,
    avatar_url: null,
    class_slug: classSlug,
  }
}

const playersByRegion = {
  all: [
    makePlayer("Cdew", "us", 2450, "shaman"),
    makePlayer("Whaazz", "eu", 2400, "rogue"),
    makePlayer("Pikaboo", "us", 2380, "rogue"),
  ],
  us: [
    makePlayer("Cdew", "us", 2450, "shaman"),
    makePlayer("Pikaboo", "us", 2380, "rogue"),
  ],
  eu: [
    makePlayer("Whaazz", "eu", 2400, "rogue"),
  ],
}

const meta = {
  title: "Organisms/TopPlayers",
  component: TopPlayers,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component: "Top players section with region filter (ALL/US/EU) and a grid of player rows.",
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
} satisfies Meta<typeof TopPlayers>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    playersByRegion,
  },
}

export const Empty: Story = {
  args: {
    playersByRegion: {
      all: [],
      us: [],
      eu: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Returns null when no players.",
      },
    },
  },
}
