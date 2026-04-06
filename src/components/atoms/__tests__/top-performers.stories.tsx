import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaStatsEntry } from "../../components/molecules/meta-stats-table"
import { TopPerformers } from "../top-performers"

const mockEntries: MetaStatsEntry[] = [
  {
    key: "1",
    specName: "subtlety",
    className: "rogue",
    role: "dps",
    score: 88,
    normPct: 100,
    tier: "S+" as const,
    thetaHat: 1899,
    ratingCiLow: 1891,
    ratingCiHigh: 1907,
    meanRating: 1899,
    wrHat: 0.604,
    presence: 0.113,
    bK: 0.92,
    color: "var(--color-class-rogue)",
    specUrl: "/pvp/rogue/subtlety/2v2",
  },
  {
    key: "2",
    specName: "windwalker",
    className: "monk",
    role: "dps",
    score: 54,
    normPct: 61,
    tier: "A" as const,
    thetaHat: 1885,
    ratingCiLow: 1885,
    ratingCiHigh: 1904,
    meanRating: 1885,
    wrHat: 0.614,
    presence: 0.078,
    bK: 0.88,
    color: "var(--color-class-monk)",
    specUrl: "/pvp/monk/windwalker/2v2",
  },
  {
    key: "3",
    specName: "shadow",
    className: "priest",
    role: "dps",
    score: 50,
    normPct: 57,
    tier: "B" as const,
    thetaHat: 1860,
    ratingCiLow: 1849,
    ratingCiHigh: 1872,
    meanRating: 1860,
    wrHat: 0.586,
    presence: 0.051,
    bK: 0.65,
    color: "var(--color-class-priest)",
    specUrl: "/pvp/priest/shadow/2v2",
  },
]

const withIconsEntries = mockEntries.map((e) => ({
  ...e,
  iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_rogue_shadowstrike.jpg",
}))

const meta = {
  title: "Atoms/TopPerformers",
  component: TopPerformers,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays the top 3 specs by score with medal icons, spec/class names, and tier badges.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 240,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopPerformers>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entries: mockEntries,
  },
}

export const WithIcons: Story = {
  args: {
    entries: withIconsEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "Each entry has a spec icon displayed beside the spec name.",
      },
    },
  },
}

export const SingleEntry: Story = {
  args: {
    entries: [
      mockEntries[0],
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Only one entry — only the gold medal row shows.",
      },
    },
  },
}
