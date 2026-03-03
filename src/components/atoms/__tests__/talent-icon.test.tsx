import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { TalentIcon } from "../talent-icon"
import type { MetaTalent } from "@/lib/api"

const mockTalent: MetaTalent = {
  talent: {
    blizzard_id: 12345,
    name: "Test Talent",
    icon_url: "https://example.com/icon.jpg",
  },
  usage_pct: 0.5,
}

describe("TalentIcon", () => {
  it("renders talent icon element with correct id", () => {
    const { container } = render(
      <TalentIcon talent={mockTalent} size={48} activeColor="#ff0000" />
    )

    const iconElement = container.querySelector("#talent-12345")
    expect(iconElement).toBeInTheDocument()
  })

  it("applies correct size dimensions", () => {
    const { container } = render(
      <TalentIcon talent={mockTalent} size={64} activeColor="#ff0000" />
    )

    const iconElement = container.querySelector("div[style*='width']")
    expect(iconElement).toHaveStyle("width: 64px")
    expect(iconElement).toHaveStyle("height: 64px")
  })

  it("applies activeColor when borderClass is not provided", () => {
    const { container } = render(
      <TalentIcon talent={mockTalent} size={48} activeColor="#00ff00" />
    )

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
      />
    )

    const borderDiv = container.querySelector(".border-purple-500")
    expect(borderDiv).toBeInTheDocument()
  })

  it("applies partial rank diagonal clip when partialRank is true", () => {
    const { container } = render(
      <TalentIcon
        talent={mockTalent}
        size={48}
        activeColor="#ff0000"
        partialRank={true}
      />
    )

    const iconElement = container.querySelector("#talent-12345")
    expect(iconElement).toBeInTheDocument()
    // Verify the clip path is applied
    const borderElement = iconElement?.querySelector("div:last-child")
    const style = borderElement?.getAttribute("style") || ""
    expect(style).toContain("polygon(100% 0, 100% 100%, 0 100%)")
  })

  it("handles different sizes correctly", () => {
    const sizes = [32, 44, 48, 64]

    sizes.forEach((size) => {
      const { container, unmount } = render(
        <TalentIcon talent={mockTalent} size={size} activeColor="#ff0000" />
      )

      const iconElement = container.querySelector("div[style*='width']")
      expect(iconElement).toHaveStyle(`width: ${size}px`)
      expect(iconElement).toHaveStyle(`height: ${size}px`)
      unmount()
    })
  })
})
