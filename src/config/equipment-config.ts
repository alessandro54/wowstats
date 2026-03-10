export const SLOT_LABELS: Record<string, string> = {
  HEAD: "Head",
  NECK: "Neck",
  SHOULDER: "Shoulder",
  BACK: "Back",
  CHEST: "Chest",
  WRIST: "Wrist",
  HANDS: "Hands",
  WAIST: "Waist",
  LEGS: "Legs",
  FEET: "Feet",
  TRINKET_1: "Trinket 1",
  TRINKET_2: "Trinket 2",
  MAIN_HAND: "Main Hand",
  OFF_HAND: "Off Hand",
  FINGER_1: "Ring 1",
  FINGER_2: "Ring 2",
}

export const SLOT_ORDER = [
  "HEAD",
  "NECK",
  "SHOULDER",
  "BACK",
  "CHEST",
  "WRIST",
  "HANDS",
  "WAIST",
  "LEGS",
  "FEET",
  "MAIN_HAND",
  "OFF_HAND",
  "FINGER_1",
  "FINGER_2",
  "TRINKET_1",
  "TRINKET_2",
]

export const QUALITY_COLORS: Record<string, string> = {
  EPIC: "#a335ee",
  RARE: "#0070dd",
  UNCOMMON: "#1eff00",
  POOR: "#9d9d9d",
}

export function formatSlot(slot: string): string {
  return (
    SLOT_LABELS[slot.toUpperCase()] ??
    slot
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")
  )
}

export function formatSocketType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

const STAT_LABELS: Record<string, string> = {
  HASTE_RATING: "Haste",
  CRIT_RATING: "Crit",
  MASTERY_RATING: "Mastery",
  VERSATILITY: "Versatility",
}

const STAT_COLOR_VARS: Record<string, string> = {
  HASTE_RATING: "var(--color-stat-haste)",
  CRIT_RATING: "var(--color-stat-crit)",
  MASTERY_RATING: "var(--color-stat-mastery)",
  VERSATILITY: "var(--color-stat-versatility)",
}

export function getStatMeta(stat: string): {
  label: string
  color?: string
} {
  const label =
    STAT_LABELS[stat] ??
    stat
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ")
  return {
    label,
    color: STAT_COLOR_VARS[stat],
  }
}

export function isReshiiWraps(name: string | null | undefined): boolean {
  return !!name?.toLowerCase().includes("reshii wraps")
}
