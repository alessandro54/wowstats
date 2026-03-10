/**
 * WoW utility library - centralized access to all WoW-related utilities
 *
 * @example
 * import { getWowClassBySlug, getSpecFullName, getClassColor } from "@/lib/wow";
 */

// Re-export all bracket utilities
export {
  getAllBrackets,
  getAllBracketSlugs,
  getBracketBySlug,
  getBracketDescription,
  getBracketLabel,
  isValidBracketSlug,
} from "./brackets"

// Re-export all class utilities
export { getWowClassBySlug } from "./classes"

// Re-export all color utilities
export {
  getClassBgGradient,
  getClassColor,
  getClassColorVar,
} from "./colors"

// Re-export all spec utilities
export {
  getAllSpecs,
  getSpecById,
  getSpecBySlug,
  getSpecCount,
  getSpecFullName,
  getSpecMapById,
  getSpecsByClassSlug,
} from "./specs"

export type { BracketSlug } from "@/config/wow/brackets-config"

// Re-export types from config
export type {
  WowClassConfig,
  WowClassSlug,
  WowClassSpec,
  WowClassSpecSlug,
} from "@/config/wow/classes/classes-config"
