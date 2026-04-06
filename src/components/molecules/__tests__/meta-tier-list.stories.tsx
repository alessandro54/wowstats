import type { Meta, StoryObj } from "@storybook/react-vite"
import { HoverProvider } from "@/components/providers/hover-provider"
import type { MetaStatsEntry } from "../meta-stats-table"
import { MetaTierList, type SpecBracketData } from "../meta-tier-list"

const mockEntries: MetaStatsEntry[] = [
  {
    key: "subtlety-rogue",
    specName: "subtlety",
    className: "rogue",
    role: "dps",
    score: 88,
    normPct: 100,
    tier: "S+",
    thetaHat: 1899,
    ratingCiLow: 1891,
    ratingCiHigh: 1907,
    meanRating: 1899,
    wrHat: 0.604,
    presence: 0.113,
    bK: 0.92,
    color: "#FFF468",
    specUrl: "/pvp/rogue/subtlety/2v2",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_stealth.jpg",
  },
  {
    key: "arms-warrior",
    specName: "arms",
    className: "warrior",
    role: "dps",
    score: 78,
    normPct: 89,
    tier: "S",
    thetaHat: 1820,
    ratingCiLow: 1812,
    ratingCiHigh: 1828,
    meanRating: 1820,
    wrHat: 0.561,
    presence: 0.091,
    bK: 0.85,
    color: "#C69B3A",
    specUrl: "/pvp/warrior/arms/2v2",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/ability_warrior_savageblow.jpg",
  },
  {
    key: "fire-mage",
    specName: "fire",
    className: "mage",
    role: "dps",
    score: 65,
    normPct: 74,
    tier: "A",
    thetaHat: 1755,
    ratingCiLow: 1748,
    ratingCiHigh: 1762,
    meanRating: 1755,
    wrHat: 0.53,
    presence: 0.067,
    bK: 0.78,
    color: "#3FC7EB",
    specUrl: "/pvp/mage/fire/2v2",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_fire_firebolt02.jpg",
  },
  {
    key: "holy-paladin",
    specName: "holy",
    className: "paladin",
    role: "healer",
    score: 72,
    normPct: 82,
    tier: "S",
    thetaHat: 1810,
    ratingCiLow: 1803,
    ratingCiHigh: 1817,
    meanRating: 1810,
    wrHat: 0.552,
    presence: 0.088,
    bK: 0.83,
    color: "#F48CBA",
    specUrl: "/pvp/paladin/holy/2v2",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_holy_holybolt.jpg",
  },
  {
    key: "balance-druid",
    specName: "balance",
    className: "druid",
    role: "dps",
    score: 42,
    normPct: 48,
    tier: "B",
    thetaHat: 1680,
    ratingCiLow: 1673,
    ratingCiHigh: 1687,
    meanRating: 1680,
    wrHat: 0.505,
    presence: 0.041,
    bK: 0.61,
    color: "#FF7C0A",
    specUrl: "/pvp/druid/balance/2v2",
    iconUrl: "https://render.worldofwarcraft.com/us/icons/56/spell_nature_starfall.jpg",
  },
]

const mockBracketComparison = new Map<string, SpecBracketData>([
  [
    "subtlety-rogue",
    {
      specId: "261",
      ranks: [
        {
          bracket: "2v2",
          label: "2v2",
          tier: "S+",
          score: 88,
          rank: 1,
        },
        {
          bracket: "3v3",
          label: "3v3",
          tier: "S",
          score: 75,
          rank: 2,
        },
        {
          bracket: "shuffle-rogue-subtlety",
          label: "Shuffle",
          tier: "S+",
          score: 91,
          rank: 1,
        },
      ],
    },
  ],
  [
    "arms-warrior",
    {
      specId: "71",
      ranks: [
        {
          bracket: "2v2",
          label: "2v2",
          tier: "S",
          score: 78,
          rank: 3,
        },
        {
          bracket: "3v3",
          label: "3v3",
          tier: "A",
          score: 62,
          rank: 5,
        },
        {
          bracket: "shuffle-warrior-arms",
          label: "Shuffle",
          tier: "S",
          score: 80,
          rank: 2,
        },
      ],
    },
  ],
  [
    "fire-mage",
    {
      specId: "63",
      ranks: [
        {
          bracket: "2v2",
          label: "2v2",
          tier: "A",
          score: 65,
          rank: 6,
        },
        {
          bracket: "3v3",
          label: "3v3",
          tier: "S",
          score: 82,
          rank: 1,
        },
        {
          bracket: "shuffle-mage-fire",
          label: "Shuffle",
          tier: "A",
          score: 67,
          rank: 5,
        },
      ],
    },
  ],
  [
    "holy-paladin",
    {
      specId: "65",
      ranks: [
        {
          bracket: "2v2",
          label: "2v2",
          tier: "S",
          score: 72,
          rank: 4,
        },
        {
          bracket: "3v3",
          label: "3v3",
          tier: "S",
          score: 74,
          rank: 3,
        },
        {
          bracket: "shuffle-paladin-holy",
          label: "Shuffle",
          tier: "A",
          score: 68,
          rank: 4,
        },
      ],
    },
  ],
  [
    "balance-druid",
    {
      specId: "102",
      ranks: [
        {
          bracket: "2v2",
          label: "2v2",
          tier: "B",
          score: 42,
          rank: 10,
        },
        {
          bracket: "3v3",
          label: "3v3",
          tier: "B",
          score: 45,
          rank: 9,
        },
        {
          bracket: "shuffle-druid-balance",
          label: "Shuffle",
          tier: "C",
          score: 33,
          rank: 14,
        },
      ],
    },
  ],
])

const meta = {
  title: "Molecules/MetaTierList",
  component: MetaTierList,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Tier-list view grouping specs into S+/S/A/B/C/D rows by their meta score. Each spec icon opens a hover card showing cross-bracket rank and score bars.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <HoverProvider>
        <Story />
      </HoverProvider>
    ),
  ],
} satisfies Meta<typeof MetaTierList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entries: mockEntries,
    bracketComparison: mockBracketComparison,
    currentBracket: "2v2",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Mixed DPS and healer specs spread across S+, S, A, and B tiers. Hover an icon to see cross-bracket comparison data.",
      },
    },
  },
}

export const SingleTier: Story = {
  args: {
    entries: mockEntries.slice(0, 2),
    bracketComparison: mockBracketComparison,
    currentBracket: "3v3",
  },
  parameters: {
    docs: {
      description: {
        story: "Only S+/S tiers populated — lower tiers render nothing (no empty rows shown).",
      },
    },
  },
}
