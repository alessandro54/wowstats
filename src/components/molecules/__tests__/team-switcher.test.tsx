import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useSidebar } from "@/components/ui/sidebar"
import { TeamSwitcher } from "../team-switcher"

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children, asChild: _asChild }: any) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
  DropdownMenuShortcut: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-shortcut">{children}</div>
  ),
}))

vi.mock("@/components/ui/sidebar", () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
  SidebarMenuButton: ({ children, size: _size, className, asChild: _asChild }: any) => (
    <button data-testid="sidebar-menu-button" className={className}>
      {children}
    </button>
  ),
  useSidebar: vi.fn(() => ({
    isMobile: false,
  })),
}))

describe("teamSwitcher", () => {
  const mockTeams = [
    {
      name: "Team A",
      logo: () => <span>A</span>,
      plan: "Pro",
    },
    {
      name: "Team B",
      logo: () => <span>B</span>,
      plan: "Enterprise",
    },
  ]

  it("renders sidebar menu structure", () => {
    const { getByTestId } = render(<TeamSwitcher teams={mockTeams} />)

    expect(getByTestId("sidebar-menu")).toBeTruthy()
    expect(getByTestId("sidebar-menu-item")).toBeTruthy()
  })

  it("renders dropdown menu trigger", () => {
    const { getByTestId } = render(<TeamSwitcher teams={mockTeams} />)

    expect(getByTestId("dropdown-trigger")).toBeTruthy()
  })

  it("initializes with first team selected", () => {
    const { container } = render(<TeamSwitcher teams={mockTeams} />)

    expect(container.textContent).toContain("Team A")
    expect(container.textContent).toContain("Pro")
  })

  it("renders menu button with correct styling", () => {
    const { getByTestId } = render(<TeamSwitcher teams={mockTeams} />)

    const button = getByTestId("sidebar-menu-button")
    expect(button.className).toContain("data-[state=open]:bg-sidebar-accent")
    expect(button.className).toContain("data-[state=open]:text-sidebar-accent-foreground")
  })

  it("renders when isMobile is true", () => {
    vi.mocked(useSidebar).mockReturnValueOnce({
      isMobile: true,
    } as any)
    const { getByTestId } = render(<TeamSwitcher teams={mockTeams} />)
    expect(getByTestId("sidebar-menu")).toBeTruthy()
  })

  it("switches active team on dropdown item click", () => {
    const { container, getAllByTestId } = render(<TeamSwitcher teams={mockTeams} />)
    expect(container.textContent).toContain("Team A")
    const items = getAllByTestId("dropdown-item")
    const teamBItem = items.find((item) => item.textContent?.includes("Team B"))
    fireEvent.click(teamBItem!)
    expect(container.textContent).toContain("Team B")
    expect(container.textContent).toContain("Enterprise")
  })

  it("returns null when teams array is empty", () => {
    const { container } = render(<TeamSwitcher teams={[]} />)

    expect(container.firstChild).toBeNull()
  })

  it("handles team switching", async () => {
    const { container } = render(<TeamSwitcher teams={mockTeams} />)

    expect(container.textContent).toContain("Team A")
  })

  it("displays all team options", () => {
    const { container } = render(<TeamSwitcher teams={mockTeams} />)

    expect(container.textContent).toContain("Team A")
    expect(container.textContent).toContain("Team B")
  })

  it("shows proper sidebar structure", () => {
    const { getByTestId } = render(<TeamSwitcher teams={mockTeams} />)

    const menu = getByTestId("sidebar-menu")
    const menuItem = getByTestId("sidebar-menu-item")

    expect(menu.contains(menuItem)).toBe(true)
  })
})
