import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { LeaderboardResponse } from "@/lib/api"
import { LeaderboardView } from "../leaderboard-view"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}))

const data: LeaderboardResponse = {
  bracket: "3v3",
  spec_id: null,
  class_slug: null,
  regions: [
    "us",
    "eu",
  ],
  query: null,
  page: 1,
  per_page: 50,
  total: 0,
  total_pages: 1,
  players: [],
  snapshot_at: null,
}

describe("LeaderboardView", () => {
  it("renders the bracket header label", () => {
    const { container } = render(<LeaderboardView bracket="3v3" data={data} />)
    expect(container.textContent).toContain("3v3")
  })

  it("shows the empty-state message when no players match", () => {
    const { container } = render(<LeaderboardView bracket="3v3" data={data} />)
    expect(container.textContent).toContain("No players found")
  })
})
