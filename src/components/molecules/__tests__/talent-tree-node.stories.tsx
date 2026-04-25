import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "@/lib/api"
import type { TalentNode } from "@/lib/utils/talent-tree"
import { APEX_NODE_SIZE, NODE_SIZE } from "@/lib/utils/talent-tree"
import { TalentNodeCard } from "../talent-tree-node"

function makeTalent(
  id: number,
  name: string,
  usagePct: number,
  opts: {
    inTopBuild?: boolean
    topBuildRank?: number
    maxRank?: number
    tier?: "bis" | "situational" | "common"
    iconUrl?: string
  } = {},
): MetaTalent {
  const {
    inTopBuild = true,
    topBuildRank = 1,
    maxRank = 1,
    tier = usagePct > 50 ? "bis" : usagePct > 15 ? "situational" : "common",
    iconUrl = "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
  } = opts
  return {
    id,
    talent: {
      id,
      blizzard_id: 10000 + id,
      name,
      talent_type: "active",
      spell_id: null,
      node_id: id,
      display_row: 1,
      display_col: 1,
      max_rank: maxRank,
      default_points: 0,
      icon_url: iconUrl,
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(usagePct * 10),
    usage_pct: usagePct,
    in_top_build: inTopBuild,
    top_build_rank: topBuildRank,
    tier,
  }
}

// ── 1. Single node ──────────────────────────────────────────────────────────
const singleNode: TalentNode = {
  nodeId: 1,
  row: 1,
  col: 1,
  maxRank: 1,
  defaultPoints: 0,
  prereqIds: [],
  primary: makeTalent(1, "Mortal Strike", 98.4),
  isChoice: false,
  isRanked: false,
  all: [
    makeTalent(1, "Mortal Strike", 98.4),
  ],
}

// ── 2. Ranked node fully invested (2/2) ─────────────────────────────────────
const rankedFullNode: TalentNode = {
  nodeId: 2,
  row: 1,
  col: 1,
  maxRank: 2,
  defaultPoints: 0,
  prereqIds: [],
  primary: makeTalent(22, "Dreadnaught", 88.0, {
    topBuildRank: 1,
    maxRank: 2,
  }),
  isChoice: false,
  isRanked: true,
  all: [
    makeTalent(21, "Dreadnaught", 92.0, {
      topBuildRank: 1,
      maxRank: 2,
    }),
    makeTalent(22, "Dreadnaught", 88.0, {
      topBuildRank: 1,
      maxRank: 2,
    }),
  ],
}

// ── 3. Choice node ──────────────────────────────────────────────────────────
const choiceNode: TalentNode = {
  nodeId: 3,
  row: 2,
  col: 2,
  maxRank: 1,
  defaultPoints: 0,
  prereqIds: [],
  primary: makeTalent(31, "Bladestorm", 62.1),
  isChoice: true,
  isRanked: false,
  all: [
    makeTalent(31, "Bladestorm", 62.1),
    makeTalent(32, "Ravager", 37.9),
  ],
}

// ── 4. Ranked node partial (1/2) ────────────────────────────────────────────
const rankedPartialNode: TalentNode = {
  nodeId: 4,
  row: 1,
  col: 1,
  maxRank: 2,
  defaultPoints: 0,
  prereqIds: [],
  primary: makeTalent(42, "Impale", 30.0, {
    topBuildRank: 1,
    maxRank: 2,
  }),
  isChoice: false,
  isRanked: true,
  all: [
    makeTalent(41, "Impale", 70.0, {
      topBuildRank: 1,
      maxRank: 2,
    }),
    makeTalent(42, "Impale", 30.0, {
      topBuildRank: 0,
      inTopBuild: false,
      maxRank: 2,
    }),
  ],
}

// ── 7. Apex nodes at different ranks ────────────────────────────────────────
function makeApexNode(investedRanks: number): TalentNode {
  const variants = [
    makeTalent(71, "Ascendant Eclipses", 95.0, {
      topBuildRank: investedRanks >= 1 ? 1 : 0,
      inTopBuild: investedRanks >= 1,
      maxRank: 4,
      iconUrl: "https://wow.zamimg.com/images/wow/icons/large/spell_nature_starfall.jpg",
    }),
    makeTalent(72, "Ascendant Eclipses", 80.0, {
      topBuildRank: investedRanks >= 2 ? Math.min(investedRanks - 1, 2) : 0,
      inTopBuild: investedRanks >= 2,
      maxRank: 4,
      iconUrl: "https://wow.zamimg.com/images/wow/icons/large/spell_nature_starfall.jpg",
    }),
    makeTalent(73, "Ascendant Eclipses", 60.0, {
      topBuildRank: investedRanks >= 4 ? 1 : 0,
      inTopBuild: investedRanks >= 4,
      maxRank: 4,
      iconUrl: "https://wow.zamimg.com/images/wow/icons/large/spell_nature_starfall.jpg",
    }),
  ]
  return {
    nodeId: 7,
    row: 10,
    col: 3,
    maxRank: 4,
    defaultPoints: 0,
    prereqIds: [],
    primary: variants[variants.length - 1],
    isChoice: false,
    isRanked: true,
    all: variants,
  }
}

const PAD = 32
const APEX_PAD = 40

const meta = {
  title: "Molecules/TalentNodeCard",
  component: TalentNodeCard,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Positioned talent node card used inside the talent tree canvas. Covers all node types: single, ranked, choice, partial rank, and apex with progressive glow.",
      },
    },
    layout: "centered",
  },
  args: {
    node: singleNode,
    left: PAD,
    top: PAD,
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
      style={{
        width: NODE_SIZE + PAD * 2,
        height: NODE_SIZE + PAD * 2 + 20,
      }}
    >
      <Story />
    </div>
  )
}

