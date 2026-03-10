import type {
  WowClassConfig,
  WowClassSlug,
  WowClassSpec,
} from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

/**
 * Finds a spec by its slug within a specific class
 * @example getSpecBySlug("warrior", "arms")
 */
export function getSpecBySlug(classSlug: WowClassSlug, specSlug: string): WowClassSpec | null {
  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  if (!cls) return null
  return cls.specs.find((s) => s.name === specSlug) ?? null
}

/**
 * Finds a spec by its ID across all classes
 * @example getSpecById(71) // Returns Arms spec
 */
export function getSpecById(specId: number): {
  class: WowClassConfig
  spec: WowClassSpec
} | null {
  for (const cls of WOW_CLASSES) {
    const spec = cls.specs.find((s) => s.id === specId)
    if (spec) {
      return {
        class: cls,
        spec,
      }
    }
  }
  return null
}

/**
 * Gets all specs for a specific class
 * @example getSpecsByClassSlug("warrior") // Returns [Arms, Fury, Protection]
 */
export function getSpecsByClassSlug(classSlug: WowClassSlug): WowClassSpec[] {
  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  return cls?.specs ?? []
}

/**
 * Returns a formatted spec name with class
 * @example getSpecFullName("warrior", "arms") // "Arms Warrior"
 */
export function getSpecFullName(classSlug: WowClassSlug, specSlug: string): string {
  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  const spec = cls?.specs.find((s) => s.name === specSlug)

  if (!cls || !spec) return ""

  // Capitalize spec name
  const specName = spec.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return `${specName} ${cls.name}`
}

/**
 * Creates a Map for O(1) spec lookups by ID
 */
export function getSpecMapById(): Map<
  number,
  {
    class: WowClassConfig
    spec: WowClassSpec
  }
> {
  const map = new Map<
    number,
    {
      class: WowClassConfig
      spec: WowClassSpec
    }
  >()

  for (const cls of WOW_CLASSES) {
    for (const spec of cls.specs) {
      map.set(spec.id, {
        class: cls,
        spec,
      })
    }
  }

  return map
}

/**
 * Returns all specs across all classes
 */
export function getAllSpecs(): Array<{
  class: WowClassConfig
  spec: WowClassSpec
}> {
  const specs: Array<{
    class: WowClassConfig
    spec: WowClassSpec
  }> = []

  for (const cls of WOW_CLASSES) {
    for (const spec of cls.specs) {
      specs.push({
        class: cls,
        spec,
      })
    }
  }

  return specs
}

/**
 * Returns the total number of specs across all classes
 */
export function getSpecCount(): number {
  return WOW_CLASSES.reduce((sum, cls) => sum + cls.specs.length, 0)
}
