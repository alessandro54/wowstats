import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaStatsEntry } from "../../components/molecules/meta-stats-table"
import { DiversityMeter } from "../diversity-meter"

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

// Uniform presence → max entropy → Healthy
const healthyEntries: MetaStatsEntry[] = Array.from(
  {
    length: 10,
  },
  (_, i) => ({
    key: String(i),
    specName: `spec-${i}`,
    className: `class-${i}`,
    role: "dps",
    score: 80 - i * 3,
    normPct: 100 - i * 5,
    tier: "A" as const,
    thetaHat: 1900,
    ratingCiLow: 1890,
    ratingCiHigh: 1910,
    meanRating: 1900,
    wrHat: 0.55,
    presence: 0.1,
    bK: 0.9,
    color: "var(--color-primary)",
    specUrl: `/pvp/class-${i}/spec-${i}/2v2`,
  }),
)

// One dominant spec → Solved
const solvedEntries: MetaStatsEntry[] = [
  {
    ...mockEntries[0],
    presence: 0.95,
  },
  {
    ...mockEntries[1],
    presence: 0.03,
  },
  {
    ...mockEntries[2],
    presence: 0.02,
  },
]

const meta = {
  title: "Atoms/DiversityMeter",
  component: DiversityMeter,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays meta health as a normalized Shannon entropy meter, indicating how evenly distributed spec presence is.",
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
} satisfies Meta<typeof DiversityMeter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entries: mockEntries,
  },
}

export const Healthy: Story = {
  args: {
    entries: healthyEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "All specs equally present — maximum diversity.",
      },
    },
  },
}

export const Solved: Story = {
  args: {
    entries: solvedEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "One dominant spec — meta is effectively solved.",
      },
    },
  },
}

export const Empty: Story = {
  args: {
    entries: [],
  },
}
