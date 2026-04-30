import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpecComparisonTable } from "../spec-comparison-table"

describe("SpecComparisonTable", () => {
  it("renders without crashing with empty brackets", () => {
    const { container } = render(<SpecComparisonTable brackets={[]} />)
    expect(container).toBeDefined()
  })
})
