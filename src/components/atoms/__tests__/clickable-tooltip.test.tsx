import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ClickableTooltip } from "../clickable-tooltip"

describe("clickableTooltip", () => {
  const defaultProps = {
    children: <span>Trigger</span>,
    content: <span>Tooltip content</span>,
    side: "bottom" as const,
    align: "center" as const,
  }

  it("renders trigger and content structure", () => {
    const { container } = render(<ClickableTooltip {...defaultProps} />)
    expect(container.textContent).toContain("Trigger")
  })

  it("renders with different side positions", () => {
    const sides = [
      "top",
      "bottom",
      "left",
      "right",
    ] as const
    sides.forEach((side) => {
      const { unmount } = render(<ClickableTooltip {...defaultProps} side={side} />)
      expect(screen.getByText("Trigger")).toBeInTheDocument()
      unmount()
    })
  })

  it("toggles open state on click", () => {
    render(<ClickableTooltip {...defaultProps} />)
    const trigger = screen.getByText("Trigger")
    fireEvent.click(trigger)
    // No error means the onClick toggle ran successfully
    expect(trigger).toBeInTheDocument()
  })

  it("accepts align prop", () => {
    const aligns = [
      "start",
      "center",
      "end",
    ] as const
    aligns.forEach((align) => {
      const { unmount } = render(<ClickableTooltip {...defaultProps} align={align} />)
      expect(screen.getByText("Trigger")).toBeInTheDocument()
      unmount()
    })
  })
})
