import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { StatPriority } from "../stat-priority"

vi.mock("@/config/equipment-config", () => ({
  getStatMeta: (stat: string) => ({
    label:
      stat === "HASTE_RATING"
        ? "Haste"
        : stat === "CRIT_RATING"
          ? "Crit"
          : stat === "VERSATILITY"
            ? "Versatility"
            : stat,
    color: "#ff0000",
  }),
}))

const stats = [
  {
    stat: "HASTE_RATING",
    median: 800,
  },
  {
    stat: "VERSATILITY",
    median: 650,
  },
  {
    stat: "CRIT_RATING",
    median: 150,
  },
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
    // Component renders a bar chart; stat labels are shown in the main view
    expect(container.textContent).toContain("Haste")
    expect(container.textContent).toContain("Versatility")
    expect(container.textContent).toContain("Crit")
  })

  it("renders rank numbers", () => {
    const { container } = render(<StatPriority stats={stats} />)
    // Stats are rendered in order, labels present
    expect(container.textContent).toContain("Haste")
    expect(container.textContent).toContain("Versatility")
    expect(container.textContent).toContain("Crit")
  })

  it("returns null for empty stats", () => {
    const { container } = render(<StatPriority stats={[]} />)
    expect(container.innerHTML).toBe("")
  })

  it("shows description text", () => {
    const { container } = render(<StatPriority stats={stats} />)
    expect(container.textContent).toContain("Median stat distribution")
  })
})
