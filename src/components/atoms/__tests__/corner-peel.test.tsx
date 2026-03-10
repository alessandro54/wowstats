import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { CornerPeel } from "../corner-peel"

describe("cornerPeel", () => {
  it("renders the label text", () => {
    const { container } = render(
      <CornerPeel activeColor="#c79c6e" onClick={() => {}} label="Alt\n40%" />,
    )
    expect(container.textContent).toContain("Alt")
    expect(container.textContent).toContain("40%")
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    const { container } = render(<CornerPeel activeColor="#c79c6e" onClick={onClick} label="Alt" />)
    fireEvent.click(container.querySelector("button")!)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("applies activeColor to gradient background", () => {
    const { container } = render(
      <CornerPeel activeColor="#ff0000" onClick={() => {}} label="Alt" />,
    )
    const gradientDiv = container.querySelector("div[style*='linear-gradient']")
    expect(gradientDiv?.getAttribute("style")).toContain("rgb(255, 0, 0)")
  })

  it("renders as a button element", () => {
    const { container } = render(
      <CornerPeel activeColor="#c79c6e" onClick={() => {}} label="test" />,
    )
    expect(container.querySelector("button")).toBeInTheDocument()
    expect(container.querySelector("button")?.getAttribute("type")).toBe("button")
  })
})
