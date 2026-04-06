import { render } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import { useHoverSlug } from "@/components/providers/hover-provider"
import DynamicBackground from "../dynamic-background"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/pvp/warrior/arms/3v3"),
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useHoverSlug: vi.fn(() => null),
}))

describe("dynamicBackground", () => {
  it("renders the top blob with class color from pathname", () => {
    // Use a non-spec pvp route (e.g. /pvp/warrior) so the component doesn't return null
    vi.mocked(usePathname).mockReturnValue("/pvp/warrior")
    const { container } = render(<DynamicBackground />)
    const blob = container.querySelector("div")!
    expect(blob).toBeDefined()
    expect(blob.style.background).toBe("var(--color-class-warrior)")
  })

  it("returns null on home page", () => {
    vi.mocked(usePathname).mockReturnValue("/")
    const { container } = render(<DynamicBackground />)
    expect(container.innerHTML).toBe("")
  })

  it("returns null on spec pages (they handle their own atmosphere)", () => {
    vi.mocked(usePathname).mockReturnValue("/pvp/warrior/arms/3v3")
    const { container } = render(<DynamicBackground />)
    expect(container.innerHTML).toBe("")
  })

  it("prefers hoverSlug over pathname slug", () => {
    vi.mocked(usePathname).mockReturnValue("/pvp/warrior")
    vi.mocked(useHoverSlug).mockReturnValue("mage")
    const { container } = render(<DynamicBackground />)
    const blob = container.querySelector("div")!
    expect(blob.style.background).toBe("var(--color-class-mage)")
  })

  it("uses fallback color on non-class routes", () => {
    vi.mocked(useHoverSlug).mockReturnValue(null)
    vi.mocked(usePathname).mockReturnValue("/pvp")
    const { container } = render(<DynamicBackground />)
    const blob = container.querySelector("div")!
    expect(blob.style.background).toBe("oklch(0.7 0.15 340)")
  })
})
