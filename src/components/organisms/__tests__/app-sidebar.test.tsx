import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { AppSidebar } from "../app-sidebar"

vi.mock("@/components/molecules/team-switcher", () => ({
  TeamSwitcher: ({ teams }: any) => (
    <div data-testid="team-switcher">
      {teams.length}
      {" "}
      teams
    </div>
  ),
}))

vi.mock("@/components/organisms/nav-main", () => ({
  NavMain: () => <div data-testid="nav-main">Navigation</div>,
}))

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: any) => <div data-testid="sidebar">{children}</div>,
  SidebarContent: ({ children }: any) => <div>{children}</div>,
  SidebarHeader: ({ children }: any) => <div>{children}</div>,
  SidebarRail: () => <div data-testid="sidebar-rail" />,
}))

describe("appSidebar", () => {
  it("renders the sidebar with team switcher and nav", () => {
    const { getByTestId } = render(<AppSidebar />)
    expect(getByTestId("sidebar")).toBeDefined()
    expect(getByTestId("team-switcher").textContent).toContain("3 teams")
    expect(getByTestId("nav-main").textContent).toBe("Navigation")
  })

  it("renders the sidebar rail", () => {
    const { getByTestId } = render(<AppSidebar />)
    expect(getByTestId("sidebar-rail")).toBeDefined()
  })
})
