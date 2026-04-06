import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { HomeClassGrid } from "../home-class-grid"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

describe("HomeClassGrid", () => {
  it("renders all 13 classes as buttons (mobile + desktop)", () => {
    render(<HomeClassGrid classes={WOW_CLASSES} />)
    const buttons = screen.getAllByRole("button")
    // 13 classes x 2 grids (mobile + desktop)
    expect(buttons.length).toBe(26)
  })

  it("renders class names", () => {
    render(<HomeClassGrid classes={WOW_CLASSES} />)
    // getAllByText because each name appears twice (mobile + desktop)
    expect(screen.getAllByText("Death Knight").length).toBe(2)
    expect(screen.getAllByText("Warrior").length).toBe(2)
  })

  it("renders class icons", () => {
    render(<HomeClassGrid classes={WOW_CLASSES} />)
    const imgs = screen.getAllByRole("img")
    // 13 classes x 2 grids (mobile + desktop)
    expect(imgs.length).toBe(26)
  })
})
