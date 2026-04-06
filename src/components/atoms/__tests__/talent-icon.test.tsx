import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaTalent } from "@/lib/api"
import { TalentIcon } from "../talent-icon"

vi.mock("@/components/atoms/clickable-tooltip", () => ({
  ClickableTooltip: ({
    children,
    content,
  }: {
    children: React.ReactNode
    content: React.ReactNode
  }) => (
    <div data-testid="clickable-tooltip">
      {children}
      {content}
    </div>
  ),
}))

const mockTalent: MetaTalent = {
  id: null,
  talent: {
    id: 1,
    blizzard_id: 12345,
    name: "Test Talent",
    description: null,
    talent_type: "active",
    spell_id: null,
    node_id: null,
    display_row: null,
    display_col: null,
    max_rank: 1,
    default_points: 0,
    icon_url: "https://example.com/icon.jpg",
    prerequisite_node_ids: [],
  },
  usage_count: 10,
  usage_pct: 0.5,
  in_top_build: false,
  top_build_rank: 0,
  tier: "common" as const,
  snapshot_at: null,
}

describe("talentIcon", () => {
  it("renders talent icon element with correct id", () => {
    const { container } = render(<TalentIcon talent={mockTalent} size={48} activeColor="#ff0000" />)

    const iconElement = container.querySelector("#talent-12345")
    expect(iconElement).toBeInTheDocument()
  })

  it("applies correct size dimensions", () => {
    const { container } = render(<TalentIcon talent={mockTalent} size={64} activeColor="#ff0000" />)

    const iconElement = container.querySelector("div[style*='width']")
    expect(iconElement).toHaveStyle("width: 64px")
    expect(iconElement).toHaveStyle("height: 64px")
  })

  it("applies activeColor when borderClass is not provided", () => {
    const { container } = render(<TalentIcon talent={mockTalent} size={48} activeColor="#00ff00" />)

    const iconElement = container.querySelector("#talent-12345")
    expect(iconElement).toBeInTheDocument()
    // The border color is applied via inline style to a child element
    const borderElement = iconElement?.querySelector("div:last-child")
    expect(borderElement).toHaveStyle("borderColor: #00ff00")
  })

  it("applies borderClass when provided", () => {
    const { container } = render(
      <TalentIcon
        talent={mockTalent}
        size={48}
        activeColor="#ff0000"
        borderClass="border-purple-500"
      />,
    )

    const borderDiv = container.querySelector(".border-purple-500")
    expect(borderDiv).toBeInTheDocument()
  })

  it("applies partial rank diagonal clip when partialRank is true", () => {
    const { container } = render(
      <TalentIcon talent={mockTalent} size={48} activeColor="#ff0000" partialRank={true} />,
    )

    const iconElement = container.querySelector("#talent-12345")
    expect(iconElement).toBeInTheDocument()
    // Verify the clip path is applied
    const borderElement = iconElement?.querySelector("div:last-child")
    const style = borderElement?.getAttribute("style") || ""
    expect(style).toContain("polygon(100% 0, 100% 100%, 0 100%)")
  })

  it("renders grey placeholder when icon_url is null", () => {
    const nullIconTalent: MetaTalent = {
      ...mockTalent,
      talent: {
        ...mockTalent.talent,
        icon_url: null as unknown as string,
      },
    }
    const { container } = render(
      <TalentIcon talent={nullIconTalent} size={48} activeColor="#ff0000" />,
    )
    // No img element rendered when icon_url is null
    expect(container.querySelector("img")).not.toBeInTheDocument()
    // The placeholder div with rounded class is present
    const placeholder = container.querySelector(".w-full.h-full.rounded")
    expect(placeholder).toBeInTheDocument()
  })

  it("wraps in ClickableTooltip when tooltipContent is provided", () => {
    const { getByTestId } = render(
      <TalentIcon
        talent={mockTalent}
        size={48}
        activeColor="#ff0000"
        tooltipContent={<span>tooltip text</span>}
      />,
    )
    expect(getByTestId("clickable-tooltip")).toBeInTheDocument()
  })

  it("handles different sizes correctly", () => {
    const sizes = [
      32,
      44,
      48,
      64,
    ]

    sizes.forEach((size) => {
      const { container, unmount } = render(
        <TalentIcon talent={mockTalent} size={size} activeColor="#ff0000" />,
      )

      const iconElement = container.querySelector("div[style*='width']")
      expect(iconElement).toHaveStyle(`width: ${size}px`)
      expect(iconElement).toHaveStyle(`height: ${size}px`)
      unmount()
    })
  })
})
