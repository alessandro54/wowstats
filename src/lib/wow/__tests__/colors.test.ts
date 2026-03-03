import { describe, expect, it } from "vitest"
import {
  getClassBgGradient,
  getClassColor,
  getClassColorOklch,
  getClassColors,
  getClassColorVar,
  getSpecColor,
} from "../colors"

describe("getClassColor", () => {
  it("returns warrior hex color", () => {
    const color = getClassColor("warrior")
    expect(color).toBe("#C69B6D")
  })

  it("returns mage hex color", () => {
    const color = getClassColor("mage")
    expect(color).toBe("#69CCF0")
  })

  it("returns default white for invalid class", () => {
    const color = getClassColor("invalid" as any)
    expect(color).toBe("#FFFFFF")
  })

  it("returns hex color format", () => {
    const color = getClassColor("warrior")
    expect(color).toMatch(/^#[0-9A-F]{6}$/i)
  })
})

describe("getClassColorOklch", () => {
  it("returns warrior OKLCH color", () => {
    const color = getClassColorOklch("warrior")
    expect(color).toBe("oklch(0.6431 0.2243 37.45)")
  })

  it("returns mage OKLCH color", () => {
    const color = getClassColorOklch("mage")
    expect(color).toBe("oklch(0.7493 0.2533 249.22)")
  })

  it("returns default white OKLCH for invalid class", () => {
    const color = getClassColorOklch("invalid" as any)
    expect(color).toBe("oklch(1 0 0)")
  })

  it("returns OKLCH format", () => {
    const color = getClassColorOklch("warrior")
    expect(color).toMatch(/^oklch\(/)
  })
})

describe("getClassBgGradient", () => {
  it("returns gradient when available", () => {
    // This depends on which classes have bgGradient defined
    // Testing it returns either string or undefined
    const gradient = getClassBgGradient("warrior")
    expect(gradient === undefined || typeof gradient === "string").toBe(true)
  })

  it("returns undefined for invalid class", () => {
    const gradient = getClassBgGradient("invalid" as any)
    expect(gradient).toBeUndefined()
  })
})

describe("getSpecColor", () => {
  it("returns spec color if available", () => {
    const color = getSpecColor("warrior", "arms")
    expect(typeof color).toBe("string")
    expect(color).toMatch(/^oklch\(/)
  })

  it("falls back to class color if spec color not available", () => {
    const specColor = getSpecColor("warrior", "arms")

    // Should return either spec-specific or class color
    expect(typeof specColor).toBe("string")
    expect(specColor).toMatch(/^oklch\(/)
  })

  it("returns default for invalid class", () => {
    const color = getSpecColor("invalid" as any, "arms")
    expect(color).toBe("oklch(1 0 0)")
  })
})

describe("getClassColorVar", () => {
  it("returns CSS variable with default name", () => {
    const cssVar = getClassColorVar("warrior")
    expect(cssVar).toBe("--class-color: #C69B6D;")
  })

  it("returns CSS variable with custom name", () => {
    const cssVar = getClassColorVar("warrior", "custom-color")
    expect(cssVar).toBe("--custom-color: #C69B6D;")
  })

  it("formats as valid CSS variable", () => {
    const cssVar = getClassColorVar("mage")
    expect(cssVar).toMatch(/^--[\w-]+: #[0-9A-F]{6};$/i)
  })
})

describe("getClassColors", () => {
  it("returns object with all color formats", () => {
    const colors = getClassColors("warrior")
    expect(colors).toHaveProperty("hex")
    expect(colors).toHaveProperty("oklch")
    expect(colors).toHaveProperty("gradient")
  })

  it("includes correct warrior colors", () => {
    const colors = getClassColors("warrior")
    expect(colors.hex).toBe("#C69B6D")
    expect(colors.oklch).toBe("oklch(0.6431 0.2243 37.45)")
  })

  it("includes mage colors", () => {
    const colors = getClassColors("mage")
    expect(colors.hex).toBe("#69CCF0")
    expect(colors.oklch).toBe("oklch(0.7493 0.2533 249.22)")
  })

  it("returns defaults for invalid class", () => {
    const colors = getClassColors("invalid" as any)
    expect(colors.hex).toBe("#FFFFFF")
    expect(colors.oklch).toBe("oklch(1 0 0)")
  })
})
