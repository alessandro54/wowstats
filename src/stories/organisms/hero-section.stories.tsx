import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "../../lib/api"
import { HeroSection } from "../../components/organisms/hero-section"

function makeTalent(
  id: number,
  name: string,
  usagePct: number,
  opts: { row?: number, col?: number, prereqs?: number[], nodeId?: number } = {},
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: 80000 + id,
      name,
      description: `${name} — a powerful hero talent.`,
      talent_type: "hero",
      spell_id: null,
      node_id: opts.nodeId ?? id,
      display_row: opts.row ?? 0,
      display_col: opts.col ?? 0,
      max_rank: 1,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
      prerequisite_node_ids: opts.prereqs ?? [],
    },
    usage_count: Math.round(usagePct * 10),
    usage_pct: usagePct,
    in_top_build: usagePct > 50,
    top_build_rank: 1,
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

// Primary hero tree (higher usage)
const primaryTree: MetaTalent[] = [
  makeTalent(1, "Slayer's Strike", 95.0, { row: 0, col: 1 }),
  makeTalent(2, "Reap the Storm", 88.0, { row: 1, col: 0, prereqs: [1] }),
  makeTalent(3, "Imminent Demise", 82.0, { row: 1, col: 2, prereqs: [1] }),
  makeTalent(4, "Culling Cyclone", 91.0, { row: 2, col: 1, prereqs: [2, 3] }),
]

// Alternate hero tree (lower usage)
const altTree: MetaTalent[] = [
  makeTalent(101, "Colossus Smash", 40.0, { row: 0, col: 1, nodeId: 101 }),
  makeTalent(102, "Tide of Battle", 35.0, { row: 1, col: 0, nodeId: 102, prereqs: [101] }),
  makeTalent(103, "No Stranger to Pain", 32.0, { row: 1, col: 2, nodeId: 103, prereqs: [101] }),
]

const meta = {
  title: "Organisms/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Hero talent section showing the dominant hero tree, with the alternate tree revealed on hover via tooltip. Uses BFS to split connected components.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof HeroSection>

export default meta
type Story = StoryObj<typeof meta>

export const WithAltTree: Story = {
  args: {
    heroEntries: [...primaryTree, ...altTree],
    activeColor: "#c79c6e",
  },
  parameters: {
    docs: {
      description: {
        story: "Two hero trees — primary is shown, alternate is revealed on hover.",
      },
    },
  },
}

export const SingleTree: Story = {
  args: {
    heroEntries: primaryTree,
    activeColor: "#69ccf0",
  },
  parameters: {
    docs: {
      description: { story: "Only one hero tree available — rendered without the tooltip wrapper." },
    },
  },
}

export const FlatList: Story = {
  args: {
    heroEntries: [
      { ...primaryTree[0], talent: { ...primaryTree[0].talent, display_row: null, display_col: null } },
      { ...primaryTree[1], talent: { ...primaryTree[1].talent, display_row: null, display_col: null } },
    ],
    activeColor: "#abd473",
  },
  parameters: {
    docs: {
      description: {
        story: "No tree data (missing row/col) — falls back to TalentList rendering.",
      },
    },
  },
}
