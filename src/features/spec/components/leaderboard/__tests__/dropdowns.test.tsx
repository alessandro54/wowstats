import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { ClassDropdown, SpecDropdown } from "../dropdowns"

describe("ClassDropdown", () => {
  it("renders the placeholder when no class is selected", () => {
    const { container } = render(<ClassDropdown value="" onChange={vi.fn()} />)
    expect(container.textContent).toContain("All classes")
  })

  it("renders the selected class label", () => {
    const { container } = render(<ClassDropdown value="mage" onChange={vi.fn()} />)
    expect(container.textContent).toContain("Mage")
  })
})

describe("SpecDropdown", () => {
  it("renders the placeholder when no spec is selected", () => {
    const mage = WOW_CLASSES.find((c) => c.slug === "mage")!
    const { container } = render(<SpecDropdown classConfig={mage} value="" onChange={vi.fn()} />)
    expect(container.textContent).toContain("All specs")
  })
})
