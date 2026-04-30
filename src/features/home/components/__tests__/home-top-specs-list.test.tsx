import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { HomeTopSpecsList } from "../home-top-specs-list"

describe("HomeTopSpecsList", () => {
  it("renders without crashing with empty specs", () => {
    const { container } = render(<HomeTopSpecsList specs={[]} />)
    expect(container).toBeDefined()
  })
})
