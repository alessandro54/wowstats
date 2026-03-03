import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PageHeader } from "../page-header"

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Menu
    </button>
  ),
}))

vi.mock("@/components/ui/separator", () => ({
  Separator: ({ orientation, className }: { orientation?: string, className?: string }) => (
    <div data-testid="separator" data-orientation={orientation} className={className} />
  ),
}))

vi.mock("@/components/atoms/theme-switcher", () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme</div>,
}))

describe("pageHeader", () => {
  it("renders header with sidebar trigger", () => {
    const { container, getByTestId } = render(<PageHeader />)

    const header = container.querySelector("header")
    expect(header).toBeTruthy()
    expect(header?.className).toContain("sticky")

    const trigger = getByTestId("sidebar-trigger")
    expect(trigger).toBeTruthy()
  })

  it("renders theme switcher on desktop", () => {
    const { getByTestId } = render(<PageHeader />)

    const themeSwitcher = getByTestId("theme-switcher")
    expect(themeSwitcher).toBeTruthy()
  })

  it("renders children content in left slot", () => {
    const { container } = render(
      <PageHeader>
        <span>Left Content</span>
      </PageHeader>,
    )

    expect(container.textContent).toContain("Left Content")
  })

  it("renders centerSlot content in center", () => {
    const { container } = render(<PageHeader centerSlot={<span>Center Content</span>} />)

    expect(container.textContent).toContain("Center Content")
  })

  it("renders both children and centerSlot when both provided", () => {
    const { container } = render(
      <PageHeader centerSlot={<span>Center</span>}>
        <span>Left</span>
      </PageHeader>,
    )

    expect(container.textContent).toContain("Left")
    expect(container.textContent).toContain("Center")
  })

  it("has correct styling classes", () => {
    const { container } = render(<PageHeader />)

    const header = container.querySelector("header")
    expect(header?.className).toContain("bg-background")
    expect(header?.className).toContain("backdrop-blur")
    expect(header?.className).toContain("sticky")
    expect(header?.className).toContain("top-0")
    expect(header?.className).toContain("z-20")
    expect(header?.className).toContain("flex")
    expect(header?.className).toContain("border-b")
  })

  it("renders separator between trigger and content", () => {
    const { getByTestId } = render(<PageHeader />)

    const separator = getByTestId("separator")
    expect(separator).toBeTruthy()
    expect(separator.getAttribute("data-orientation")).toBe("vertical")
  })

  it("has proper flex layout", () => {
    const { container } = render(<PageHeader />)

    const header = container.querySelector("header")
    expect(header?.className).toContain("flex")
    expect(header?.className).toContain("items-center")
    expect(header?.className).toContain("gap-2")
  })
})
