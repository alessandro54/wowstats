import { render } from "@testing-library/react"
import { usePathname } from "next/navigation"

import { describe, expect, it, vi } from "vitest"
import { useHoverSlug } from "@/components/providers/hover-provider"
import DynamicBackground from "../dynamic-background"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/warrior/arms/pvp/3v3"),
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useHoverSlug: vi.fn(() => null),
}))

describe("dynamicBackground", () => {
  it("renders the top blob with class color from pathname", () => {
    const { container } = render(<DynamicBackground />)
    const blob = container.firstElementChild as HTMLElement
    expect(blob).toBeDefined()
    expect(blob.style.background).toBe("var(--color-class-warrior)")
  })

  it("uses fallback color when pathname has no class slug", () => {
    vi.mocked(usePathname).mockReturnValue("/")
    const { container } = render(<DynamicBackground />)
    const blob = container.firstElementChild as HTMLElement
    expect(blob.style.background).toBe("oklch(0.7 0.15 340)")
  })

  it("prefers hoverSlug over pathname slug", () => {
    vi.mocked(usePathname).mockReturnValue("/warrior/arms/pvp/3v3")
    vi.mocked(useHoverSlug).mockReturnValue("mage")
    const { container } = render(<DynamicBackground />)
    const blob = container.firstElementChild as HTMLElement
    expect(blob.style.background).toBe("var(--color-class-mage)")
  })

  it("renders spec gradient on spec pages", () => {
    vi.mocked(usePathname).mockReturnValue("/warrior/arms/pvp/3v3")
    vi.mocked(useHoverSlug).mockReturnValue(null)
    const { container } = render(<DynamicBackground />)
    const children = container.querySelectorAll("div")
    // Should have blob + spec gradient = 2 divs
    expect(children.length).toBe(2)
    expect(children[1].className).toContain("spec-warrior-arms")
  })

  it("does not render spec gradient on non-spec pages", () => {
    vi.mocked(usePathname).mockReturnValue("/warrior")
    vi.mocked(useHoverSlug).mockReturnValue(null)
    const { container } = render(<DynamicBackground />)
    const children = container.querySelectorAll("div")
    expect(children.length).toBe(1)
  })
})
