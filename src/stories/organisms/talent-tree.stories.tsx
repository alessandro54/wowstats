import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "../../lib/api"
import { TalentTree } from "../../components/organisms/talent-tree"

function makeTalent(
  id: number,
  name: string,
  usagePct: number,
  opts: {
    row?: number
    col?: number
    prereqs?: number[]
    maxRank?: number
    inTopBuild?: boolean
    topBuildRank?: number
    iconUrl?: string
  } = {},
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: 90000 + id,
      name,
      description: `${name} — deals damage or provides a buff.`,
      talent_type: "spec",
      spell_id: null,
      node_id: id,
      display_row: opts.row ?? 0,
      display_col: opts.col ?? 0,
      max_rank: opts.maxRank ?? 1,
      default_points: 0,
      icon_url: opts.iconUrl ?? "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
      prerequisite_node_ids: opts.prereqs ?? [],
    },
    usage_count: Math.round(usagePct * 10),
    usage_pct: usagePct,
    in_top_build: opts.inTopBuild ?? usagePct > 50,
    top_build_rank: opts.topBuildRank ?? 1,
    tier: (usagePct > 50 ? "bis" : usagePct > 15 ? "situational" : "common") as "bis" | "situational" | "common",
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

// A small tree:  A -> B -> D
//                A -> C -> D
const smallTree: MetaTalent[] = [
  makeTalent(1, "Mortal Strike", 98.4, { row: 0, col: 1 }),
  makeTalent(2, "Overpower", 87.2, { row: 1, col: 0, prereqs: [1] }),
  makeTalent(3, "Execute", 76.0, { row: 1, col: 2, prereqs: [1] }),
  makeTalent(4, "Colossus Smash", 92.5, { row: 2, col: 1, prereqs: [2, 3] }),
  makeTalent(5, "Bladestorm", 55.0, { row: 3, col: 0, prereqs: [4] }),
  makeTalent(6, "Warbreaker", 45.0, { row: 3, col: 2, prereqs: [4] }),
]

// Wider tree mimicking a real spec tree
const wideTree: MetaTalent[] = [
  makeTalent(10, "Root Ability", 99.1, { row: 0, col: 2 }),
  makeTalent(11, "Talent A", 95.0, { row: 1, col: 0, prereqs: [10] }),
  makeTalent(12, "Talent B", 91.0, { row: 1, col: 2, prereqs: [10] }),
  makeTalent(13, "Talent C", 88.0, { row: 1, col: 4, prereqs: [10] }),
  makeTalent(14, "Talent D", 82.0, { row: 2, col: 0, prereqs: [11] }),
  makeTalent(15, "Talent E", 78.0, { row: 2, col: 1, prereqs: [11, 12] }),
  makeTalent(16, "Talent F", 60.0, { row: 2, col: 3, prereqs: [12, 13] }),
  makeTalent(17, "Talent G", 40.0, { row: 2, col: 4, prereqs: [13] }),
  makeTalent(18, "Capstone", 96.0, { row: 3, col: 2, prereqs: [15, 16] }),
]

const meta = {
  title: "Organisms/TalentTree",
  component: TalentTree,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "SVG-based talent tree visualization. Renders nodes and prerequisite edges on a grid layout with BIS/Situational highlighting when a budget is provided.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof TalentTree>

export default meta
type Story = StoryObj<typeof meta>

export const SmallTree: Story = {
  args: {
    talents: smallTree,
    activeColor: "#c79c6e",
  },
  parameters: {
    docs: { description: { story: "Minimal 6-node tree with branching and merging edges." } },
  },
}

export const WithBudget: Story = {
  args: {
    talents: smallTree,
    activeColor: "#c79c6e",
    budget: 4,
  },
  parameters: {
    docs: {
      description: {
        story: "Budget mode highlights top nodes as BIS and remaining as Situational. Shows the legend.",
      },
    },
  },
}

export const WideTree: Story = {
  args: {
    talents: wideTree,
    activeColor: "#69ccf0",
    budget: 7,
  },
  parameters: {
    docs: { description: { story: "Larger 9-node tree with 5 columns and BIS budget." } },
  },
}

export const FullOpacity: Story = {
  args: {
    talents: smallTree,
    activeColor: "#abd473",
    fullOpacity: true,
    onlyChoicePct: true,
  },
  parameters: {
    docs: {
      description: {
        story: "All nodes at full opacity — used for hero talent sub-trees. Only choice percentages shown.",
      },
    },
  },
}
