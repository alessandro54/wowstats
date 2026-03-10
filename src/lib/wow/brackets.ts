import type { BracketSlug } from "@/config/wow/brackets-config"
import { BRACKETS } from "@/config/wow/brackets-config"

/**
 * Gets bracket config by slug
 * @example getBracketBySlug("3v3")
 */
export function getBracketBySlug(slug: BracketSlug) {
  return BRACKETS.find((b) => b.slug === slug) ?? null
}

/**
 * Returns all brackets
 */
export function getAllBrackets() {
  return BRACKETS
}

/**
 * Returns all bracket slugs
 */
export function getAllBracketSlugs(): BracketSlug[] {
  return BRACKETS.map((b) => b.slug)
}

/**
 * Checks if a string is a valid bracket slug
 */
export function isValidBracketSlug(slug: string): slug is BracketSlug {
  return BRACKETS.some((b) => b.slug === slug)
}

/**
 * Gets bracket label
 * @example getBracketLabel("3v3") // "3v3"
 */
export function getBracketLabel(slug: BracketSlug): string {
  const bracket = getBracketBySlug(slug)
  return bracket?.label ?? slug
}

/**
 * Gets bracket description
 * @example getBracketDescription("shuffle") // "6-player round-robin arena"
 */
export function getBracketDescription(slug: BracketSlug): string {
  const bracket = getBracketBySlug(slug)
  return bracket?.description ?? ""
}
