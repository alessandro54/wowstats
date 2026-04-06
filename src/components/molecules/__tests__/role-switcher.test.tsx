import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { RoleSwitcher } from "../role-switcher"

describe("RoleSwitcher", () => {
  it("renders all role buttons", () => {
    render(<RoleSwitcher current="dps" />)
    expect(screen.getByText("DPS")).toBeDefined()
    expect(screen.getByText("Healer")).toBeDefined()
    expect(screen.getByText("Tank")).toBeDefined()
  })

  it("renders without crashing", () => {
    const { container } = render(<RoleSwitcher current="dps" />)
    expect(container.firstChild).toBeDefined()
  })

  it("marks the current role as active", () => {
    const { container } = render(<RoleSwitcher current="dps" />)
    const buttons = container.querySelectorAll("button")
    const dpsButton = Array.from(buttons).find((b) => b.textContent === "DPS")
    expect(dpsButton?.className).toContain("bg-background")
  })

  it("marks healer as active when current is healer", () => {
    const { container } = render(<RoleSwitcher current="healer" />)
    const buttons = container.querySelectorAll("button")
    const healerButton = Array.from(buttons).find((b) => b.textContent === "Healer")
    const dpsButton = Array.from(buttons).find((b) => b.textContent === "DPS")
    expect(healerButton?.className).toContain("bg-background")
    expect(dpsButton?.className).not.toContain("bg-background")
  })

  it("marks tank as active when current is tank", () => {
    const { container } = render(<RoleSwitcher current="tank" />)
    const buttons = container.querySelectorAll("button")
    const tankButton = Array.from(buttons).find((b) => b.textContent === "Tank")
    expect(tankButton?.className).toContain("bg-background")
  })

  it("calls onSwitch with correct role value when clicked", async () => {
    const onSwitch = vi.fn()
    render(<RoleSwitcher current="dps" onSwitch={onSwitch} />)
    await userEvent.click(screen.getByText("Healer"))
    expect(onSwitch).toHaveBeenCalledWith("healer")
  })

  it("calls onSwitch with 'tank' when Tank is clicked", async () => {
    const onSwitch = vi.fn()
    render(<RoleSwitcher current="dps" onSwitch={onSwitch} />)
    await userEvent.click(screen.getByText("Tank"))
    expect(onSwitch).toHaveBeenCalledWith("tank")
  })

  it("renders without onSwitch and clicking does not throw", async () => {
    render(<RoleSwitcher current="dps" />)
    await userEvent.click(screen.getByText("Tank"))
    // no error expected
  })
})
