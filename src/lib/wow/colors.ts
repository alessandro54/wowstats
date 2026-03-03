import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

/**
 * Gets the hex color for a class
 * @example getClassColor("warrior") // "#C69B6D"
 */
export function getClassColor(classSlug: WowClassSlug): string {
  const cls = WOW_CLASSES.find(c => c.slug === classSlug)
  return cls?.color ?? "#FFFFFF"
}

/**
 * Gets the OKLCH color for a class
 * @example getClassColorOklch("warrior") // "oklch(0.6431 0.2243 37.45)"
 */
export function getClassColorOklch(classSlug: WowClassSlug): string {
  const cls = WOW_CLASSES.find(c => c.slug === classSlug)
  return cls?.colorOlkch ?? "oklch(1 0 0)"
}

/**
 * Gets the background gradient for a class (if available)
 * @example getClassBgGradient("warrior")
 */
export function getClassBgGradient(classSlug: WowClassSlug): string | undefined {
  const cls = WOW_CLASSES.find(c => c.slug === classSlug)
  return cls?.bgGradient
}

/**
 * Gets the spec-specific color in OKLCH format (if available), otherwise falls back to class color
 * @example getSpecColor("warrior", "arms")
 */
export function getSpecColor(classSlug: WowClassSlug, specSlug: string): string {
  const cls = WOW_CLASSES.find(c => c.slug === classSlug)
  const spec = cls?.specs.find(s => s.name === specSlug)

  return spec?.colorOlkch ?? cls?.colorOlkch ?? "oklch(1 0 0)"
}

/**
 * Creates a CSS custom property string for a class color
 * @example getClassColorVar("warrior") // "--class-color: #C69B6D;"
 */
export function getClassColorVar(classSlug: WowClassSlug, varName = "class-color"): string {
  const color = getClassColor(classSlug)
  return `--${varName}: ${color};`
}

/**
 * Creates an object with all color formats for a class
 */
export function getClassColors(classSlug: WowClassSlug) {
  const cls = WOW_CLASSES.find(c => c.slug === classSlug)

  return {
    hex: cls?.color ?? "#FFFFFF",
    oklch: cls?.colorOlkch ?? "oklch(1 0 0)",
    gradient: cls?.bgGradient,
  }
}
