import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpecWinRateChart } from "../spec-winrate-chart"

describe("SpecWinRateChart", () => {
  it("renders without crashing with empty brackets", () => {
    const { container } = render(<SpecWinRateChart brackets={[]} />)
    expect(container).toBeDefined()
  })
})
