import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MetaStatsSkeleton } from "../meta-stats-skeleton"

describe("MetaStatsSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<MetaStatsSkeleton />)
    expect(container.firstChild).toBeDefined()
  })
})
