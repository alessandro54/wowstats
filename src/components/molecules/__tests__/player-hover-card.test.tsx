import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { TopPlayer } from "@/lib/api"
import { PlayerHoverCard } from "../player-hover-card"

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

describe("PlayerHoverCard", () => {
  it("renders the trigger row containing children", () => {
    const { container } = render(
      <table>
        <tbody>
          <PlayerHoverCard player={player}>
            <td>cell</td>
          </PlayerHoverCard>
        </tbody>
      </table>,
    )
    expect(container.querySelector("td")?.textContent).toBe("cell")
  })

  it("does not render the floating card before hover", () => {
    const { queryByTestId } = render(
      <table>
        <tbody>
          <PlayerHoverCard player={player}>
            <td>cell</td>
          </PlayerHoverCard>
        </tbody>
      </table>,
    )
    expect(queryByTestId("player-hover-card")).toBeNull()
  })
})
