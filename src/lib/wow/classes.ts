import type { WowClassConfig, WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

/**
 * Finds a WoW class by its slug
 * @example getWowClassBySlug("warrior") // Returns warrior config
 */
export function getWowClassBySlug(slug: WowClassSlug): WowClassConfig | null {
  return WOW_CLASSES.find((c) => c.slug === slug) ?? null
}

/**
 * Finds a WoW class by its ID
 * @example getWowClassById(1) // Returns warrior config
 */
export function getWowClassById(id: number): WowClassConfig | null {
  return WOW_CLASSES.find((c) => c.id === id) ?? null
}

/**
 * Creates a Map for O(1) lookups by class slug.
 * Useful when you need to look up multiple classes in a loop.
 * @example
 * const classMap = getWowClassMap();
 * const warrior = classMap.get("warrior");
 */
export function getWowClassMap(): Map<WowClassSlug, WowClassConfig> {
  return new Map(
    WOW_CLASSES.map((c) => [
      c.slug,
      c,
    ]),
  )
}

/**
 * Creates a Map for O(1) lookups by class ID
 */
export function getWowClassMapById(): Map<number, WowClassConfig> {
  return new Map(
    WOW_CLASSES.map((c) => [
      c.id,
      c,
    ]),
  )
}

/**
 * Returns all class configs
 */
export function getAllClasses(): WowClassConfig[] {
  return WOW_CLASSES
}

/**
 * Returns all class slugs
 */
export function getAllClassSlugs(): WowClassSlug[] {
  return WOW_CLASSES.map((c) => c.slug)
}

/**
 * Returns the number of classes
 */
export function getClassCount(): number {
  return WOW_CLASSES.length
}
