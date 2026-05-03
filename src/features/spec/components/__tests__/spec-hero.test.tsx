import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SpecHero } from "../spec-hero"

const baseProps = {
  specName: "havoc",
  className: "Demon Hunter",
  classSlug: "demon-hunter",
  specIconUrl: "/icon.jpg",
}

describe("SpecHero", () => {
  it("renders without crashing", () => {
    const { container } = render(<SpecHero {...baseProps} />)
    expect(container.firstChild).toBeDefined()
  })

  it("renders class name", () => {
    const { container } = render(<SpecHero {...baseProps} />)
    expect(container.textContent).toContain("Demon Hunter")
  })

  it("renders bracket label when provided", () => {
    const { container } = render(<SpecHero {...baseProps} bracketLabel="3v3 Arena" />)
    expect(container.textContent).toContain("3v3 Arena")
  })
})
