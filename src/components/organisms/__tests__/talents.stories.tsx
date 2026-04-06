import type { Meta, StoryObj } from "@storybook/react-vite"
import { HoverProvider } from "../../components/providers/hover-provider"
import type { MetaTalent } from "../../lib/api"
import { Talents } from "../talents"

function makeTalent(
  id: number,
  name: string,
  usagePct: number,
  talentType: string,
  opts: {
    row?: number
    col?: number
    prereqs?: number[]
    maxRank?: number
  } = {},
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: 70000 + id,
      name,
      description: `${name} — ${talentType} talent.`,
      talent_type: talentType,
      spell_id: null,
      node_id: id,
      display_row: opts.row ?? null,
      display_col: opts.col ?? null,
      max_rank: opts.maxRank ?? 1,
      default_points: 0,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
      prerequisite_node_ids: opts.prereqs ?? [],
    },
    usage_count: Math.round(usagePct * 10),
    usage_pct: usagePct,
    in_top_build: usagePct > 50,
    top_build_rank: 1,
    tier: (usagePct > 50 ? "bis" : usagePct > 15 ? "situational" : "common") as
      | "bis"
      | "situational"
      | "common",
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

const specTalents: MetaTalent[] = [
  makeTalent(1, "Mortal Strike", 98.4, "spec", {
    row: 0,
    col: 1,
  }),
  makeTalent(2, "Overpower", 87.2, "spec", {
    row: 1,
    col: 0,
    prereqs: [
      1,
    ],
  }),
  makeTalent(3, "Execute", 76.0, "spec", {
    row: 1,
    col: 2,
    prereqs: [
      1,
    ],
  }),
  makeTalent(4, "Colossus Smash", 92.5, "spec", {
    row: 2,
    col: 1,
    prereqs: [
      2,
      3,
    ],
  }),
]

const classTalents: MetaTalent[] = [
  makeTalent(11, "Charge", 99.0, "class", {
    row: 0,
    col: 1,
  }),
  makeTalent(12, "Heroic Throw", 72.0, "class", {
    row: 1,
    col: 0,
    prereqs: [
      11,
    ],
  }),
  makeTalent(13, "Spell Reflect", 85.0, "class", {
    row: 1,
    col: 2,
    prereqs: [
      11,
    ],
  }),
  makeTalent(14, "Storm Bolt", 68.0, "class", {
    row: 2,
    col: 1,
    prereqs: [
      12,
      13,
    ],
  }),
]

const heroTalents: MetaTalent[] = [
  makeTalent(21, "Slayer's Strike", 95.0, "hero", {
    row: 0,
    col: 1,
  }),
  makeTalent(22, "Reap the Storm", 88.0, "hero", {
    row: 1,
    col: 0,
    prereqs: [
      21,
    ],
  }),
  makeTalent(23, "Imminent Demise", 82.0, "hero", {
    row: 1,
    col: 2,
    prereqs: [
      21,
    ],
  }),
]

const pvpTalents: MetaTalent[] = [
  makeTalent(31, "Sharpen Blade", 92.0, "pvp"),
  makeTalent(32, "War Banner", 78.0, "pvp"),
  makeTalent(33, "Disarm", 65.0, "pvp"),
]

const allTalents = [
  ...specTalents,
  ...classTalents,
  ...heroTalents,
  ...pvpTalents,
]

const meta = {
  title: "Organisms/Talents",
  component: Talents,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Main talents container organizing all talent types (spec, class, hero, pvp) into trees or flat lists. Hero talents are centered, class+spec are side-by-side, PvP is a flat list.",
      },
    },
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <HoverProvider>
        <div
          style={{
            maxWidth: 900,
          }}
        >
          <Story />
        </div>
      </HoverProvider>
    ),
  ],
} satisfies Meta<typeof Talents>

export default meta
type Story = StoryObj<typeof meta>

export const AllTypes: Story = {
  args: {
    classSlug: "warrior",
    talents: allTalents,
  },
  parameters: {
    docs: {
      description: {
        story: "All four talent types rendered together.",
      },
    },
  },
}

export const SpecOnly: Story = {
  args: {
    classSlug: "mage",
    talents: specTalents,
  },
  parameters: {
    docs: {
      description: {
        story: "Only spec talents — no class, hero, or PvP sections shown.",
      },
    },
  },
}

export const PvPOnly: Story = {
  args: {
    classSlug: "rogue",
    talents: pvpTalents,
  },
  parameters: {
    docs: {
      description: {
        story: "PvP talents render as a flat list (no tree data).",
      },
    },
  },
}

export const Empty: Story = {
  args: {
    classSlug: "warrior",
    talents: [],
  },
  parameters: {
    docs: {
      description: {
        story: "No talent data — renders nothing.",
      },
    },
  },
}
