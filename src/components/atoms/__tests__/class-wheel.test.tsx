import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { MetaStatsEntry } from "@/components/molecules/meta-stats-table"
import { ClassWheel } from "../class-wheel"

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

describe("ClassWheel", () => {
  it("renders an SVG element", () => {
    const { container } = render(<ClassWheel entries={mockEntries} />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("renders donut slices for each class", () => {
    const { container } = render(<ClassWheel entries={mockEntries} />)
    const paths = container.querySelectorAll("path")
    expect(paths.length).toBe(3)
  })

  it("renders class names in the legend", () => {
    const { container } = render(<ClassWheel entries={mockEntries} />)
    expect(container.textContent).toContain("Rogue")
    expect(container.textContent).toContain("Monk")
    expect(container.textContent).toContain("Priest")
  })

  it("renders Class Spread label inside SVG", () => {
    const { container } = render(<ClassWheel entries={mockEntries} />)
    expect(container.textContent).toContain("Class")
    expect(container.textContent).toContain("Spread")
  })

  it("renders percentage values in legend", () => {
    const { container } = render(<ClassWheel entries={mockEntries} />)
    expect(container.textContent).toContain("%")
  })
})
