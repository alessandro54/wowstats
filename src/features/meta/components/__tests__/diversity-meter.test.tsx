import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { MetaStatsEntry } from "@/features/meta/components/meta-stats-table"
import { DiversityMeter } from "../diversity-meter"

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

describe("DiversityMeter", () => {
  it("renders the Meta Health label", () => {
    const { container } = render(<DiversityMeter entries={mockEntries} />)
    expect(container.textContent).toContain("Meta Health")
  })

  it("renders a diversity status label", () => {
    const { container } = render(<DiversityMeter entries={mockEntries} />)
    const text = container.textContent ?? ""
    const hasLabel =
      text.includes("Healthy") ||
      text.includes("Balanced") ||
      text.includes("Narrow") ||
      text.includes("Solved")
    expect(hasLabel).toBe(true)
  })

  it("renders specs viable count", () => {
    const { container } = render(<DiversityMeter entries={mockEntries} />)
    expect(container.textContent).toContain("specs viable")
  })

  it("renders diversity percentage", () => {
    const { container } = render(<DiversityMeter entries={mockEntries} />)
    expect(container.textContent).toContain("% diversity")
  })

  it("renders nothing broken on empty entries", () => {
    const { container } = render(<DiversityMeter entries={[]} />)
    expect(container.textContent).toContain("Meta Health")
  })
})
