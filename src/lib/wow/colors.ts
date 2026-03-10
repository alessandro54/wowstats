import type { WowClassSlug } from "@/config/wow/classes/classes-config"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"

/**
 * Gets the CSS variable color for a class
 * @example getClassColor("warrior") // "var(--color-class-warrior)"
 */
export function getClassColor(classSlug: WowClassSlug): string {
  return `var(--color-class-${classSlug})`
}

/**
 * Gets the background gradient for a class (if available)
 * @example getClassBgGradient("warrior")
 */
export function getClassBgGradient(classSlug: WowClassSlug): string | undefined {
  const cls = WOW_CLASSES.find((c) => c.slug === classSlug)
  return cls?.bgGradient
}

/**
 * Creates a CSS custom property string for a class color
 * @example getClassColorVar("warrior") // "--class-color: var(--color-class-warrior);"
 */
export function getClassColorVar(classSlug: WowClassSlug, varName = "class-color"): string {
  const color = getClassColor(classSlug)
  return `--${varName}: ${color};`
}
