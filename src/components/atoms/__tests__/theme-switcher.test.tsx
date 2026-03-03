import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ThemeSwitcher } from "../theme-switcher"

import { vi } from "vitest"

vi.mock("next/navigation", () => ({
  usePathname: () => "/warrior/arms/pvp/2v2",
}))

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useHoverSlug: () => null,
}))

describe("ThemeSwitcher", () => {
  it("renders structure properly", () => {
    const { container } = render(<ThemeSwitcher />)

    const wrapper = container.querySelector("div")
    expect(wrapper).toBeInTheDocument()
  })

  it("has buttons for theme selection", () => {
    render(<ThemeSwitcher />)

    const buttons = screen.getAllByRole("button")
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it("applies border styling", () => {
    const { container } = render(<ThemeSwitcher />)

    const wrapper = container.querySelector("div")
    expect(wrapper).toHaveClass("rounded-md")
    expect(wrapper).toHaveClass("border")
  })

  it("has transition classes on buttons", () => {
    render(<ThemeSwitcher />)

    const buttons = screen.getAllByRole("button")
    buttons.forEach((button) => {
      expect(button).toHaveClass("transition-colors")
    })
  })
})
