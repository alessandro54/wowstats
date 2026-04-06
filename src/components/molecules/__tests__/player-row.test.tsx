import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { TopPlayer } from "@/lib/api"
import { PlayerRow } from "../player-row"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock("@/hooks/use-active-color", () => ({
  classColor: () => "#c79c6e",
}))

vi.mock("@/components/atoms/clickable-tooltip", () => ({
  ClickableTooltip: ({ children }: any) => <div>{children}</div>,
}))

vi.mock("@/components/atoms/player-tooltip", () => ({
  PlayerTooltip: () => <div />,
  characterUrl: () => "/character/us/tichondrius/cdew",
}))

vi.mock("@/lib/utils", () => ({
  formatRealm: (r: string) => r,
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
  avatar_url: "https://example.com/avatar.jpg",
  class_slug: "shaman",
}

describe("playerRow", () => {
  it("renders player name", () => {
    const { container } = render(<PlayerRow player={player} index={0} />)
    expect(container.textContent).toContain("Cdew")
  })

  it("renders rating", () => {
    const { container } = render(<PlayerRow player={player} index={0} />)
    expect(container.textContent).toContain("2450")
  })

  it("renders W/L record", () => {
    const { container } = render(<PlayerRow player={player} index={0} />)
    expect(container.textContent).toContain("200/80")
  })

  it("renders region badge", () => {
    const { container } = render(<PlayerRow player={player} index={0} />)
    expect(container.textContent).toContain("US")
  })

  it("renders avatar when present", () => {
    const { container } = render(<PlayerRow player={player} index={0} />)
    expect(container.querySelector("img")).toBeInTheDocument()
  })

  it("renders index as rank", () => {
    const { container } = render(<PlayerRow player={player} index={4} />)
    expect(container.textContent).toContain("05")
  })
})
