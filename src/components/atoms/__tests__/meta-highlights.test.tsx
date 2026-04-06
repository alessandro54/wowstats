import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import { MetaHighlights } from "../meta-highlights"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

const mockEntries: MetaStatsEntry[] = [
  {
    key: "1",
    specName: "subtlety",
    className: "rogue",
    role: "dps",
    score: 88,
    normPct: 100,
    tier: "S+" as const,
    thetaHat: 1899,
    ratingCiLow: 1891,
    ratingCiHigh: 1907,
    meanRating: 1899,
    wrHat: 0.604,
    presence: 0.113,
    bK: 0.92,
    color: "var(--color-class-rogue)",
    specUrl: "/pvp/rogue/subtlety/2v2",
  },
  {
    key: "2",
    specName: "windwalker",
    className: "monk",
    role: "dps",
    score: 54,
    normPct: 61,
    tier: "A" as const,
    thetaHat: 1885,
    ratingCiLow: 1885,
    ratingCiHigh: 1904,
    meanRating: 1885,
    wrHat: 0.614,
    presence: 0.078,
    bK: 0.88,
    color: "var(--color-class-monk)",
    specUrl: "/pvp/monk/windwalker/2v2",
  },
  {
    key: "3",
    specName: "shadow",
    className: "priest",
    role: "dps",
    score: 50,
    normPct: 57,
    tier: "B" as const,
    thetaHat: 1860,
    ratingCiLow: 1849,
    ratingCiHigh: 1872,
    meanRating: 1860,
    wrHat: 0.586,
    presence: 0.051,
    bK: 0.65,
    color: "var(--color-class-priest)",
    specUrl: "/pvp/priest/shadow/2v2",
  },
]

describe("MetaHighlights", () => {
  it("renders the Highlights heading", () => {
    const { container } = render(<MetaHighlights entries={mockEntries} />)
    expect(container.textContent).toContain("Highlights")
  })

  it("renders Highest Win Rate highlight", () => {
    const { container } = render(<MetaHighlights entries={mockEntries} />)
    expect(container.textContent).toContain("Highest Win Rate")
  })

  it("renders Most Popular highlight", () => {
    const { container } = render(<MetaHighlights entries={mockEntries} />)
    expect(container.textContent).toContain("Most Popular")
  })

  it("renders Most Volatile highlight", () => {
    const { container } = render(<MetaHighlights entries={mockEntries} />)
    expect(container.textContent).toContain("Most Volatile")
  })

  it("renders win rate value as percentage", () => {
    const { container } = render(<MetaHighlights entries={mockEntries} />)
    // windwalker has highest wrHat (0.614)
    expect(container.textContent).toContain("61.4%")
  })

  it("renders presence value as percentage", () => {
    const { container } = render(<MetaHighlights entries={mockEntries} />)
    // subtlety has highest presence (0.113)
    expect(container.textContent).toContain("11.3%")
  })

  it("renders icon images when iconUrl is provided", () => {
    const withIcons = mockEntries.map((e) => ({
      ...e,
      iconUrl: "https://example.com/icon.jpg",
    }))
    const { container } = render(<MetaHighlights entries={withIcons} />)
    const imgs = container.querySelectorAll("img")
    expect(imgs.length).toBeGreaterThan(0)
  })
})
