import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaStatsEntry } from "@/features/meta/components/meta-stats-table"
import { ClassWheel } from "../class-wheel"

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

// Multiple specs per class to show grouping
const multiSpecEntries: MetaStatsEntry[] = [
  ...mockEntries,
  {
    key: "4",
    specName: "assassination",
    className: "rogue",
    role: "dps",
    score: 40,
    normPct: 45,
    tier: "C" as const,
    thetaHat: 1840,
    ratingCiLow: 1830,
    ratingCiHigh: 1850,
    meanRating: 1840,
    wrHat: 0.51,
    presence: 0.06,
    bK: 0.7,
    color: "var(--color-class-rogue)",
    specUrl: "/pvp/rogue/assassination/2v2",
  },
  {
    key: "5",
    specName: "mistweaver",
    className: "monk",
    role: "healer",
    score: 70,
    normPct: 79,
    tier: "A" as const,
    thetaHat: 1875,
    ratingCiLow: 1865,
    ratingCiHigh: 1885,
    meanRating: 1875,
    wrHat: 0.58,
    presence: 0.09,
    bK: 0.85,
    color: "var(--color-class-monk)",
    specUrl: "/pvp/monk/mistweaver/2v2",
  },
]

const meta = {
  title: "Atoms/ClassWheel",
  component: ClassWheel,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Donut chart showing class presence distribution with a legend listing top 6 classes by total spec presence.",
      },
    },
  },
} satisfies Meta<typeof ClassWheel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entries: mockEntries,
  },
}

export const MultipleSpecsPerClass: Story = {
  args: {
    entries: multiSpecEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "Specs from the same class are grouped into a single slice.",
      },
    },
  },
}

export const SingleSpec: Story = {
  args: {
    entries: [
      mockEntries[0],
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "With only one spec the entire donut is one class.",
      },
    },
  },
}
