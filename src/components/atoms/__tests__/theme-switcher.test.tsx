import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ThemeSwitcher } from "../theme-switcher"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/pvp/warrior/arms/2v2"),
}))

const setTheme = vi.fn()

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme }),
}))

const useHoverSlugMock = vi.fn(() => null as string | null)

vi.mock("@/components/providers/hover-provider", () => ({
  useHoverSlug: () => useHoverSlugMock(),
}))

describe("themeSwitcher", () => {
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

  it("calls setTheme when a theme button is clicked", () => {
    setTheme.mockClear()
    render(<ThemeSwitcher />)
    const buttons = screen.getAllByRole("button")
    // "dark" is the third option (system, light, dark)
    fireEvent.click(buttons[2])
    expect(setTheme).toHaveBeenCalledWith("dark")
  })

  it("has transition classes on buttons", () => {
    render(<ThemeSwitcher />)

    const buttons = screen.getAllByRole("button")
    buttons.forEach((button) => {
      expect(button).toHaveClass("transition-colors")
    })
  })
})
