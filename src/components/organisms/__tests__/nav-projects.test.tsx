import { render } from "@testing-library/react"
import { Frame, Map } from "lucide-react"
import { describe, expect, it, vi } from "vitest"

import { useSidebar } from "@/components/ui/sidebar"
import { NavProjects } from "../nav-projects"

vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: ({ children }: any) => <div>{children}</div>,
  SidebarGroupLabel: ({ children }: any) => <div data-testid="label">{children}</div>,
  SidebarMenu: ({ children }: any) => <ul>{children}</ul>,
  SidebarMenuAction: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: any) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: any) => <li>{children}</li>,
  useSidebar: vi.fn(() => ({
    isMobile: false,
  })),
}))

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children }: any) => <div data-testid="action">{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
}))

const projects = [
  {
    name: "Project Alpha",
    url: "/alpha",
    icon: Frame,
  },
  {
    name: "Project Beta",
    url: "/beta",
    icon: Map,
  },
]

describe("navProjects", () => {
  it("renders the Projects label", () => {
    const { getByTestId } = render(<NavProjects projects={projects} />)
    expect(getByTestId("label").textContent).toBe("Projects")
  })

  it("renders all project names", () => {
    const { container } = render(<NavProjects projects={projects} />)
    expect(container.textContent).toContain("Project Alpha")
    expect(container.textContent).toContain("Project Beta")
  })

  it("renders project links with correct href", () => {
    const { container } = render(<NavProjects projects={projects} />)
    const links = container.querySelectorAll("a")
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"))
    expect(hrefs).toContain("/alpha")
    expect(hrefs).toContain("/beta")
  })

  it("renders dropdown action items (View, Share, Delete)", () => {
    const { getAllByTestId } = render(<NavProjects projects={projects} />)
    const actions = getAllByTestId("action")
    const labels = actions.map((a) => a.textContent)
    expect(labels.some((l) => l?.includes("View Project"))).toBe(true)
    expect(labels.some((l) => l?.includes("Share Project"))).toBe(true)
    expect(labels.some((l) => l?.includes("Delete Project"))).toBe(true)
  })

  it("shows the More overflow button", () => {
    const { container } = render(<NavProjects projects={projects} />)
    expect(container.textContent).toContain("More")
  })

  it("handles empty projects array", () => {
    const { container, getByTestId } = render(<NavProjects projects={[]} />)
    expect(getByTestId("label").textContent).toBe("Projects")
    // Only the "More" button should be present
    expect(container.textContent).toContain("More")
  })

  it("uses isMobile for dropdown positioning", () => {
    vi.mocked(useSidebar).mockReturnValue({
      isMobile: true,
    } as any)
    const { container } = render(<NavProjects projects={projects} />)
    expect(container.textContent).toContain("Project Alpha")
  })
})
