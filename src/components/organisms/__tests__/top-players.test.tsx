import type { TopPlayer } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TopPlayers } from "../top-players"

vi.mock("@/components/atoms/sliding-switch", () => ({
  SlidingSwitch: ({ options, value, onValueChange }: any) => (
    <div data-testid="region-switch">
      {options.map((o: any) => (
        <button key={o.value} onClick={() => onValueChange(o.value)}>
          {o.value}
        </button>
      ))}
    </div>
  ),
}))

vi.mock("@/components/molecules/player-row", () => ({
  PlayerRow: ({ player, index }: any) => <div data-testid={`player-${index}`}>{player.name}</div>,
}))

vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
}))

function makePlayer(name: string, region: string): TopPlayer {
  return {
    name,
    realm: "Tichondrius",
    region,
    rating: 2400,
    wins: 100,
    losses: 50,
    rank: 1,
    score: 2600,
    avatar_url: null,
    class_slug: "warrior",
  }
}

const playersByRegion = {
  all: [
    makePlayer("Cdew", "us"),
    makePlayer("Whaazz", "eu"),
  ],
  us: [
    makePlayer("Cdew", "us"),
  ],
  eu: [
    makePlayer("Whaazz", "eu"),
  ],
}

describe("topPlayers", () => {
  it("renders Top Players heading", () => {
    const { container } = render(<TopPlayers playersByRegion={playersByRegion} />)
    expect(container.textContent).toContain("Top Players")
  })

  it("renders player rows for all region", () => {
    const { getByTestId } = render(<TopPlayers playersByRegion={playersByRegion} />)
    expect(getByTestId("player-0").textContent).toBe("Cdew")
    expect(getByTestId("player-1").textContent).toBe("Whaazz")
  })

  it("renders region switch", () => {
    const { getByTestId } = render(<TopPlayers playersByRegion={playersByRegion} />)
    expect(getByTestId("region-switch")).toBeInTheDocument()
  })

  it("returns null when all players empty", () => {
    const { container } = render(
      <TopPlayers
        playersByRegion={{
          all: [],
          us: [],
          eu: [],
        }}
      />,
    )
    expect(container.innerHTML).toBe("")
  })
})
