import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { BracketSummary } from "../home-bracket-cards"
import { HomeBracketCards } from "../home-bracket-cards"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useHoverSlug: vi.fn(() => null),
}))

const brackets: BracketSummary[] = [
  {
    bracket: "2v2",
    label: "2v2",
    totalEntries: 2418,
    href: "/pvp/meta/2v2/dps",
    topSpecs: [
      {
        specName: "subtlety",
        className: "rogue",
        iconUrl: "/icons/sub.png",
        color: "yellow",
      },
      {
        specName: "windwalker",
        className: "monk",
        iconUrl: "/icons/ww.png",
        color: "green",
      },
      {
        specName: "beast-mastery",
        className: "hunter",
        iconUrl: "/icons/bm.png",
        color: "lime",
      },
    ],
  },
]

describe("HomeBracketCards", () => {
  it("renders bracket label and player count", () => {
    render(<HomeBracketCards brackets={brackets} />)
    expect(screen.getByText("2v2")).toBeDefined()
    expect(
      screen.getAllByText((_, el) => el?.tagName === "SPAN" && el?.textContent === "2,418 players")
        .length,
    ).toBeGreaterThan(0)
  })

  it("renders top spec icons", () => {
    render(<HomeBracketCards brackets={brackets} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs.length).toBeGreaterThanOrEqual(3)
  })

  it("links to meta page", () => {
    render(<HomeBracketCards brackets={brackets} />)
    const link = screen.getByRole("link")
    expect(link.getAttribute("href")).toBe("/pvp/meta/2v2/dps")
  })
})
