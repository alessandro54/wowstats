import { describe, expect, it } from "vitest"
import {
  getAllBrackets,
  getAllBracketSlugs,
  getBracketBySlug,
  getBracketDescription,
  getBracketLabel,
  isValidBracketSlug,
} from "../brackets"

describe("getBracketBySlug", () => {
  it("returns 3v3 bracket config", () => {
    const bracket = getBracketBySlug("3v3")
    expect(bracket).toBeTruthy()
    expect(bracket?.slug).toBe("3v3")
    expect(bracket?.label).toBe("3v3")
  })

  it("returns 2v2 bracket config", () => {
    const bracket = getBracketBySlug("2v2")
    expect(bracket).toBeTruthy()
    expect(bracket?.slug).toBe("2v2")
  })

  it("returns shuffle bracket config", () => {
    const bracket = getBracketBySlug("shuffle")
    expect(bracket).toBeTruthy()
    expect(bracket?.slug).toBe("shuffle")
    expect(bracket?.label).toBe("Solo")
  })

  it("returns null for invalid slug", () => {
    const bracket = getBracketBySlug("invalid" as any)
    expect(bracket).toBeNull()
  })
})

describe("getAllBrackets", () => {
  it("returns array of all brackets", () => {
    const brackets = getAllBrackets()
    expect(Array.isArray(brackets)).toBe(true)
    expect(brackets.length).toBeGreaterThan(0)
  })

  it("includes expected brackets", () => {
    const brackets = getAllBrackets()
    const slugs = brackets.map(b => b.slug)
    expect(slugs).toContain("2v2")
    expect(slugs).toContain("3v3")
    expect(slugs).toContain("shuffle")
    expect(slugs).toContain("rbg")
  })

  it("each bracket has required properties", () => {
    const brackets = getAllBrackets()
    brackets.forEach((bracket) => {
      expect(bracket).toHaveProperty("slug")
      expect(bracket).toHaveProperty("label")
      expect(bracket).toHaveProperty("description")
    })
  })
})

describe("getAllBracketSlugs", () => {
  it("returns array of bracket slugs", () => {
    const slugs = getAllBracketSlugs()
    expect(Array.isArray(slugs)).toBe(true)
    expect(slugs.length).toBeGreaterThan(0)
  })

  it("includes all expected slugs", () => {
    const slugs = getAllBracketSlugs()
    expect(slugs).toContain("2v2")
    expect(slugs).toContain("3v3")
    expect(slugs).toContain("shuffle")
    expect(slugs).toContain("rbg")
  })

  it("contains only strings", () => {
    const slugs = getAllBracketSlugs()
    slugs.forEach((slug) => {
      expect(typeof slug).toBe("string")
    })
  })
})

describe("isValidBracketSlug", () => {
  it("returns true for valid bracket slugs", () => {
    expect(isValidBracketSlug("2v2")).toBe(true)
    expect(isValidBracketSlug("3v3")).toBe(true)
    expect(isValidBracketSlug("shuffle")).toBe(true)
    expect(isValidBracketSlug("rbg")).toBe(true)
  })

  it("returns false for invalid bracket slug", () => {
    expect(isValidBracketSlug("invalid")).toBe(false)
    expect(isValidBracketSlug("5v5")).toBe(false)
    expect(isValidBracketSlug("")).toBe(false)
  })
})

describe("getBracketLabel", () => {
  it("returns correct label for 3v3", () => {
    const label = getBracketLabel("3v3")
    expect(label).toBe("3v3")
  })

  it("returns 'Solo' label for shuffle", () => {
    const label = getBracketLabel("shuffle")
    expect(label).toBe("Solo")
  })

  it("returns 'RBG' label for rbg", () => {
    const label = getBracketLabel("rbg")
    expect(label).toBe("RBG")
  })

  it("returns slug as fallback for invalid bracket", () => {
    const label = getBracketLabel("invalid" as any)
    expect(label).toBe("invalid")
  })
})

describe("getBracketDescription", () => {
  it("returns description for 3v3", () => {
    const desc = getBracketDescription("3v3")
    expect(desc).toBe("Three vs Three Arena")
  })

  it("returns description for shuffle", () => {
    const desc = getBracketDescription("shuffle")
    expect(desc).toBe("6-player round-robin arena")
  })

  it("returns description for rbg", () => {
    const desc = getBracketDescription("rbg")
    expect(desc).toBe("Rated Battleground")
  })

  it("returns empty string for invalid bracket", () => {
    const desc = getBracketDescription("invalid" as any)
    expect(desc).toBe("")
  })
})
