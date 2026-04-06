import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaStatsEntry } from "../meta-stats-table"
import type { SpecBracketData } from "../meta-tier-list"
import { MetaTierList } from "../meta-tier-list"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/components/providers/hover-provider", () => ({
  useHoverSlug: vi.fn(() => null),
  useSetHoverSlug: vi.fn(() => vi.fn()),
}))

vi.mock("@/components/ui/hover-card", () => ({
  HoverCard: ({ children }: any) => <div data-testid="hover-card">{children}</div>,
  HoverCardTrigger: ({ children, asChild }: any) => (
    <div data-testid="hover-card-trigger">{children}</div>
  ),
  HoverCardContent: ({ children }: any) => <div data-testid="hover-card-content">{children}</div>,
}))

function makeEntry(
  key: string,
  specName: string,
  className: string,
  tier: MetaStatsEntry["tier"],
  specUrl: string,
  iconUrl?: string,
): MetaStatsEntry {
  return {
    key,
    specName,
    className,
    role: "dps",
    score: 0.8,
    normPct: 90,
    tier,
    thetaHat: 2100,
    ratingCiLow: 2000,
    ratingCiHigh: 2200,
    meanRating: 2100,
    wrHat: 0.53,
    presence: 0.12,
    bK: 0.9,
    color: "#C69B6D",
    iconUrl,
    specUrl,
  }
}

const entries: MetaStatsEntry[] = [
  makeEntry("warrior-arms", "arms", "warrior", "S+", "/pvp/warrior/arms", "/icons/arms.png"),
  makeEntry("mage-fire", "fire", "mage", "S", "/pvp/mage/fire", "/icons/fire.png"),
  makeEntry("druid-balance", "balance", "druid", "A", "/pvp/druid/balance"),
  makeEntry("paladin-ret", "retribution", "paladin", "B", "/pvp/paladin/retribution"),
]

const bracketComparison = new Map<string, SpecBracketData>([
  [
    "warrior-arms",
    {
      specId: "warrior-arms",
      ranks: [
        {
          bracket: "3v3",
          label: "3v3",
          tier: "S+",
          score: 0.95,
          rank: 1,
        },
        {
          bracket: "2v2",
          label: "2v2",
          tier: "S",
          score: 0.82,
          rank: 2,
        },
      ],
    },
  ],
  [
    "mage-fire",
    {
      specId: "mage-fire",
      ranks: [
        {
          bracket: "3v3",
          label: "3v3",
          tier: "S",
          score: 0.78,
          rank: 3,
        },
      ],
    },
  ],
])

describe("MetaTierList", () => {
  it("renders without crashing with entries", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    expect(container.firstChild).toBeDefined()
  })

  it("renders tier labels for tiers that have entries", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    expect(container.textContent).toContain("S+")
    expect(container.textContent).toContain("S")
    expect(container.textContent).toContain("A")
    expect(container.textContent).toContain("B")
  })

  it("renders tier description labels", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    expect(container.textContent).toContain("Broken")
    expect(container.textContent).toContain("Optimal")
    expect(container.textContent).toContain("Strong")
    expect(container.textContent).toContain("Viable")
  })

  it("does not render tier rows for empty tiers", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    // C and D tiers have no entries, their labels should not appear
    expect(container.textContent).not.toContain("Niche")
    expect(container.textContent).not.toContain("Weak")
  })

  it("renders spec icons with alt text", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    const images = container.querySelectorAll("img")
    expect(images.length).toBeGreaterThan(0)
  })

  it("renders spec links pointing to correct URLs", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    const links = container.querySelectorAll("a")
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"))
    expect(hrefs).toContain("/pvp/warrior/arms")
    expect(hrefs).toContain("/pvp/mage/fire")
    expect(hrefs).toContain("/pvp/druid/balance")
  })

  it("renders a placeholder div for entries without iconUrl", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    // druid-balance has no iconUrl, so a fallback div should be rendered
    const divs = container.querySelectorAll("div.h-12.w-12.rounded-lg")
    expect(divs.length).toBeGreaterThan(0)
  })

  it("renders nothing when entries array is empty", () => {
    const { container } = render(
      <MetaTierList entries={[]} bracketComparison={new Map()} currentBracket="3v3" />,
    )
    // All tier groups empty — the inner content is blank
    const tierRows = container.querySelectorAll("[data-testid='hover-card']")
    expect(tierRows.length).toBe(0)
  })

  it("renders comparison data in hover card content", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={bracketComparison} currentBracket="3v3" />,
    )
    const contents = container.querySelectorAll("[data-testid='hover-card-content']")
    expect(contents.length).toBeGreaterThan(0)
    // At least one hover card should show rank info from bracketComparison
    const allText = container.textContent ?? ""
    expect(allText).toContain("3v3")
  })

  it("shows 'No cross-bracket data' for specs without comparison", () => {
    const { container } = render(
      <MetaTierList entries={entries} bracketComparison={new Map()} currentBracket="3v3" />,
    )
    expect(container.textContent).toContain("No cross-bracket data")
  })
})
