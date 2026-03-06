import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "../../lib/api"
import type { TalentNode } from "../../lib/utils/talent-tree"
import { TalentNodeCard } from "../../components/molecules/talent-tree-node"
import { NODE_SIZE } from "../../lib/utils/talent-tree"

function makeTalent(id: number, name: string, usagePct: number, inTopBuild = true, topBuildRank = 1, maxRank = 1): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: 10000 + id,
      name,
      description: "A powerful warrior ability dealing heavy physical damage.",
      talent_type: "active",
      spell_id: null,
      node_id: id,
      display_row: 1,
      display_col: 1,
      max_rank: maxRank,
      default_points: 0,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(usagePct * 10),
    usage_pct: usagePct,
    in_top_build: inTopBuild,
    top_build_rank: topBuildRank,
    snapshot_at: "2026-03-02T00:00:00Z",
  }
}

const topBuildNode: TalentNode = {
  nodeId: 1,
  row: 1,
  col: 1,
  maxRank: 1,
  defaultPoints: 0,
  primary: makeTalent(1, "Mortal Strike", 98.4),
  isChoice: false,
  all: [makeTalent(1, "Mortal Strike", 98.4)],
}

const choiceNode: TalentNode = {
  nodeId: 2,
  row: 2,
  col: 2,
  maxRank: 1,
  defaultPoints: 0,
  primary: makeTalent(2, "Bladestorm", 62.1),
  isChoice: true,
  all: [makeTalent(2, "Bladestorm", 62.1), makeTalent(3, "Ravager", 37.9, true, 1)],
}

const partialRankNode: TalentNode = {
  nodeId: 4,
  row: 3,
  col: 1,
  maxRank: 2,
  defaultPoints: 0,
  primary: makeTalent(4, "Dreadnaught", 88.0, true, 1, 2),
  isChoice: false,
  all: [makeTalent(4, "Dreadnaught", 88.0, true, 1, 2)],
}

const dimNode: TalentNode = {
  nodeId: 5,
  row: 4,
  col: 1,
  maxRank: 1,
  defaultPoints: 0,
  primary: makeTalent(5, "Fervor of Battle", 12.0, false),
  isChoice: false,
  all: [makeTalent(5, "Fervor of Battle", 12.0, false)],
}

const PAD = 24

const meta = {
  title: "Molecules/TalentNodeCard",
  component: TalentNodeCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Positioned talent node card used inside the talent tree canvas. Shows a `TalentIcon` with opacity/border based on whether the talent is in the top build, situational, or unused.",
      },
    },
    layout: "centered",
  },
  args: {
    node: topBuildNode,
    left: PAD,
    top: PAD,
    topNodeIds: new Set([1]),
    fullOpacity: false,
    onlyChoicePct: false,
    activeColor: "#c79c6e",
  },
} satisfies Meta<typeof TalentNodeCard>

export default meta
type Story = StoryObj<typeof meta>

function canvas(Story: React.ComponentType) {
  return (
    <div
      className="bg-muted/20 relative rounded"
      style={{ width: NODE_SIZE + PAD * 2, height: NODE_SIZE + PAD * 2 }}
    >
      <Story />
    </div>
  )
}

export const TopBuild: Story = {
  decorators: [canvas],
  parameters: {
    docs: {
      description: { story: "Full-opacity node that is in the top build. No percentage shown." },
    },
  },
}

export const ChoiceNode: Story = {
  args: { node: choiceNode, topNodeIds: new Set([2, 3]) },
  decorators: [canvas],
  parameters: {
    docs: {
      description: {
        story:
          "Choice node — two talent alternatives share the same tree position. Both percentage and 'choice' label are shown.",
      },
    },
  },
}

export const PartialRank: Story = {
  args: { node: partialRankNode, topNodeIds: new Set([4]) },
  decorators: [canvas],
  parameters: {
    docs: {
      description: {
        story:
          "Multi-rank node where the top build uses fewer than the maximum ranks — diagonal border clip is applied.",
      },
    },
  },
}

export const DimmedUnused: Story = {
  args: { node: dimNode, topNodeIds: new Set() },
  decorators: [canvas],
  parameters: {
    docs: {
      description: {
        story: "Talent not in the top build and below 30% usage — rendered at low opacity.",
      },
    },
  },
}
