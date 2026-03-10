import type { TopPlayer } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PlayerTooltip, characterUrl } from "../player-tooltip"

vi.mock("@/lib/utils", () => ({
  formatRealm: (r: string) => r,
  titleizeSlug: (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
  winRate: () => "55.0%",
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}))

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

describe("playerTooltip", () => {
  it("renders player name", () => {
    const { container } = render(<PlayerTooltip player={player} />)
    expect(container.textContent).toContain("Cdew")
  })

  it("renders realm and region", () => {
    const { container } = render(<PlayerTooltip player={player} />)
    expect(container.textContent).toContain("Tichondrius")
    expect(container.textContent).toContain("US")
  })

  it("renders rating", () => {
    const { container } = render(<PlayerTooltip player={player} />)
    expect(container.textContent).toContain("2450")
  })

  it("renders W/L record", () => {
    const { container } = render(<PlayerTooltip player={player} />)
    expect(container.textContent).toContain("200/80")
  })

  it("renders rank", () => {
    const { container } = render(<PlayerTooltip player={player} />)
    expect(container.textContent).toContain("1")
  })

  it("renders dash when rank is null", () => {
    const { container } = render(
      <PlayerTooltip
        player={{
          ...player,
          rank: null,
        }}
      />,
    )
    expect(container.textContent).toContain("—")
  })

  it("renders class name", () => {
    const { container } = render(<PlayerTooltip player={player} />)
    expect(container.textContent).toContain("Shaman")
  })
})
