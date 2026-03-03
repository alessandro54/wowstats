import { fireEvent, render, screen } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import { ThemeSwitcher } from "../theme-switcher"

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/warrior/arms/pvp/2v2"),
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
    const darkButton = screen.getByLabelText("dark")
    fireEvent.click(darkButton)
    expect(setTheme).toHaveBeenCalledWith("dark")
  })

  it("applies border color CSS variable when hoverSlug is set", () => {
    useHoverSlugMock.mockReturnValueOnce("warrior")
    const { container } = render(<ThemeSwitcher />)
    const wrapper = container.querySelector("div") as HTMLElement
    expect(wrapper.style.borderColor).toContain("warrior")
  })

  it("uses var(--border) color when no class context is available", () => {
    useHoverSlugMock.mockReturnValueOnce(null)
    vi.mocked(usePathname).mockReturnValueOnce("/")
    const { container } = render(<ThemeSwitcher />)
    const wrapper = container.querySelector("div") as HTMLElement
    // When pathname has no class segment and hoverSlug is null, borderColor falls back to var(--border)
    expect(wrapper.getAttribute("style")).toContain("--border")
  })

  it("has transition classes on buttons", () => {
    render(<ThemeSwitcher />)

    const buttons = screen.getAllByRole("button")
    buttons.forEach((button) => {
      expect(button).toHaveClass("transition-colors")
    })
  })
})
