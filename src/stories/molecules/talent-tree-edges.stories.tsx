import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "../../lib/api"
import type { TalentNode } from "../../lib/utils/talent-tree"
import { TalentEdges } from "../../components/molecules/talent-tree-edges"
import { NODE_SIZE } from "../../lib/utils/talent-tree"

function makeTalent(id: number, row: number, col: number): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: 10000 + id,
      name: `Talent ${id}`,
      description: null,
      talent_type: "active",
      spell_id: null,
      node_id: id,
      display_row: row,
      display_col: col,
      max_rank: 1,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: [],
    },
    usage_count: 100,
    usage_pct: 80,
    in_top_build: true,
    top_build_rank: 1,
    tier: "bis" as const,
    snapshot_at: "2026-03-02T00:00:00Z",
  }
}

const COLS = 4
const COL_W = 80
const ROW_H = 80
const SVG_W = COLS * COL_W + NODE_SIZE
const SVG_H = 3 * ROW_H + NODE_SIZE

const nodes: TalentNode[] = [
  {
    nodeId: 1,
    row: 1,
    col: 1,
    maxRank: 1,
    defaultPoints: 0,
    prereqIds: [],
    primary: makeTalent(1, 1, 1),
    isChoice: false,
    isRanked: false,
    all: [],
  },
  {
    nodeId: 2,
    row: 1,
    col: 3,
    maxRank: 1,
    defaultPoints: 0,
    prereqIds: [],
    primary: makeTalent(2, 1, 3),
    isChoice: false,
    isRanked: false,
    all: [],
  },
  {
    nodeId: 3,
    row: 2,
    col: 2,
    maxRank: 1,
    defaultPoints: 0,
    prereqIds: [],
    primary: makeTalent(3, 2, 2),
    isChoice: false,
    isRanked: false,
    all: [],
  },
  {
    nodeId: 4,
    row: 3,
    col: 1,
    maxRank: 1,
    defaultPoints: 0,
    prereqIds: [],
    primary: makeTalent(4, 3, 1),
    isChoice: false,
    isRanked: false,
    all: [],
  },
  {
    nodeId: 5,
    row: 3,
    col: 3,
    maxRank: 1,
    defaultPoints: 0,
    prereqIds: [],
    primary: makeTalent(5, 3, 3),
    isChoice: false,
    isRanked: false,
    all: [],
  },
]

const nodeMap = new Map(
  nodes.map((n) => [
    n.nodeId,
    n,
  ]),
)
const edgeSet = new Set([
  "1→3",
  "2→3",
  "3→4",
  "3→5",
])
const nodeCX = (n: TalentNode) => n.col * COL_W
const nodeY = (row: number) => row * ROW_H

const meta = {
  title: "Molecules/TalentEdges",
  component: TalentEdges,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "SVG overlay that draws prerequisite edges between talent nodes in the talent tree. Lines are coloured with the active class colour and dim when the connected nodes are not in the top build.",
      },
    },
    layout: "centered",
  },
  args: {
    edgeSet,
    nodeMap,
    nodeCX,
    nodeY,
    svgW: SVG_W,
    svgH: SVG_H,
    activeColor: "#c79c6e",
  },
} satisfies Meta<typeof TalentEdges>

export default meta
type Story = StoryObj<typeof meta>

function canvas(Story: React.ComponentType) {
  return (
    <div
      className="bg-muted/20 relative rounded"
      style={{
        width: SVG_W,
        height: SVG_H,
      }}
    >
      <Story />
    </div>
  )
}

export const Default: Story = {
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "All edges active (full-brightness lines). Hover a line to highlight it.",
      },
    },
  },
}

export const NoTopBuildEdges: Story = {
  args: {
    budget: 10,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "No nodes are in the top build — all edges are dimmed.",
      },
    },
  },
}

export const PartialTopBuild: Story = {
  args: {
    budget: 10,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "Only 1→3 and 3→4 are top-build edges; others are dimmed.",
      },
    },
  },
}
