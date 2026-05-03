import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MetaInsightsPanel } from "../meta-insights-panel"

describe("MetaInsightsPanel", () => {
  it("renders without crashing with empty entries", () => {
    const { container } = render(<MetaInsightsPanel entries={[]} />)
    expect(container).toBeDefined()
  })
})
