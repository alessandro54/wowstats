import type { MetaTalent } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PvpTalentTooltip } from "../pvp-talent-tooltip"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

function makeTalent(
  overrides: Partial<{
    name: string
    description: string | null
    icon_url: string | null
    pct: number
  }> = {},
): MetaTalent {
  return {
    id: 1,
    talent: {
      id: 1,
      blizzard_id: 5001,
      name: overrides.name ?? "War Banner",
      description: overrides.description !== undefined ? overrides.description : "Places a banner",
      talent_type: "pvp",
      spell_id: null,
      node_id: 1,
      display_row: null,
      display_col: null,
      max_rank: 1,
      default_points: 0,
      icon_url:
        overrides.icon_url !== undefined ? overrides.icon_url : "https://example.com/icon.jpg",
      prerequisite_node_ids: [],
    },
    usage_count: 100,
    usage_pct: overrides.pct ?? 85.3,
    in_top_build: true,
    top_build_rank: 1,
    tier: "bis",
    snapshot_at: null,
  }
}

describe("pvpTalentTooltip", () => {
  it("renders talent name", () => {
    const { container } = render(<PvpTalentTooltip talent={makeTalent()} activeColor="#c79c6e" />)
    expect(container.textContent).toContain("War Banner")
  })

  it("renders talent description", () => {
    const { container } = render(<PvpTalentTooltip talent={makeTalent()} activeColor="#c79c6e" />)
    expect(container.textContent).toContain("Places a banner")
  })

  it("renders usage percentage", () => {
    const { container } = render(
      <PvpTalentTooltip
        talent={makeTalent({
          pct: 72.5,
        })}
        activeColor="#c79c6e"
      />,
    )
    expect(container.textContent).toContain("72.5%")
  })

  it("renders icon when present", () => {
    const { container } = render(<PvpTalentTooltip talent={makeTalent()} activeColor="#c79c6e" />)
    expect(container.querySelector("img")).toBeInTheDocument()
  })

  it("hides icon when null", () => {
    const { container } = render(
      <PvpTalentTooltip
        talent={makeTalent({
          icon_url: null,
        })}
        activeColor="#c79c6e"
      />,
    )
    expect(container.querySelector("img")).toBeNull()
  })

  it("hides description when null", () => {
    const { container } = render(
      <PvpTalentTooltip
        talent={makeTalent({
          description: null,
        })}
        activeColor="#c79c6e"
      />,
    )
    expect(container.textContent).not.toContain("Places a banner")
  })

  it("applies activeColor to percentage", () => {
    const { container } = render(<PvpTalentTooltip talent={makeTalent()} activeColor="#ff0000" />)
    const pctEl = container.querySelector("p[style]") as HTMLElement
    expect(pctEl?.style.color).toBe("rgb(255, 0, 0)")
  })
})
