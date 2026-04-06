import type { TopPlayer } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TopPlayers } from "../top-players"

vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => "/pvp/warrior/arms/2v2"),
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

  it("renders player names", () => {
    const { container } = render(<TopPlayers playersByRegion={playersByRegion} />)
    expect(container.textContent).toContain("Cdew")
    expect(container.textContent).toContain("Whaazz")
  })

  it("renders region buttons", () => {
    const { container } = render(<TopPlayers playersByRegion={playersByRegion} />)
    const buttons = container.querySelectorAll("button")
    expect(buttons.length).toBeGreaterThan(0)
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
