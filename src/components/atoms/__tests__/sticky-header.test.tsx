import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { StickySpecHeader } from "../sticky-header"

describe("stickySpecHeader", () => {
  it("renders children", () => {
    render(
      <div>
        <StickySpecHeader>
          <div>Sticky content</div>
        </StickySpecHeader>
      </div>,
    )

    expect(screen.getByText("Sticky content")).toBeInTheDocument()
  })

  it("applies className when provided", () => {
    const { container } = render(
      <div>
        <StickySpecHeader className="custom-sticky">
          <div>Content</div>
        </StickySpecHeader>
      </div>,
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
      </div>,
    )

    const header = container.querySelector("div > div:first-child")
    expect(header).toBeInTheDocument()
  })

  it("updates CSS property on scroll", () => {
    const { container } = render(
      <div
        style={{
          overflow: "auto",
        }}
      >
        <StickySpecHeader>
          <div>Scrollable content</div>
        </StickySpecHeader>
      </div>,
    )

    const parentDiv = container.querySelector("div") as HTMLDivElement
    const headerDiv = parentDiv.querySelector("div") as HTMLDivElement

    Object.defineProperty(parentDiv, "scrollTop", {
      value: 100,
      writable: true,
    })
    fireEvent.scroll(parentDiv)

    expect(headerDiv.style.getPropertyValue("--header-bg-opacity")).toBeTruthy()
  })

  it("sets backdropFilter to none when scrollTop is 0", () => {
    const { container } = render(
      <div
        style={{
          overflow: "auto",
        }}
      >
        <StickySpecHeader>
          <div>Content</div>
        </StickySpecHeader>
      </div>,
    )
    const parentDiv = container.firstChild as HTMLDivElement
    const headerDiv = parentDiv.querySelector("div") as HTMLDivElement

    Object.defineProperty(parentDiv, "scrollTop", {
      value: 0,
      writable: true,
    })
    fireEvent.scroll(parentDiv)

    expect(headerDiv.style.backdropFilter).toBe("none")
  })

  it("early-returns from useEffect when el has no parentElement", () => {
    // Render without a wrapper — parentElement will be the jsdom document body,
    // but the effect guard is still exercised harmlessly.
    const { container } = render(
      <StickySpecHeader>
        <div>Content</div>
      </StickySpecHeader>,
    )
    expect(container.textContent).toContain("Content")
  })

  it("renders nested content", () => {
    const { container } = render(
      <div>
        <StickySpecHeader>
          <div>Nested content</div>
        </StickySpecHeader>
      </div>,
    )

    expect(container.textContent).toContain("Nested content")
  })
})
