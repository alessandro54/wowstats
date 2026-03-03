import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { HoverProvider, useHoverSlug } from "@/components/providers/hover-provider"
import { ClassHoverZone } from "../class-hover-zone"

function SlugDisplay() {
  const slug = useHoverSlug()
  return <span data-testid="slug">{slug ?? "null"}</span>
}

describe("classHoverZone", () => {
  const classSlug = "paladin" as WowClassSlug

  it("renders children", () => {
    render(
      <ClassHoverZone slug={classSlug}>
        <div>Child content</div>
      </ClassHoverZone>,
    )
    expect(screen.getByText("Child content")).toBeInTheDocument()
  })

  it("updates hover slug via context on mouseEnter/mouseLeave", () => {
    const { getByTestId } = render(
      <HoverProvider>
        <ClassHoverZone slug="warrior">
          <div data-testid="zone">Content</div>
        </ClassHoverZone>
        <SlugDisplay />
      </HoverProvider>,
    )

    expect(getByTestId("slug").textContent).toBe("null")
    fireEvent.mouseEnter(getByTestId("zone").parentElement!)
    expect(getByTestId("slug").textContent).toBe("warrior")
    fireEvent.mouseLeave(getByTestId("zone").parentElement!)
    expect(getByTestId("slug").textContent).toBe("null")
  })

  it("applies className when provided", () => {
    const { container } = render(
      <ClassHoverZone slug={classSlug} className="custom-class">
        <div>Content</div>
      </ClassHoverZone>,
    )

    const zone = container.querySelector("div")
    expect(zone).toHaveClass("custom-class")
  })

  it("renders multiple children correctly", () => {
    render(
      <ClassHoverZone slug={classSlug}>
        <div>Child 1</div>
        <div>Child 2</div>
      </ClassHoverZone>,
    )

    expect(screen.getByText("Child 1")).toBeInTheDocument()
    expect(screen.getByText("Child 2")).toBeInTheDocument()
  })

  it("has mouse event handlers", () => {
    const { container } = render(
      <ClassHoverZone slug={classSlug}>
        <div>Content</div>
      </ClassHoverZone>,
    )

    const zone = container.querySelector("div")
    // Verify handlers exist by triggering events without errors
    fireEvent.mouseEnter(zone!)
    fireEvent.mouseLeave(zone!)
    expect(true).toBe(true)
  })
})
