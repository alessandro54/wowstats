import { render } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { SpecHeading } from "../spec-heading"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/paladin/retribution/pvp/2v2"),
}))

describe("specHeading", () => {
  it("renders className and specSlug", () => {
    const { container } = render(
      <SpecHeading className="Paladin" classSlug="paladin" specSlug="retribution" />,
    )

    expect(container.textContent).toContain("Paladin")
    expect(container.textContent).toContain("retribution")
  })

  it("applies correct color CSS variable based on classSlug", () => {
    const { container } = render(
      <SpecHeading className="Warrior" classSlug="warrior" specSlug="arms" />,
    )

    const heading = container.querySelector("h1")
    expect(heading).toHaveStyle("color: var(--color-class-warrior)")
  })

  it("renders with PvP text", () => {
    const { container } = render(<SpecHeading className="Mage" classSlug="mage" specSlug="fire" />)

    expect(container.textContent).toContain("PvP")
  })

  it("renders 'Solo Shuffle' text when bracket is shuffle", () => {
    vi.mocked(usePathname).mockReturnValue("/warrior/arms/pvp/shuffle")
    const { container } = render(
      <SpecHeading className="Warrior" classSlug="warrior" specSlug="arms" />,
    )
    expect(container.textContent).toContain("Solo Shuffle")
  })

  it("handles different class colors", () => {
    const slugs: WowClassSlug[] = [
      "warrior",
      "mage",
      "druid",
    ]

    slugs.forEach((slug) => {
      const { container, unmount } = render(
        <SpecHeading className="Class" classSlug={slug} specSlug="spec" />,
      )

      const heading = container.querySelector("h1")
      expect(heading).toHaveStyle(`color: var(--color-class-${slug})`)
      unmount()
    })
  })

  it("falls back to empty string bracket when pathname has fewer than 5 segments", () => {
    vi.mocked(usePathname).mockReturnValueOnce("/warrior/arms")
    const { container } = render(
      <SpecHeading className="Warrior" classSlug="warrior" specSlug="arms" />,
    )
    // bracket = '' so isSoloShuffle returns false, shows '' · PvP
    expect(container.textContent).toContain("PvP")
  })
})
