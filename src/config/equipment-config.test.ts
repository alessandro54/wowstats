import { describe, expect, it } from "vitest"
import { formatSlot, formatSocketType, getStatMeta, isReshiiWraps } from "./equipment-config"

describe("formatSlot", () => {
  it("returns label for known slot key", () => {
    expect(formatSlot("HEAD")).toBe("Head")
    expect(formatSlot("MAIN_HAND")).toBe("Main Hand")
    expect(formatSlot("FINGER_1")).toBe("Ring 1")
  })

  it("returns formatted fallback for unknown slot key", () => {
    expect(formatSlot("CUSTOM_SLOT")).toBe("Custom Slot")
    expect(formatSlot("UNKNOWN")).toBe("Unknown")
  })
})

describe("formatSocketType", () => {
  it("capitalizes first letter and lowercases rest", () => {
    expect(formatSocketType("PRISMATIC")).toBe("Prismatic")
    expect(formatSocketType("FIBER")).toBe("Fiber")
  })
})

describe("getStatMeta", () => {
  it("returns label and color for known stat", () => {
    const meta = getStatMeta("HASTE_RATING")
    expect(meta.label).toBe("Haste")
    expect(meta.color).toBe("var(--color-stat-haste)")
  })

  it("returns formatted label and no color for unknown stat", () => {
    const meta = getStatMeta("UNKNOWN_STAT")
    expect(meta.label).toBe("Unknown Stat")
    expect(meta.color).toBeUndefined()
  })
})

describe("isReshiiWraps", () => {
  it("returns false for null", () => {
    expect(isReshiiWraps(null)).toBe(false)
  })

  it("returns false for undefined", () => {
    expect(isReshiiWraps(undefined)).toBe(false)
  })

  it("returns true for matching name", () => {
    expect(isReshiiWraps("Reshii Wraps of the Skybound")).toBe(true)
    expect(isReshiiWraps("reshii wraps")).toBe(true)
  })

  it("returns false for non-matching name", () => {
    expect(isReshiiWraps("Boots of the Warrior")).toBe(false)
  })
})
