import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpecBracketCards } from "../spec-bracket-cards"

describe("SpecBracketCards", () => {
  it("renders without crashing with empty brackets", () => {
    const { container } = render(<SpecBracketCards brackets={[]} classSlug="demon-hunter" />)
    expect(container).toBeDefined()
  })
})
