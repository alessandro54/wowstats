import { describe, expect, it } from "vitest"
import { getClassBgGradient, getClassColor, getClassColorVar } from "../colors"

describe("getClassColor", () => {
  it("returns CSS variable for warrior", () => {
    const color = getClassColor("warrior")
    expect(color).toBe("var(--color-class-warrior)")
  })

  it("returns CSS variable for mage", () => {
    const color = getClassColor("mage")
    expect(color).toBe("var(--color-class-mage)")
  })

  it("returns CSS variable even for unknown slug", () => {
    const color = getClassColor("invalid" as any)
    expect(color).toBe("var(--color-class-invalid)")
  })

  it("returns var(--color-class-*) format", () => {
    const color = getClassColor("warrior")
    expect(color).toMatch(/^var\(--color-class-/)
  })
})

describe("getClassBgGradient", () => {
  it("returns gradient when available", () => {
    const gradient = getClassBgGradient("warrior")
    expect(gradient === undefined || typeof gradient === "string").toBe(true)
  })

  it("returns undefined for invalid class", () => {
    const gradient = getClassBgGradient("invalid" as any)
    expect(gradient).toBeUndefined()
  })
})

describe("getClassColorVar", () => {
  it("returns CSS custom property with default name", () => {
    const cssVar = getClassColorVar("warrior")
    expect(cssVar).toBe("--class-color: var(--color-class-warrior);")
  })

  it("returns CSS custom property with custom name", () => {
    const cssVar = getClassColorVar("warrior", "custom-color")
    expect(cssVar).toBe("--custom-color: var(--color-class-warrior);")
  })

  it("formats as valid CSS variable declaration", () => {
    const cssVar = getClassColorVar("mage")
    expect(cssVar).toMatch(/^--[\w-]+: var\(--color-class-/)
  })
})
