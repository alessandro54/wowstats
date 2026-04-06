import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { BracketPanels } from "../bracket-panels"

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    style,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
  }) => (
    <a href={href} className={className} style={style}>
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

  it("renders bracket descriptions", () => {
    render(<BracketPanels {...defaultProps} />)
    expect(screen.getByText("Two vs Two Arena")).toBeTruthy()
    expect(screen.getByText("Three vs Three Arena")).toBeTruthy()
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
})
