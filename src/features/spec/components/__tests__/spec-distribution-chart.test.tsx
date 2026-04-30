import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpecDistributionChart } from "../spec-distribution-chart"

describe("SpecDistributionChart", () => {
  it("renders without crashing with empty brackets", () => {
    const { container } = render(<SpecDistributionChart brackets={[]} />)
    expect(container).toBeDefined()
  })
})
