import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TopNavProvider } from "@/components/providers/top-nav-provider"
import { TopNavConfig } from "../top-nav-config"
import { TopNav } from "../top-nav"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/pvp/warrior/arms/3v3"),
}))

vi.mock("@/hooks/use-active-color", () => ({
  useActiveColor: vi.fn(() => "#C69B6D"),
}))

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Menu
    </button>
  ),
}))

vi.mock("@/components/ui/separator", () => ({
  Separator: ({ orientation, className }: { orientation?: string; className?: string }) => (
    <div data-testid="separator" data-orientation={orientation} className={className} />
  ),
}))

vi.mock("@/components/atoms/theme-switcher", () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme</div>,
}))

function renderNav(config?: React.ReactNode) {
  return render(
    <TopNavProvider>
      {config}
      <TopNav />
    </TopNavProvider>,
  )
}

describe("topNav", () => {
  it("renders header with sidebar trigger by default", () => {
    const { container, getByTestId } = renderNav()
    expect(container.querySelector("header")).toBeTruthy()
    expect(getByTestId("sidebar-trigger")).toBeTruthy()
  })

  it("always renders sidebar trigger", () => {
    const { getByTestId } = renderNav()
    expect(getByTestId("sidebar-trigger")).toBeTruthy()
  })

  it("renders separator between trigger and content", () => {
    const { getByTestId } = renderNav()
    const sep = getByTestId("separator")
    expect(sep.getAttribute("data-orientation")).toBe("vertical")
  })

  it("renders left slot content from context", () => {
    const { container } = renderNav(<TopNavConfig left={<span>Left Content</span>} />)
    expect(container.textContent).toContain("Left Content")
  })

  it("renders center slot content from context", () => {
    const { container } = renderNav(<TopNavConfig center={<span>Center Content</span>} />)
    expect(container.textContent).toContain("Center Content")
  })

  it("renders both left and center from context", () => {
    const { container } = renderNav(
      <TopNavConfig left={<span>Left</span>} center={<span>Center</span>} />,
    )
    expect(container.textContent).toContain("Left")
    expect(container.textContent).toContain("Center")
  })

  it("hides the header when hidden is set in context", () => {
    const { container } = renderNav(<TopNavConfig hidden />)
    expect(container.querySelector("header")).toBeNull()
  })

  it("has sticky positioning and correct layout classes", () => {
    const { container } = renderNav()
    const header = container.querySelector("header")
    expect(header?.className).toContain("sticky")
    expect(header?.className).toContain("top-0")
    expect(header?.className).toContain("z-20")
    expect(header?.className).toContain("flex")
    expect(header?.className).toContain("items-center")
    expect(header?.className).toContain("border-b")
    expect(header?.className).toContain("backdrop-blur")
  })
})
