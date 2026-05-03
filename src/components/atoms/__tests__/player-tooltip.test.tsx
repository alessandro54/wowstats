import { describe, expect, it } from "vitest"
import type { TopPlayer } from "@/lib/api"
import { characterUrl } from "../player-tooltip"

const player: TopPlayer = {
  name: "Cdew",
  realm: "Tichondrius",
  region: "us",
  rating: 2450,
  wins: 200,
  losses: 80,
  rank: 1,
  score: 2800,
  avatar_url: null,
  class_slug: "shaman",
}

describe("characterUrl", () => {
  it("returns correct URL format", () => {
    expect(characterUrl(player)).toBe("/character/us/tichondrius/cdew")
  })

  it("handles multi-word realms", () => {
    expect(
      characterUrl({
        ...player,
        realm: "Bleeding Hollow",
      }),
    ).toBe("/character/us/bleeding-hollow/cdew")
  })
})
