import { describe, expect, it } from "vitest"
import {
  getAllSpecs,
  getSpecById,
  getSpecBySlug,
  getSpecCount,
  getSpecFullName,
  getSpecMapById,
  getSpecsByClassSlug,
} from "../specs"

describe("getSpecBySlug", () => {
  it("returns arms spec for warrior/arms", () => {
    const result = getSpecBySlug("warrior", "arms")
    expect(result).toBeTruthy()
    expect(result?.name).toBe("arms")
    expect(result?.id).toBe(71)
  })

  it("returns fire spec for mage/fire", () => {
    const result = getSpecBySlug("mage", "fire")
    expect(result).toBeTruthy()
    expect(result?.name).toBe("fire")
  })

  it("returns null for invalid class slug", () => {
    const result = getSpecBySlug("invalid" as any, "arms")
    expect(result).toBeNull()
  })

  it("returns null for invalid spec slug", () => {
    const result = getSpecBySlug("warrior", "invalid")
    expect(result).toBeNull()
  })
})

describe("getSpecById", () => {
  it("returns arms spec for id 71", () => {
    const result = getSpecById(71)
    expect(result).toBeTruthy()
    expect(result?.spec.name).toBe("arms")
    expect(result?.class.slug).toBe("warrior")
  })

  it("returns null for invalid spec id", () => {
    const result = getSpecById(9999)
    expect(result).toBeNull()
  })

  it("includes both class and spec information", () => {
    const result = getSpecById(71)
    expect(result?.class.name).toBe("Warrior")
    expect(result?.spec.name).toBe("arms")
    expect(result?.spec.iconUrl).toBeTruthy()
  })
})

describe("getSpecsByClassSlug", () => {
  it("returns array of warrior specs", () => {
    const specs = getSpecsByClassSlug("warrior")
    expect(specs).toHaveLength(3)
    const names = specs.map(s => s.name)
    expect(names).toContain("arms")
    expect(names).toContain("fury")
    expect(names).toContain("protection")
  })

  it("returns empty array for invalid class slug", () => {
    const specs = getSpecsByClassSlug("invalid" as any)
    expect(specs).toEqual([])
  })

  it("returns correct number of mage specs", () => {
    const specs = getSpecsByClassSlug("mage")
    expect(specs.length).toBeGreaterThan(0)
    const names = specs.map(s => s.name)
    expect(names).toContain("fire")
    expect(names).toContain("frost")
    expect(names).toContain("arcane")
  })
})

describe("getSpecFullName", () => {
  it("returns 'Arms Warrior' for warrior/arms", () => {
    const result = getSpecFullName("warrior", "arms")
    expect(result).toBe("Arms Warrior")
  })

  it("returns 'Fire Mage' for mage/fire", () => {
    const result = getSpecFullName("mage", "fire")
    expect(result).toBe("Fire Mage")
  })

  it("handles multi-word spec names correctly", () => {
    const result = getSpecFullName("hunter", "beast-mastery")
    expect(result).toBe("Beast Mastery Hunter")
  })

  it("returns empty string for invalid class", () => {
    const result = getSpecFullName("invalid" as any, "arms")
    expect(result).toBe("")
  })

  it("returns empty string for invalid spec", () => {
    const result = getSpecFullName("warrior", "invalid")
    expect(result).toBe("")
  })
})

describe("getSpecMapById", () => {
  it("returns a Map with all specs", () => {
    const map = getSpecMapById()
    expect(map).toBeInstanceOf(Map)
    expect(map.size).toBeGreaterThan(0)
  })

  it("allows O(1) lookup by spec id", () => {
    const map = getSpecMapById()
    const arms = map.get(71)
    expect(arms?.spec.name).toBe("arms")
    expect(arms?.class.slug).toBe("warrior")
  })

  it("returns undefined for invalid spec id", () => {
    const map = getSpecMapById()
    expect(map.get(9999)).toBeUndefined()
  })
})

describe("getAllSpecs", () => {
  it("returns an array of all specs across all classes", () => {
    const specs = getAllSpecs()
    expect(Array.isArray(specs)).toBe(true)
    expect(specs.length).toBeGreaterThan(0)
  })

  it("includes both class and spec information for each entry", () => {
    const specs = getAllSpecs()
    specs.forEach((entry) => {
      expect(entry.class).toBeTruthy()
      expect(entry.spec).toBeTruthy()
      expect(entry.class.name).toBeTruthy()
      expect(entry.spec.name).toBeTruthy()
    })
  })

  it("includes warrior arms", () => {
    const specs = getAllSpecs()
    const arms = specs.find(s => s.class.slug === "warrior" && s.spec.name === "arms")
    expect(arms).toBeTruthy()
  })
})

describe("getSpecCount", () => {
  it("returns a positive number", () => {
    const count = getSpecCount()
    expect(typeof count).toBe("number")
    expect(count).toBeGreaterThan(0)
  })

  it("matches the length of getAllSpecs", () => {
    const count = getSpecCount()
    const specs = getAllSpecs()
    expect(count).toBe(specs.length)
  })

  it("is greater than class count (multiple specs per class)", () => {
    const specCount = getSpecCount()
    // Assuming at least 13 classes with at least 3 specs each
    expect(specCount).toBeGreaterThan(30)
  })
})
