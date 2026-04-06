import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ScrollHint } from "../scroll-hint"

describe("scrollHint", () => {
  it("renders without crashing", () => {
    const { container } = render(<ScrollHint />)
    expect(container).toBeTruthy()
  })

  it("renders the scroll label text", () => {
    render(<ScrollHint />)
    expect(screen.getByText("Scroll")).toBeInTheDocument()
  })

  it("renders the animated scroll line element", () => {
    const { container } = render(<ScrollHint />)
    const line = container.querySelector(".animate-scroll-line")
    expect(line).toBeInTheDocument()
  })

  it("has pointer-events-none on the wrapper", () => {
    const { container } = render(<ScrollHint />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain("pointer-events-none")
  })

  it("renders with absolute positioning", () => {
    const { container } = render(<ScrollHint />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain("absolute")
  })
})
