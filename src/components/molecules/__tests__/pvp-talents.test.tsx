import type { MetaTalent } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PvpTalents } from "../pvp-talents"

vi.mock("@/components/atoms/talent-icon", () => ({
  TalentIcon: ({ talent }: any) => (
    <div data-testid={`talent-icon-${talent.talent.id}`}>{talent.talent.name}</div>
  ),
}))

vi.mock("@/components/atoms/talent-card", () => ({
  TalentCard: ({ children }: any) => <div data-testid="talent-card">{children}</div>,
}))

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

function makeTalent(id: number, name: string, pct: number): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 5000,
      name,
      description: `${name} description`,
      talent_type: "pvp",
      spell_id: null,
      node_id: id,
      display_row: null,
      display_col: null,
      max_rank: 1,
      default_points: 0,
      icon_url: null,
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: pct > 50,
    top_build_rank: 1,
    snapshot_at: null,
  }
}

const talents = [
  makeTalent(1, "Gladiator's Resolve", 85),
  makeTalent(2, "Battle Trance", 70),
  makeTalent(3, "War Banner", 55),
  makeTalent(4, "Disarm", 30),    // situational (>20%)
  makeTalent(5, "Spell Reflect", 25), // situational (>20%)
  makeTalent(6, "Storm of Swords", 10), // rest (<=20%)
]

describe("pvpTalents", () => {
  it("renders the PvP Talents heading", () => {
    const { container } = render(
      <PvpTalents talents={talents} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(container.textContent).toContain("PvP Talents")
  })

  it("renders top 3 talents by usage", () => {
    const { getByTestId } = render(
      <PvpTalents talents={talents} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(getByTestId("talent-icon-1")).toBeInTheDocument()
    expect(getByTestId("talent-icon-2")).toBeInTheDocument()
    expect(getByTestId("talent-icon-3")).toBeInTheDocument()
  })

  it("renders situational talents in the dropdown", () => {
    const { getByTestId, container } = render(
      <PvpTalents talents={talents} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(getByTestId("talent-icon-4")).toBeInTheDocument()
    expect(getByTestId("talent-icon-5")).toBeInTheDocument()
    expect(container.textContent).toContain("situational")
  })

  it("renders rest talents in the dropdown", () => {
    const { getByTestId } = render(
      <PvpTalents talents={talents} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(getByTestId("talent-icon-6")).toBeInTheDocument()
  })

  it("shows usage percentages", () => {
    const { container } = render(
      <PvpTalents talents={talents} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(container.textContent).toContain("85%")
    expect(container.textContent).toContain("70%")
    expect(container.textContent).toContain("55%")
  })

  it("renders without dropdown when only 3 talents", () => {
    const top3Only = talents.slice(0, 3)
    const { container } = render(
      <PvpTalents talents={top3Only} activeColor="#c79c6e" classSlug="warrior" />,
    )
    expect(container.textContent).not.toContain("situational")
  })
})
