import { describe, expect, it } from "vitest"
import {
  getAllClasses,
  getAllClassSlugs,
  getClassCount,
  getWowClassById,
  getWowClassBySlug,
  getWowClassMap,
  getWowClassMapById,
} from "../classes"

describe("getWowClassBySlug", () => {
  it("returns warrior config for warrior slug", () => {
    const result = getWowClassBySlug("warrior")
    expect(result).toBeTruthy()
    expect(result?.name).toBe("Warrior")
    expect(result?.slug).toBe("warrior")
    expect(result?.id).toBe(1)
  })

  it("returns mage config for mage slug", () => {
    const result = getWowClassBySlug("mage")
    expect(result).toBeTruthy()
    expect(result?.name).toBe("Mage")
    expect(result?.slug).toBe("mage")
  })

  it("returns null for invalid slug", () => {
    const result = getWowClassBySlug("invalid" as any)
    expect(result).toBeNull()
  })

  it("includes specs array", () => {
    const result = getWowClassBySlug("warrior")
    expect(result?.specs).toHaveLength(3)
    expect(result?.specs[0].name).toBe("arms")
  })
})

describe("getWowClassById", () => {
  it("returns warrior config for id 1", () => {
    const result = getWowClassById(1)
    expect(result).toBeTruthy()
    expect(result?.name).toBe("Warrior")
    expect(result?.id).toBe(1)
  })

  it("returns mage config for id 8", () => {
    const result = getWowClassById(8)
    expect(result).toBeTruthy()
    expect(result?.name).toBe("Mage")
  })

  it("returns null for invalid id", () => {
    const result = getWowClassById(9999)
    expect(result).toBeNull()
  })
})

describe("getWowClassMap", () => {
  it("returns a Map with all classes", () => {
    const map = getWowClassMap()
    expect(map).toBeInstanceOf(Map)
    expect(map.size).toBeGreaterThan(0)
  })

  it("allows O(1) lookup by slug", () => {
    const map = getWowClassMap()
    const warrior = map.get("warrior")
    expect(warrior?.name).toBe("Warrior")
  })

  it("returns undefined for invalid slug", () => {
    const map = getWowClassMap()
    expect(map.get("invalid" as any)).toBeUndefined()
  })
})

describe("getWowClassMapById", () => {
  it("returns a Map with all classes indexed by id", () => {
    const map = getWowClassMapById()
    expect(map).toBeInstanceOf(Map)
    expect(map.size).toBeGreaterThan(0)
  })

  it("allows O(1) lookup by id", () => {
    const map = getWowClassMapById()
    const warrior = map.get(1)
    expect(warrior?.name).toBe("Warrior")
  })
})

describe("getAllClasses", () => {
  it("returns an array of all classes", () => {
    const classes = getAllClasses()
    expect(Array.isArray(classes)).toBe(true)
    expect(classes.length).toBeGreaterThan(0)
  })

  it("includes expected classes", () => {
    const classes = getAllClasses()
    const slugs = classes.map((c) => c.slug)
    expect(slugs).toContain("warrior")
    expect(slugs).toContain("mage")
    expect(slugs).toContain("paladin")
  })
})

describe("getAllClassSlugs", () => {
  it("returns an array of class slugs", () => {
    const slugs = getAllClassSlugs()
    expect(Array.isArray(slugs)).toBe(true)
    expect(slugs.length).toBeGreaterThan(0)
  })

  it("contains only string slugs", () => {
    const slugs = getAllClassSlugs()
    slugs.forEach((slug) => {
      expect(typeof slug).toBe("string")
    })
  })

  it("includes warrior and mage", () => {
    const slugs = getAllClassSlugs()
    expect(slugs).toContain("warrior")
    expect(slugs).toContain("mage")
  })
})

describe("getClassCount", () => {
  it("returns a positive number", () => {
    const count = getClassCount()
    expect(typeof count).toBe("number")
    expect(count).toBeGreaterThan(0)
  })

  it("matches the length of getAllClasses", () => {
    const count = getClassCount()
    const classes = getAllClasses()
    expect(count).toBe(classes.length)
  })
})
