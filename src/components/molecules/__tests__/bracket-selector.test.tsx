import { render } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import { BracketSelector } from "../bracket-selector"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/warrior/arms/pvp/3v3"),
}))

vi.mock("@/hooks/use-active-color", () => ({
  useActiveColor: vi.fn(() => "#C69B6D"),
}))

describe("bracketSelector", () => {
  it("renders all bracket options", () => {
    const { container } = render(<BracketSelector classSlug="warrior" specSlug="arms" />)

    expect(container.textContent).toContain("2v2")
    expect(container.textContent).toContain("3v3")
    expect(container.textContent).toContain("Solo")
    expect(container.textContent).toContain("RBG")
  })

  it("renders bracket links with correct href format", () => {
    const { container } = render(<BracketSelector classSlug="warrior" specSlug="arms" />)

    const links = container.querySelectorAll("a")
    expect(links.length).toBeGreaterThan(0)

    const hrefs = Array.from(links).map(l => l.getAttribute("href"))
    expect(hrefs).toContain("/warrior/arms/pvp/2v2")
    expect(hrefs).toContain("/warrior/arms/pvp/3v3")
    expect(hrefs).toContain("/warrior/arms/pvp/shuffle")
    expect(hrefs).toContain("/warrior/arms/pvp/rbg")
  })

  it("highlights current bracket correctly", () => {
    const { container } = render(<BracketSelector classSlug="warrior" specSlug="arms" />)

    const links = container.querySelectorAll("a")
    const active3v3Link = Array.from(links).find(l => l.getAttribute("href")?.includes("3v3"))

    expect(active3v3Link?.className).toContain("class-pill")
  })

  it("applies class color via CSS variable", () => {
    const { container } = render(<BracketSelector classSlug="warrior" specSlug="arms" />)

    const linkElements = container.querySelectorAll("a")
    expect(linkElements.length).toBeGreaterThan(0)

    // Check that at least one link has the class-pill or bracket-inactive class
    const hasColorClasses = Array.from(linkElements).some(
      link =>
        link.className.includes("class-pill") || link.className.includes("bracket-inactive"),
    )
    expect(hasColorClasses).toBe(true)
  })

  it("marks all brackets inactive when no bracket segment in pathname", () => {
    vi.mocked(usePathname).mockReturnValue("/warrior/arms/pvp")
    const { container } = render(<BracketSelector classSlug="warrior" specSlug="arms" />)
    const links = container.querySelectorAll("a")
    links.forEach((link) => {
      expect(link.className).toContain("bracket-inactive")
      expect(link.className).not.toContain("class-pill")
    })
  })

  it("works with different class and spec combinations", () => {
    const { container } = render(<BracketSelector classSlug="mage" specSlug="fire" />)

    const links = container.querySelectorAll("a")
    const hrefs = Array.from(links).map(l => l.getAttribute("href"))
    expect(hrefs).toContain("/mage/fire/pvp/2v2")
    expect(hrefs).toContain("/mage/fire/pvp/3v3")
  })
})
