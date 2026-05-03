import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaStatsEntry } from "@/features/meta/components/meta-stats-table"
import { TopPerformers } from "../top-performers"

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

describe("TopPerformers", () => {
  it("renders the Top Performers heading", () => {
    const { container } = render(<TopPerformers entries={mockEntries} />)
    expect(container.textContent).toContain("Top Performers")
  })

  it("renders the top 3 spec names", () => {
    const { container } = render(<TopPerformers entries={mockEntries} />)
    expect(container.textContent).toContain("Subtlety")
    expect(container.textContent).toContain("Windwalker")
    expect(container.textContent).toContain("Shadow")
  })

  it("renders tier badges", () => {
    const { container } = render(<TopPerformers entries={mockEntries} />)
    expect(container.textContent).toContain("S+")
    expect(container.textContent).toContain("A")
    expect(container.textContent).toContain("B")
  })

  it("renders at most 3 entries even with more input", () => {
    const extra = [
      ...mockEntries,
      {
        ...mockEntries[0],
        key: "4",
        specName: "arms",
        className: "warrior",
      },
    ]
    const { container } = render(<TopPerformers entries={extra} />)
    expect(container.textContent).not.toContain("Arms")
  })

  it("renders icon images when iconUrl is provided", () => {
    const withIcons = mockEntries.map((e) => ({
      ...e,
      iconUrl: "https://example.com/icon.jpg",
    }))
    const { container } = render(<TopPerformers entries={withIcons} />)
    const imgs = container.querySelectorAll("img")
    expect(imgs.length).toBe(3)
  })
})
