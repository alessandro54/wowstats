import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MetaKpiRow } from "../meta-kpi-row"

describe("MetaKpiRow", () => {
  const props = {
    totalPlayers: 1500,
    weightedAvgRating: 2100,
    weightedAvgWinRate: 0.523,
    topSpec: {
      name: "Arms",
      className: "Warrior",
      color: "var(--color-class-warrior)",
    },
    mostReliable: {
      name: "Fire",
      className: "Mage",
      color: "var(--color-class-mage)",
      bK: 0.94,
    },
  }

  it("renders total players", () => {
    render(<MetaKpiRow {...props} />)
    expect(screen.getByText("1,500")).toBeDefined()
  })

  it("renders avg rating", () => {
    render(<MetaKpiRow {...props} />)
    expect(screen.getByText("2100")).toBeDefined()
  })

  it("renders avg win rate", () => {
    render(<MetaKpiRow {...props} />)
    expect(screen.getByText("52.3%")).toBeDefined()
  })

  it("renders top spec name", () => {
    render(<MetaKpiRow {...props} />)
    expect(screen.getByText("Arms")).toBeDefined()
  })

  it("renders most reliable spec", () => {
    render(<MetaKpiRow {...props} />)
    expect(screen.getByText("Fire")).toBeDefined()
  })
})
