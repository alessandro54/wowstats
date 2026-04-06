import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { RegionSwitcher } from "../region-switcher"

describe("RegionSwitcher", () => {
  it("renders all region buttons", () => {
    render(<RegionSwitcher />)
    expect(screen.getByText("Global")).toBeDefined()
    expect(screen.getByText("US")).toBeDefined()
    expect(screen.getByText("EU")).toBeDefined()
  })

  it("renders without crashing with default props", () => {
    const { container } = render(<RegionSwitcher />)
    expect(container.firstChild).toBeDefined()
  })

  it("marks the current region button as active by default (all)", () => {
    const { container } = render(<RegionSwitcher />)
    const buttons = container.querySelectorAll("button")
    const globalButton = Array.from(buttons).find((b) => b.textContent === "Global")
    expect(globalButton?.className).toContain("bg-background")
  })

  it("marks the specified current region as active", () => {
    const { container } = render(<RegionSwitcher current="us" />)
    const buttons = container.querySelectorAll("button")
    const usButton = Array.from(buttons).find((b) => b.textContent === "US")
    const globalButton = Array.from(buttons).find((b) => b.textContent === "Global")
    expect(usButton?.className).toContain("bg-background")
    expect(globalButton?.className).not.toContain("bg-background")
  })

  it("calls onSwitch with the correct region value when a button is clicked", async () => {
    const onSwitch = vi.fn()
    render(<RegionSwitcher current="all" onSwitch={onSwitch} />)
    await userEvent.click(screen.getByText("EU"))
    expect(onSwitch).toHaveBeenCalledWith("eu")
  })

  it("calls onSwitch with 'us' when US button is clicked", async () => {
    const onSwitch = vi.fn()
    render(<RegionSwitcher current="all" onSwitch={onSwitch} />)
    await userEvent.click(screen.getByText("US"))
    expect(onSwitch).toHaveBeenCalledWith("us")
  })

  it("renders without onSwitch and clicking does not throw", async () => {
    render(<RegionSwitcher current="all" />)
    await userEvent.click(screen.getByText("EU"))
    // no error expected
  })
})
