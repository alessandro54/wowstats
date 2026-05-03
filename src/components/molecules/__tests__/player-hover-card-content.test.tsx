import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { CharacterProfile } from "@/lib/api"
import { PlayerHoverFloatingCard } from "../player-hover-card-content"

const profile: CharacterProfile = {
  name: "Cdew",
  realm: "tichondrius",
  region: "us",
  class_slug: "shaman",
  race: null,
  faction: null,
  avatar_url: null,
  inset_url: null,
  primary_spec_id: null,
  stat_pcts: {},
  pvp_entries: [
    {
      bracket: "3v3",
      region: "us",
      rating: 2400,
      wins: 100,
      losses: 50,
      rank: 5,
      spec_id: 262,
    },
  ],
  equipment: [],
  talents: [],
  talent_loadout_code: null,
}

describe("PlayerHoverFloatingCard", () => {
  it("renders the player name into the document", () => {
    const { baseElement } = render(
      <PlayerHoverFloatingCard profile={profile} x={0} y={0} interactive={false} />,
    )
    expect(baseElement.textContent).toContain("Cdew")
  })

  it("renders the active queues section when entries exist", () => {
    const { baseElement } = render(
      <PlayerHoverFloatingCard profile={profile} x={0} y={0} interactive={false} />,
    )
    expect(baseElement.textContent?.toLowerCase()).toContain("active queues")
  })
})