function apexCanvas(Story: React.ComponentType) {
  return (
    <div
      className="bg-muted/20 relative rounded"
      style={{
        width: APEX_NODE_SIZE + APEX_PAD * 2,
        height: APEX_NODE_SIZE + APEX_PAD * 2 + 20,
      }}
    >
      <Story />
    </div>
  )
}

// ── 1. Single node — no rank, no chevrons, full border ──────────────────────
export const SingleNode: Story = {
  args: {
    node: singleNode,
    budget: 34,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "**Case 1:** Standard single-rank node. Full border, no rank label, no chevrons.",
      },
    },
  },
}

// ── 2. Ranked fully invested (2/2) — shows "2/2", full border ───────────────
export const RankedFull: Story = {
  args: {
    node: rankedFullNode,
    hideStats: true,
    fullOpacity: true,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Case 2:** Ranked node at max rank (2/2). Shows rank label below, full border (no clip).",
      },
    },
  },
}

// ── 3. Choice node — chevrons, full border, no rank ─────────────────────────
export const ChoiceNodeStory: Story = {
  name: "Choice Node",
  args: {
    node: choiceNode,
    budget: 34,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Case 3:** Choice node with chevron arrows. Full border, no rank label. Shows % and 'choice' label.",
      },
    },
  },
}

// Character page choice — no %, full border, chevrons
export const ChoiceNodeCharacter: Story = {
  name: "Choice Node (Character)",
  args: {
    node: choiceNode,
    hideStats: true,
    fullOpacity: true,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Case 3b:** Choice node on character page. Chevrons, full border, NO percentage, NO rank label.",
      },
    },
  },
}

// ── 4. Ranked partial (1/2) — clipped border, shows "1/2" ──────────────────
export const RankedPartial: Story = {
  args: {
    node: rankedPartialNode,
    budget: 34,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Case 4:** Ranked node partially invested (1/2). Diagonal-clipped border (bottom-right only).",
      },
    },
  },
}

export const RankedPartialCharacter: Story = {
  name: "Ranked Partial (Character)",
  args: {
    node: rankedPartialNode,
    hideStats: true,
    fullOpacity: true,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Case 4b:** Ranked partial on character page. Shows '1/2' label, clipped border, no percentage.",
      },
    },
  },
}

// ── 5. Character page — no percentage ───────────────────────────────────────
export const CharacterNoStats: Story = {
  name: "Character Page (no %)",
  args: {
    node: singleNode,
    hideStats: true,
    fullOpacity: true,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Case 5:** Character page mode. No percentage shown, no budget borders, uses activeColor border.",
      },
    },
  },
}

