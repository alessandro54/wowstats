import type { MetaTalent } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { HeroTree } from "../hero-tree"

vi.mock("@/components/molecules/talent-list", () => ({
  TalentList: ({ talents }: any) => <div data-testid="talent-list">{talents.length} items</div>,
}))

vi.mock("@/components/organisms/talent-tree", () => ({
  TalentTree: ({ talents }: any) => <div data-testid="talent-tree">{talents.length} nodes</div>,
  hasTreeData: (talents: MetaTalent[]) =>
    talents.some((t) => t.talent.display_row != null && t.talent.display_col != null),
}))

function makeTalent(
  id: number,
  pct: number,
  opts: {
    row?: number | null
    col?: number | null
  } = {},
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 5000,
      name: `Talent ${id}`,
      description: null,
      talent_type: "hero",
      spell_id: null,
      node_id: id,
      display_row: "row" in opts ? opts.row : 0,
      display_col: "col" in opts ? opts.col : 0,
      max_rank: 1,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: pct > 50,
    top_build_rank: 1,
    tier: (pct > 50 ? "bis" : pct > 15 ? "situational" : "common") as const,
    snapshot_at: null,
  }
}

describe("heroTree", () => {
  it("renders TalentTree when tree data is available", () => {
    const talents = [
      makeTalent(1, 90, {
        row: 0,
        col: 0,
      }),
      makeTalent(2, 80, {
        row: 1,
        col: 0,
      }),
    ]
    const { getByTestId } = render(<HeroTree talents={talents} activeColor="#c79c6e" />)
    expect(getByTestId("talent-tree").textContent).toContain("2 nodes")
  })

  it("falls back to TalentList when no tree data", () => {
    const talents = [
      makeTalent(1, 90, {
        row: null,
        col: null,
      }),
      makeTalent(2, 80, {
        row: null,
        col: null,
      }),
    ]
    const { getByTestId } = render(<HeroTree talents={talents} activeColor="#c79c6e" />)
    expect(getByTestId("talent-list").textContent).toContain("2 items")
  })
})
