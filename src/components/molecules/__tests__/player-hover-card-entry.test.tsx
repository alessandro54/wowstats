import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { CharacterProfile } from "@/lib/api"
import { bracketOrder, PlayerEntryRow } from "../player-hover-card-entry"

const baseEntry: CharacterProfile["pvp_entries"][number] = {
  bracket: "3v3",
  region: "us",
  rating: 2400,
  wins: 100,
  losses: 50,
  rank: 5,
  spec_id: 262,
}

describe("bracketOrder", () => {
  it("sorts arenas before solo brackets", () => {
    expect(bracketOrder("2v2")).toBeLessThan(bracketOrder("3v3"))
    expect(bracketOrder("3v3")).toBeLessThan(bracketOrder("shuffle-frost-mage"))
    expect(bracketOrder("shuffle-frost-mage")).toBeLessThan(bracketOrder("blitz-arms-warrior"))
  })
})

describe("PlayerEntryRow", () => {
  it("renders rating and W-L stats", () => {
    const { container } = render(<PlayerEntryRow entry={baseEntry} fallbackClass={undefined} />)
    expect(container.textContent).toContain("2400")
    expect(container.textContent).toContain("100-50")
  })
})
