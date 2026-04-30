import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpecStatBar } from "../spec-stat-bar"

const baseProps = {
  winRate: 0.52,
  presence: 0.15,
  playerCount: 100,
  classColor: "#a330c9",
}

describe("SpecStatBar", () => {
  it("renders without crashing", () => {
    const { container } = render(<SpecStatBar {...baseProps} />)
    expect(container.firstChild).toBeDefined()
  })

  it("renders win rate percentage", () => {
    const { container } = render(<SpecStatBar {...baseProps} />)
    expect(container.textContent).toContain("52.0%")
  })

  it("renders presence percentage", () => {
    const { container } = render(<SpecStatBar {...baseProps} />)
    expect(container.textContent).toContain("15.0%")
  })

  it("returns null when playerCount is zero", () => {
    const { container } = render(<SpecStatBar {...baseProps} playerCount={0} />)
    expect(container.firstChild).toBeNull()
  })
})
