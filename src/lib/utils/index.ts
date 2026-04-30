import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Converts slugs like "death-knight" or "demon_hunter" → "Death Knight" */
export function titleizeSlug(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

/** "Twisting Nether" or "twisting-nether" → "Twisting Nether" */
export function formatRealm(realm: string): string {
  return titleizeSlug(realm)
}

/** Returns "73%" or "—" when no games played */
export function winRate(wins: number, losses: number): string {
  const total = wins + losses
  if (total === 0) return "—"
  return `${Math.round((wins / total) * 100)}%`
}

/** "2v2" | "3v3" | "rbg" | "shuffle-*" | "blitz-*" → human-readable label */
export function formatBracket(bracket: string): string {
  if (bracket === "shuffle" || bracket.startsWith("shuffle-")) return "Solo Shuffle"
  if (bracket === "blitz" || bracket.startsWith("blitz-")) return "Blitz"
  if (bracket === "2v2") return "2v2 Arena"
  if (bracket === "3v3") return "3v3 Arena"
  return bracket.toUpperCase()
}
