import type { MetaTalent } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TalentList } from "../talent-list"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <span>{children}</span>,
}))

function makeTalent(
  id: number,
  name: string,
  pct: number,
  iconUrl: string | null = null,
): MetaTalent {
  return {
    id,
    talent: {
      id,
      blizzard_id: id + 5000,
      name,
      description: null,
      talent_type: "spec",
      spell_id: null,
      node_id: id,
      display_row: null,
      display_col: null,
      max_rank: 1,
      default_points: 0,
      icon_url: iconUrl,
      prerequisite_node_ids: [],
    },
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    in_top_build: true,
    top_build_rank: 1,
    tier: "bis",
    snapshot_at: null,
  }
}

const talents = [
  makeTalent(1, "Mortal Strike", 85.3, "https://example.com/icon.jpg"),
  makeTalent(2, "Overpower", 70.1),
  makeTalent(3, "Execute", 55.0),
]

describe("talentList", () => {
  it("renders talent names", () => {
    const { container } = render(<TalentList talents={talents} activeColor="#c79c6e" />)
    expect(container.textContent).toContain("Mortal Strike")
    expect(container.textContent).toContain("Overpower")
    expect(container.textContent).toContain("Execute")
  })

  it("shows usage percentages", () => {
    const { container } = render(<TalentList talents={talents} activeColor="#c79c6e" />)
    expect(container.textContent).toContain("85.3%")
    expect(container.textContent).toContain("70.1%")
  })

  it("renders icons when present", () => {
    const { container } = render(<TalentList talents={talents} activeColor="#c79c6e" />)
    expect(container.querySelector("img")).toBeInTheDocument()
  })

  it("handles empty talent list", () => {
    const { container } = render(<TalentList talents={[]} activeColor="#c79c6e" />)
    expect(container.querySelector("div")).toBeInTheDocument()
  })
})
