import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { AppSidebar } from "../app-sidebar"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

vi.mock("@/components/organisms/nav-main", () => ({
  NavMain: () => <div data-testid="nav-main">Navigation</div>,
}))

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: any) => <div data-testid="sidebar">{children}</div>,
  SidebarContent: ({ children }: any) => <div>{children}</div>,
  SidebarHeader: ({ children }: any) => <div>{children}</div>,
  SidebarRail: () => <div data-testid="sidebar-rail" />,
  useSidebar: () => ({
    open: true,
  }),
}))

describe("appSidebar", () => {
  it("renders the sidebar with nav and logo", () => {
    const { getByTestId, container } = render(<AppSidebar />)
    expect(getByTestId("sidebar")).toBeDefined()
    expect(getByTestId("nav-main").textContent).toBe("Navigation")
    expect(container.querySelector("img[alt='Logo']")).toBeInTheDocument()
  })

  it("renders the sidebar rail", () => {
    const { getByTestId } = render(<AppSidebar />)
    expect(getByTestId("sidebar-rail")).toBeDefined()
  })

  it("shows title when sidebar is open", () => {
    const { container } = render(<AppSidebar />)
    expect(container.textContent).toContain("WoW Insights")
  })

  it("renders link to home", () => {
    const { container } = render(<AppSidebar />)
    const link = container.querySelector("a[href='/']")
    expect(link).toBeInTheDocument()
  })
})
