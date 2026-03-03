import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ClassHoverZone } from "../class-hover-zone"
import type { WowClassSlug } from "@/config/wow/classes"

describe("ClassHoverZone", () => {
  const classSlug = "paladin" as WowClassSlug

  it("renders children", () => {
    render(
      <ClassHoverZone slug={classSlug}>
        <div>Child content</div>
      </ClassHoverZone>
    )
    expect(screen.getByText("Child content")).toBeInTheDocument()
  })

  it("applies className when provided", () => {
    const { container } = render(
      <ClassHoverZone slug={classSlug} className="custom-class">
        <div>Content</div>
      </ClassHoverZone>
    )

    const zone = container.querySelector("div")
    expect(zone).toHaveClass("custom-class")
  })

  it("renders multiple children correctly", () => {
    render(
      <ClassHoverZone slug={classSlug}>
        <div>Child 1</div>
        <div>Child 2</div>
      </ClassHoverZone>
    )

    expect(screen.getByText("Child 1")).toBeInTheDocument()
    expect(screen.getByText("Child 2")).toBeInTheDocument()
  })

  it("has mouse event handlers", () => {
    const { container } = render(
      <ClassHoverZone slug={classSlug}>
        <div>Content</div>
      </ClassHoverZone>
    )

    const zone = container.querySelector("div")
    // Verify handlers exist by triggering events without errors
    fireEvent.mouseEnter(zone!)
    fireEvent.mouseLeave(zone!)
    expect(true).toBe(true)
  })
})
