import { act, fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useSidebar } from "@/components/ui/sidebar"
import { NavMain } from "../nav-main"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  })),
}))

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useSetHoverSlug: vi.fn(() => vi.fn()),
  useHoverSlug: vi.fn(() => null),
}))

vi.mock("@/hooks/use-active-color", () => ({
  useActiveColor: vi.fn(() => "var(--color-primary)"),
}))

vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: ({ children }: any) => <div data-testid="sidebar-group">{children}</div>,
  SidebarGroupLabel: ({ children }: any) => <div data-testid="sidebar-group-label">{children}</div>,
  SidebarMenu: ({ children, ...props }: any) => (
    <div data-testid="sidebar-menu" {...props}>
      {children}
    </div>
  ),
  SidebarMenuItem: ({ children }: any) => <div data-testid="sidebar-menu-item">{children}</div>,
  SidebarMenuButton: ({ children, tooltip: _tooltip, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  SidebarMenuSub: ({ children }: any) => <div data-testid="sidebar-menu-sub">{children}</div>,
  SidebarMenuSubItem: ({ children, ...props }: any) => (
    <div data-testid="sidebar-menu-sub-item" {...props}>
      {children}
    </div>
  ),
  SidebarMenuSubButton: ({ children, asChild: _asChild }: any) => <div>{children}</div>,
  useSidebar: vi.fn(() => ({
    open: true,
    isMobile: false,
  })),
}))

vi.mock("@/components/ui/collapsible", () => ({
  Collapsible: ({ children, open, onMouseEnter, ...props }: any) => (
    <div data-testid="collapsible" data-open={open} onMouseEnter={onMouseEnter} {...props}>
      {children}
    </div>
  ),
  CollapsibleTrigger: ({ children, asChild: _asChild }: any) => (
    <div data-testid="collapsible-trigger">{children}</div>
  ),
  CollapsibleContent: ({ children }: any) => (
    <div data-testid="collapsible-content">{children}</div>
  ),
}))

vi.mock("@/components/molecules/nav-class-hover-card", () => ({
  NavClassHoverCard: ({ item }: any) => <div data-testid="hover-card">{item.title}</div>,
}))

describe("navMain", () => {
  it("renders the Guides label", () => {
    const { getAllByTestId } = render(<NavMain />)
    const labels = getAllByTestId("sidebar-group-label").map((el) => el.textContent)
    expect(labels).toContain("Class Guides")
    expect(labels).toContain("PvP Meta Guides")
  })

  it("renders all WoW classes as collapsible items", () => {
    const { getAllByTestId } = render(<NavMain />)
    const items = getAllByTestId("collapsible")
    // 13 WoW classes
    expect(items.length).toBe(13)
  })

  it("shows class icons and names", () => {
    const { container } = render(<NavMain />)
    const images = container.querySelectorAll("img")
    expect(images.length).toBeGreaterThan(0)
    expect(container.textContent).toContain("Warrior")
    expect(container.textContent).toContain("Mage")
  })

  it("expands a class on mouse enter after delay", () => {
    vi.useFakeTimers()
    const { getAllByTestId } = render(<NavMain />)
    const collapsibles = getAllByTestId("collapsible")

    fireEvent.mouseEnter(collapsibles[0])
    act(() => {
      vi.advanceTimersByTime(80)
    })

    // After timer fires, one should be open
    const openItem = getAllByTestId("collapsible").find((el) => el.dataset.open === "true")
    expect(openItem).toBeDefined()

    vi.useRealTimers()
  })

  it("closes on mouse leave from the menu", () => {
    vi.useFakeTimers()
    const { getAllByTestId, getByTestId } = render(<NavMain />)

    // Open one
    fireEvent.mouseEnter(getAllByTestId("collapsible")[0])
    act(() => {
      vi.advanceTimersByTime(80)
    })

    // Leave the class guides menu (last sidebar-menu — first is PvP Meta)
    const menus = getAllByTestId("sidebar-menu")
    fireEvent.mouseLeave(menus[menus.length - 1])

    const openItem = getAllByTestId("collapsible").find((el) => el.dataset.open === "true")
    expect(openItem).toBeUndefined()

    vi.useRealTimers()
  })

  it("renders spec sub-items with bracket links", () => {
    vi.useFakeTimers()
    const { getAllByTestId, container } = render(<NavMain />)

    fireEvent.mouseEnter(getAllByTestId("collapsible")[0])
    act(() => {
      vi.advanceTimersByTime(80)
    })

    const links = container.querySelectorAll("a")
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"))

    // Should have spec links and bracket links (2v2, 3v3, shuffle)
    expect(hrefs.some((h) => h?.includes("/pvp/") && h?.includes("/2v2"))).toBe(true)
    expect(hrefs.some((h) => h?.includes("/pvp/") && h?.includes("/3v3"))).toBe(true)
    expect(hrefs.some((h) => h?.includes("/pvp/") && h?.includes("/shuffle"))).toBe(true)

    vi.useRealTimers()
  })

  it("shows NavClassHoverCard when sidebar is collapsed and pointer is mouse", () => {
    vi.mocked(useSidebar).mockReturnValue({
      open: false,
      isMobile: false,
    } as any)
    const { getAllByTestId, container } = render(<NavMain />)
    fireEvent.pointerMove(container, {
      pointerType: "mouse",
    })
    const hoverCards = getAllByTestId("hover-card")
    expect(hoverCards.length).toBeGreaterThan(0)
  })

  it("prefetches items on first hover of a class", () => {
    vi.useFakeTimers()
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response())

    const { getAllByTestId } = render(<NavMain />)
    fireEvent.mouseEnter(getAllByTestId("collapsible")[0])
    act(() => {
      vi.advanceTimersByTime(80)
    })

    expect(fetchSpy).toHaveBeenCalled()
    const url = fetchSpy.mock.calls[0][0] as string
    expect(url).toContain("/api/prefetch/items")

    fetchSpy.mockRestore()
    vi.useRealTimers()
  })

  it("does not prefetch again on second hover of same class", () => {
    vi.useFakeTimers()
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response())

    const { getAllByTestId } = render(<NavMain />)
    const first = getAllByTestId("collapsible")[0]

    // First hover
    fireEvent.mouseEnter(first)
    act(() => {
      vi.advanceTimersByTime(80)
    })
    const callCount = fetchSpy.mock.calls.length

    // Leave and re-hover (target class guides menu — last sidebar-menu)
    const menus = getAllByTestId("sidebar-menu")
    fireEvent.mouseLeave(menus[menus.length - 1])
    fireEvent.mouseEnter(first)
    act(() => {
      vi.advanceTimersByTime(80)
    })

    expect(fetchSpy.mock.calls.length).toBe(callCount)

    fetchSpy.mockRestore()
    vi.useRealTimers()
  })
})
