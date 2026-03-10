import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { StatPriority } from "../stat-priority"

vi.mock("@/config/equipment-config", () => ({
  getStatMeta: (stat: string) => ({
    label: stat === "HASTE_RATING" ? "Haste" : stat === "CRIT_RATING" ? "Crit" : stat === "VERSATILITY" ? "Versatility" : stat,
    color: "#ff0000",
  }),
}))

const stats = [
  { stat: "HASTE_RATING", count: 800, pct: 85.2 },
  { stat: "VERSATILITY", count: 650, pct: 69.1 },
  { stat: "CRIT_RATING", count: 150, pct: 16.0 },
]

describe("statPriority", () => {
  it("renders Stat Priority heading", () => {
    const { container } = render(<StatPriority stats={stats} />)
    expect(container.textContent).toContain("Stat Priority")
  })

  it("renders stat labels", () => {
    const { container } = render(<StatPriority stats={stats} />)
    expect(container.textContent).toContain("Haste")
    expect(container.textContent).toContain("Versatility")
    expect(container.textContent).toContain("Crit")
  })

  it("renders percentage values", () => {
    const { container } = render(<StatPriority stats={stats} />)
    expect(container.textContent).toContain("85.2%")
    expect(container.textContent).toContain("69.1%")
    expect(container.textContent).toContain("16.0%")
  })

  it("renders rank numbers", () => {
    const { container } = render(<StatPriority stats={stats} />)
    expect(container.textContent).toContain("1")
    expect(container.textContent).toContain("2")
    expect(container.textContent).toContain("3")
  })

  it("returns null for empty stats", () => {
    const { container } = render(<StatPriority stats={[]} />)
    expect(container.innerHTML).toBe("")
  })

  it("shows description text", () => {
    const { container } = render(<StatPriority stats={stats} />)
    expect(container.textContent).toContain("crafting stat choices")
  })
})
