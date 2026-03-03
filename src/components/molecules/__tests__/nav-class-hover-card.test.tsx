import type { NavMainItem } from "@/config/wow/nav-config"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { NavClassHoverCard } from "../nav-class-hover-card"

vi.mock("@/components/ui/hover-card", () => ({
  HoverCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hover-card">{children}</div>
  ),
  HoverCardTrigger: ({ children }: any) => <div data-testid="hover-card-trigger">{children}</div>,
  HoverCardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hover-card-content">{children}</div>
  ),
}))

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string, alt: string }) => (
    <img src={src} alt={alt} data-testid="class-icon" />
  ),
}))

vi.mock("@/components/ui/sidebar", () => ({
  SidebarMenuButton: ({ children, onMouseEnter }: any) => (
    <button data-testid="sidebar-menu-button" onMouseEnter={onMouseEnter}>
      {children}
    </button>
  ),
}))

describe("navClassHoverCard", () => {
  const mockItem: NavMainItem = {
    id: 1,
    title: "Warrior",
    url: "/warrior",
    slug: "warrior",
    color: "#C69B6D",
    iconUrl: "https://example.com/warrior.jpg",
    items: [
      { id: 71, title: "Arms", url: "/warrior/arms", iconUrl: "https://example.com/arms.jpg" },
      { id: 72, title: "Fury", url: "/warrior/fury", iconUrl: "https://example.com/fury.jpg" },
      {
        id: 73,
        title: "Protection",
        url: "/warrior/protection",
        iconUrl: "https://example.com/prot.jpg",
      },
    ],
  }

  const mockOnMouseEnter = vi.fn()

  it("renders hover card structure", () => {
    const { getByTestId } = render(
      <NavClassHoverCard item={mockItem} onMouseEnter={mockOnMouseEnter} />,
    )

    expect(getByTestId("hover-card")).toBeTruthy()
    expect(getByTestId("hover-card-trigger")).toBeTruthy()
    expect(getByTestId("hover-card-content")).toBeTruthy()
  })

  it("displays class title in trigger", () => {
    const { container } = render(
      <NavClassHoverCard item={mockItem} onMouseEnter={mockOnMouseEnter} />,
    )

    expect(container.textContent).toContain("Warrior")
  })

  it("displays class icon", () => {
    const { getAllByTestId } = render(
      <NavClassHoverCard item={mockItem} onMouseEnter={mockOnMouseEnter} />,
    )

    const icons = getAllByTestId("class-icon")
    expect(icons.length).toBeGreaterThan(0)
    expect(
      icons.some(icon => icon.getAttribute("src") === "https://example.com/warrior.jpg"),
    ).toBe(true)
  })

  it("displays all spec options in content", () => {
    const { container } = render(
      <NavClassHoverCard item={mockItem} onMouseEnter={mockOnMouseEnter} />,
    )

    expect(container.textContent).toContain("Arms")
    expect(container.textContent).toContain("Fury")
    expect(container.textContent).toContain("Protection")
  })

  it("renders spec links with correct URLs", () => {
    const { container } = render(
      <NavClassHoverCard item={mockItem} onMouseEnter={mockOnMouseEnter} />,
    )

    const links = container.querySelectorAll("a")
    const hrefs = Array.from(links).map(l => l.getAttribute("href"))

    expect(hrefs).toContain("/warrior/arms")
    expect(hrefs).toContain("/warrior/fury")
    expect(hrefs).toContain("/warrior/protection")
  })

  it("applies class color styling", () => {
    const { container } = render(
      <NavClassHoverCard item={mockItem} onMouseEnter={mockOnMouseEnter} />,
    )

    const styled = container.querySelector("[style*='--']")
    expect(styled).toBeTruthy()
  })

  it("handles different class types", () => {
    const mageItem: NavMainItem = {
      id: 8,
      title: "Mage",
      url: "/mage",
      slug: "mage",
      color: "#69CCF0",
      iconUrl: "https://example.com/mage.jpg",
      items: [
        { id: 62, title: "Arcane", url: "/mage/arcane", iconUrl: "https://example.com/arcane.jpg" },
        { id: 63, title: "Fire", url: "/mage/fire", iconUrl: "https://example.com/fire.jpg" },
        { id: 64, title: "Frost", url: "/mage/frost", iconUrl: "https://example.com/frost.jpg" },
      ],
    }

    const { container } = render(
      <NavClassHoverCard item={mageItem} onMouseEnter={mockOnMouseEnter} />,
    )

    expect(container.textContent).toContain("Mage")
    expect(container.textContent).toContain("Arcane")
    expect(container.textContent).toContain("Fire")
    expect(container.textContent).toContain("Frost")
  })
})
