import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { TopPlayer } from "@/lib/api"
import { LeaderboardPagination, LeaderboardRow, LeaderboardTh } from "../row"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
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

describe("LeaderboardRow", () => {
  it("renders the player name", () => {
    const { container } = render(
      <table>
        <tbody>
          <LeaderboardRow player={player} onClick={vi.fn()} />
        </tbody>
      </table>,
    )
    expect(container.textContent).toContain("Cdew")
  })
})

describe("LeaderboardTh", () => {
  it("renders the header text", () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <LeaderboardTh>Player</LeaderboardTh>
          </tr>
        </thead>
      </table>,
    )
    expect(container.textContent).toContain("Player")
  })
})

describe("LeaderboardPagination", () => {
  it("renders prev/next when there are multiple pages", () => {
    const { container } = render(
      <LeaderboardPagination page={2} totalPages={3} onChange={vi.fn()} />,
    )
    expect(container.textContent).toContain("Prev")
    expect(container.textContent).toContain("Next")
  })

  it("renders nothing when there is a single page", () => {
    const { container } = render(
      <LeaderboardPagination page={1} totalPages={1} onChange={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })
})
