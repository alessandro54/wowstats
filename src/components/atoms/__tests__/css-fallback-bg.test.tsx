import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CssFallbackBg } from "../css-fallback-bg"

describe("CssFallbackBg", () => {
  it("renders a fixed container", () => {
    const { container } = render(<CssFallbackBg />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.style.zIndex).toBe("-1")
    expect(wrapper.className).toContain("fixed")
    expect(wrapper.className).toContain("inset-0")
  })

  it("renders dark and light gradient layers", () => {
    const { container } = render(<CssFallbackBg />)
    const layers = container.querySelectorAll("[class*='absolute']")
    expect(layers.length).toBe(2)
  })

  it("dark layer has radial-gradient background", () => {
    const { container } = render(<CssFallbackBg />)
    const darkLayer = container.querySelector(".dark\\:block") as HTMLElement
    expect(darkLayer).toBeInTheDocument()
    expect(darkLayer.style.background).toContain("radial-gradient")
  })
})
