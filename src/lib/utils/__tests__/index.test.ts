import { describe, expect, it } from "vitest"
import { cn, formatBracket, formatRealm, titleizeSlug, winRate } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("base", (false as boolean) && "hidden", "active")).toBe("base active")
  })

  it("deduplicates tailwind classes", () => {
    expect(cn("p-4", "p-2")).toBe("p-2")
  })
})

describe("titleizeSlug", () => {
  it("converts hyphenated slug", () => {
    expect(titleizeSlug("death-knight")).toBe("Death Knight")
  })

  it("converts underscored slug", () => {
    expect(titleizeSlug("demon_hunter")).toBe("Demon Hunter")
  })

  it("handles single word", () => {
    expect(titleizeSlug("warrior")).toBe("Warrior")
  })

  it("handles mixed case input", () => {
    expect(titleizeSlug("FROST")).toBe("Frost")
  })
})

describe("formatRealm", () => {
  it("formats realm slug", () => {
    expect(formatRealm("twisting-nether")).toBe("Twisting Nether")
  })
})

describe("winRate", () => {
  it("calculates win percentage", () => {
    expect(winRate(73, 27)).toBe("73%")
  })

  it("returns dash for zero games", () => {
    expect(winRate(0, 0)).toBe("—")
  })

  it("rounds to nearest integer", () => {
    expect(winRate(2, 1)).toBe("67%")
  })
})

describe("formatBracket", () => {
  it("formats 2v2", () => {
    expect(formatBracket("2v2")).toBe("2v2 Arena")
  })

  it("formats 3v3", () => {
    expect(formatBracket("3v3")).toBe("3v3 Arena")
  })

  it("formats shuffle brackets", () => {
    expect(formatBracket("shuffle")).toBe("Solo Shuffle")
    expect(formatBracket("shuffle-warrior-arms")).toBe("Solo Shuffle")
  })

  it("formats blitz brackets", () => {
    expect(formatBracket("blitz")).toBe("Blitz")
  })

  it("uppercases unknown brackets", () => {
    expect(formatBracket("rbg")).toBe("RBG")
  })
})