// ── 6. Bracket page — shows percentage ──────────────────────────────────────
export const BracketWithStats: Story = {
  name: "Bracket Page (with %)",
  args: {
    node: singleNode,
    budget: 34,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Case 6:** Bracket/meta page. Shows usage percentage below node, tier-colored border.",
      },
    },
  },
}

// ── Situational node — shows percentage ──────────────────────────────────────
const situationalNode: TalentNode = {
  nodeId: 5,
  row: 1,
  col: 1,
  maxRank: 1,
  defaultPoints: 0,
  prereqIds: [],
  primary: makeTalent(51, "Shield Block", 39.0, {
    tier: "situational",
  }),
  isChoice: false,
  isRanked: false,
  all: [
    makeTalent(51, "Shield Block", 39.0, {
      tier: "situational",
    }),
  ],
}

export const Situational: Story = {
  name: "Situational (shows %)",
  args: {
    node: situationalNode,
    budget: 34,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story:
          "**Situational:** Shows usage % even though it's in the top build (purple border, 0.75 opacity).",
      },
    },
  },
}

// ── Ranked inline — shows "90% · 2/2" ─────────────────────────────────────
export const RankedInline: Story = {
  name: "Ranked Inline (% · rank)",
  args: {
    node: rankedFullNode,
    budget: 34,
  },
  decorators: [
    canvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "**Ranked inline:** Shows usage % and rank on a single line: `92% · 2/2`.",
      },
    },
  },
}

// ── 7. Apex nodes — progressive glow ────────────────────────────────────────
export const ApexRank1: Story = {
  name: "Apex 1/4 (subtle glow)",
  args: {
    node: makeApexNode(1),
    left: APEX_PAD,
    top: APEX_PAD,
    hideStats: true,
    fullOpacity: true,
    isApex: true,
  },
  decorators: [
    apexCanvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "**Case 7a:** Apex at 1/4 — subtle static glow.",
      },
    },
  },
}

export const ApexRank2: Story = {
  name: "Apex 2/4 (medium glow)",
  args: {
    node: makeApexNode(2),
    left: APEX_PAD,
    top: APEX_PAD,
    hideStats: true,
    fullOpacity: true,
    isApex: true,
  },
  decorators: [
    apexCanvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "**Case 7b:** Apex at 2/4 — medium static glow.",
      },
    },
  },
}

export const ApexRank3: Story = {
  name: "Apex 3/4 (strong glow)",
  args: {
    node: makeApexNode(3),
    left: APEX_PAD,
    top: APEX_PAD,
    hideStats: true,
    fullOpacity: true,
    isApex: true,
  },
  decorators: [
    apexCanvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "**Case 7c:** Apex at 3/4 — strong static glow.",
      },
    },
  },
}

export const ApexRank4: Story = {
  name: "Apex 4/4 (animated glow)",
  args: {
    node: makeApexNode(4),
    left: APEX_PAD,
    top: APEX_PAD,
    hideStats: true,
    fullOpacity: true,
    isApex: true,
  },
  decorators: [
    apexCanvas,
  ],
  parameters: {
    docs: {
      description: {
        story: "**Case 7d:** Apex at 4/4 — full animated pulsing glow.",
      },
    },
  },
}

// ── All apex ranks side by side ─────────────────────────────────────────────
export const ApexProgression: Story = {
  name: "Apex Progression (all ranks)",
  args: {
    node: makeApexNode(1),
    left: 0,
    top: 0,
    hideStats: true,
    fullOpacity: true,
    isApex: true,
  },
  parameters: {
    docs: {
      description: {
        story: "**Case 7:** All apex glow levels side by side — 1/4 through 4/4.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-10 p-8">
      {[
        1,
        2,
        3,
        4,
      ].map((rank) => (
        <div key={rank} className="flex flex-col items-center gap-2">
          <div
            className="relative"
            style={{
              width: APEX_NODE_SIZE,
              height: APEX_NODE_SIZE + 20,
            }}
          >
            <TalentNodeCard
              node={makeApexNode(rank)}
              left={0}
              top={0}
              fullOpacity
              onlyChoicePct={false}
              activeColor="#ff7d0a"
              hideStats
              isApex
            />
          </div>
          <span className="text-muted-foreground mt-2 text-xs font-mono">{rank}/4</span>
        </div>
      ))}
    </div>
  ),
}
