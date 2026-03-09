import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaTalent } from "../../lib/api"
import { HeroTree } from "../../components/molecules/hero-tree"

function makeTalent(
  id: number,
  name: string,
  usagePct: number,
  opts: { row?: number | null, col?: number | null, prereqs?: number[] } = {},
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
      node_id: id,
      display_row: opts.row ?? 0,
      display_col: opts.col ?? 0,
      max_rank: 1,
      default_points: 0,
      icon_url: "https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg",
      prerequisite_node_ids: opts.prereqs ?? [],
    },
    usage_count: Math.round(usagePct * 10),
    usage_pct: usagePct,
    in_top_build: usagePct > 50,
    top_build_rank: 1,
    tier: (usagePct > 50 ? "bis" : usagePct > 15 ? "situational" : "common") as "bis" | "situational" | "common",
    snapshot_at: "2026-03-03T00:00:00Z",
  }
}

const treeTalents: MetaTalent[] = [
  makeTalent(1, "Slayer's Strike", 95.0, { row: 0, col: 1 }),
  makeTalent(2, "Reap the Storm", 88.0, { row: 1, col: 0, prereqs: [1] }),
  makeTalent(3, "Imminent Demise", 82.0, { row: 1, col: 2, prereqs: [1] }),
  makeTalent(4, "Culling Cyclone", 91.0, { row: 2, col: 1, prereqs: [2, 3] }),
]

const flatTalents: MetaTalent[] = [
  makeTalent(1, "Slayer's Strike", 95.0, { row: null, col: null }),
  makeTalent(2, "Reap the Storm", 88.0, { row: null, col: null }),
]

const meta = {
  title: "Molecules/HeroTree",
  component: HeroTree,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders a single hero talent tree. Falls back to TalentList when tree data (row/col) is missing.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof HeroTree>

export default meta
type Story = StoryObj<typeof meta>

export const TreeLayout: Story = {
  args: {
    talents: treeTalents,
    activeColor: "#c79c6e",
  },
}

export const FlatFallback: Story = {
  args: {
    talents: flatTalents,
    activeColor: "#69ccf0",
  },
  parameters: {
    docs: {
      description: { story: "Falls back to TalentList when display_row/col are null." },
    },
  },
}
