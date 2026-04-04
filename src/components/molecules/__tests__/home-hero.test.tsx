import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { HomeHero } from "../home-hero"

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}))

describe("HomeHero", () => {
  it("renders season number and total entries", () => {
    render(<HomeHero seasonId={41} totalEntries={38534} />)
    expect(screen.getByText(/Season 41/)).toBeDefined()
    expect(screen.getByText(/38,534/)).toBeDefined()
  })

  it("renders S+ callout when provided", () => {
    render(
      <HomeHero
        seasonId={41}
        totalEntries={38534}
        sPlus={{
          specName: "subtlety",
          className: "rogue",
          bracket: "2v2",
          wrHat: 0.604,
          presence: 0.113,
          iconUrl: "/icons/sub.png",
          color: "var(--color-class-rogue)",
          specUrl: "/pvp/rogue/subtlety/2v2",
        }}
      />,
    )
    expect(screen.getByText(/Subtlety/)).toBeDefined()
    expect(screen.getByText(/60.4%/)).toBeDefined()
  })

  it("hides S+ callout when not provided", () => {
    const { container } = render(<HomeHero seasonId={41} totalEntries={38534} />)
    expect(container.querySelector("[data-testid='splus-callout']")).toBeNull()
  })
})
