import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { SpecHeading } from "../spec-heading"
import type { WowClassSlug } from "@/config/wow/classes"

import { vi } from "vitest"

vi.mock("next/navigation", () => ({
  usePathname: () => "/paladin/retribution/pvp/2v2",
}))

describe("SpecHeading", () => {
  it("renders className and specSlug", () => {
    const { container } = render(
      <SpecHeading
        className="Paladin"
        classSlug="paladin"
        specSlug="retribution"
      />
    )

    expect(container.textContent).toContain("Paladin")
    expect(container.textContent).toContain("retribution")
  })

  it("applies correct color CSS variable based on classSlug", () => {
    const { container } = render(
      <SpecHeading
        className="Warrior"
        classSlug="warrior"
        specSlug="arms"
      />
    )

    const heading = container.querySelector("h1")
    expect(heading).toHaveStyle("color: var(--color-class-warrior)")
  })

  it("renders with PvP text", () => {
    const { container } = render(
      <SpecHeading
        className="Mage"
        classSlug="mage"
        specSlug="fire"
      />
    )

    expect(container.textContent).toContain("PvP")
  })

  it("handles different class colors", () => {
    const slugs: WowClassSlug[] = ["warrior", "mage", "druid"]

    slugs.forEach((slug) => {
      const { container, unmount } = render(
        <SpecHeading
          className="Class"
          classSlug={slug}
          specSlug="spec"
        />
      )

      const heading = container.querySelector("h1")
      expect(heading).toHaveStyle(`color: var(--color-class-${slug})`)
      unmount()
    })
  })
})
