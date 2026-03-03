import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { StickySpecHeader } from "../sticky-header"

describe("StickySpecHeader", () => {
  it("renders children", () => {
    render(
      <div>
        <StickySpecHeader>
          <div>Sticky content</div>
        </StickySpecHeader>
      </div>
    )

    expect(screen.getByText("Sticky content")).toBeInTheDocument()
  })

  it("applies className when provided", () => {
    const { container } = render(
      <div>
        <StickySpecHeader className="custom-sticky">
          <div>Content</div>
        </StickySpecHeader>
      </div>
    )

    const header = container.querySelector(".custom-sticky")
    expect(header).toBeInTheDocument()
  })

  it("renders with div structure", () => {
    const { container } = render(
      <div>
        <StickySpecHeader>
          <div>Content</div>
        </StickySpecHeader>
      </div>
    )

    const header = container.querySelector("div > div:first-child")
    expect(header).toBeInTheDocument()
  })

  it("renders nested content", () => {
    const { container } = render(
      <div>
        <StickySpecHeader>
          <div>Nested content</div>
        </StickySpecHeader>
      </div>
    )

    expect(container.textContent).toContain("Nested content")
  })
})
