import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { BracketPanels } from "../bracket-panels"

// next/link renders as <a> in tests via the storybook/vitest mock
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onMouseEnter,
    onClick,
    className,
    style,
  }: {
    href: string
    children: React.ReactNode
    onMouseEnter?: () => void
    onClick?: (e: React.MouseEvent) => void
    className?: string
    style?: React.CSSProperties
  }) => (
    <a
      href={href}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  ),
}))

const defaultProps = {
  classSlug: "warrior",
  specSlug: "arms",
  classColor: "#C69B6D",
}

describe("bracketPanels", () => {
  it("renders all brackets", () => {
    render(<BracketPanels {...defaultProps} />)
    expect(screen.getAllByText("2v2").length).toBeGreaterThan(0)
    expect(screen.getAllByText("3v3").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Solo").length).toBeGreaterThan(0)
  })

  it("renders correct href for each bracket", () => {
    render(<BracketPanels {...defaultProps} />)
    const links = document.querySelectorAll("a")
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"))
    expect(hrefs).toContain("/pvp/warrior/arms/2v2")
    expect(hrefs).toContain("/pvp/warrior/arms/3v3")
    expect(hrefs).toContain("/pvp/warrior/arms/shuffle")
  })

  it("expands a panel on mouse enter", () => {
    render(<BracketPanels {...defaultProps} />)
    const links = document.querySelectorAll("a")
    const firstPanel = links[0]

    fireEvent.mouseEnter(firstPanel)

    expect(firstPanel.className).toContain("flex-5")
  })

  it("collapses all panels on mouse leave from container", () => {
    const { container } = render(<BracketPanels {...defaultProps} />)
    const flexContainer = container.querySelector(".flex.h-44")!
    const links = document.querySelectorAll("a")

    fireEvent.mouseEnter(links[0])
    expect(links[0].className).toContain("flex-5")

    fireEvent.mouseLeave(flexContainer)
    expect(links[0].className).not.toContain("flex-5")
    expect(links[0].className).toContain("flex-1")
  })

  it("applies the class color to panel elements", () => {
    render(<BracketPanels {...defaultProps} />)
    const links = document.querySelectorAll("a")
    const hasColor = Array.from(links).some(
      (l) =>
        (l as HTMLElement).style.color === "rgb(198, 155, 109)" ||
        l.getAttribute("style")?.includes("C69B6D"),
    )
    expect(hasColor).toBe(true)
  })

  it("shows bracket descriptions in expanded content area", () => {
    render(<BracketPanels {...defaultProps} />)
    expect(screen.getByText("Two vs Two Arena")).toBeTruthy()
    expect(screen.getByText("Three vs Three Arena")).toBeTruthy()
  })

  it("on touch device, first click expands without navigating", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query === "(hover: none)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    render(<BracketPanels {...defaultProps} />)
    const links = document.querySelectorAll("a")
    const firstPanel = links[0]

    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault")

    firstPanel.dispatchEvent(clickEvent)
    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})
