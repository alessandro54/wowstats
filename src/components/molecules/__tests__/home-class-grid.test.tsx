import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { HomeClassGrid } from "../home-class-grid"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

describe("HomeClassGrid", () => {
  it("renders all 13 classes", () => {
    render(<HomeClassGrid classes={WOW_CLASSES} />)
    const links = screen.getAllByRole("link")
    expect(links.length).toBe(13)
  })

  it("links to first spec of each class", () => {
    render(<HomeClassGrid classes={WOW_CLASSES} />)
    const links = screen.getAllByRole("link")
    const firstLink = links[0]
    expect(firstLink.getAttribute("href")).toMatch(/^\/pvp\/death-knight\//)
  })

  it("renders class icons", () => {
    render(<HomeClassGrid classes={WOW_CLASSES} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs.length).toBe(13)
  })
})
