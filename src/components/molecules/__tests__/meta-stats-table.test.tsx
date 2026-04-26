import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaStatsEntry } from "../meta-stats-table"
import { MetaStatsTable } from "../meta-stats-table"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
}))

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

const entries: MetaStatsEntry[] = [
  {
    key: "warrior-71",
    specName: "Arms",
    className: "Warrior",
    role: "dps",
    score: 0.87,
    normPct: 100,
    tier: "S",
    thetaHat: 2145.2,
    ratingCiLow: 2080.0,
    ratingCiHigh: 2210.0,
    meanRating: 2150.0,
    wrHat: 0.543,
    presence: 0.124,
    bK: 0.92,
    color: "var(--color-class-warrior)",
    iconUrl: "/icons/arms.png",
    specUrl: "/pvp/warrior/arms",
  },
  {
    key: "mage-62",
    specName: "Fire",
    className: "Mage",
    role: "dps",
    score: 0.65,
    normPct: 74.7,
    tier: "A",
    thetaHat: 2050.0,
    ratingCiLow: 1980.0,
    ratingCiHigh: 2120.0,
    meanRating: 2060.0,
    wrHat: 0.512,
    presence: 0.085,
    bK: 0.55,
    color: "var(--color-class-mage)",
    specUrl: "/pvp/mage/fire",
  },
]

describe("MetaStatsTable", () => {
  it("renders all rows with spec names", () => {
    render(<MetaStatsTable entries={entries} />)
    expect(screen.getByText("Arms")).toBeDefined()
    expect(screen.getByText("Fire")).toBeDefined()
  })

  it("renders tier badges", () => {
    render(<MetaStatsTable entries={entries} />)
    expect(screen.getByText("S")).toBeDefined()
    expect(screen.getByText("A")).toBeDefined()
  })

  it("renders Bayesian rating values", () => {
    render(<MetaStatsTable entries={entries} />)
    expect(screen.getByText("2145")).toBeDefined()
    expect(screen.getByText("2050")).toBeDefined()
  })

  it("renders win rate percentages", () => {
    render(<MetaStatsTable entries={entries} />)
    expect(screen.getByText("54.3%")).toBeDefined()
    expect(screen.getByText("51.2%")).toBeDefined()
  })

  it("renders rank numbers", () => {
    render(<MetaStatsTable entries={entries} />)
    expect(screen.getByText("1")).toBeDefined()
    expect(screen.getByText("2")).toBeDefined()
  })
})
