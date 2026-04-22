import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaEnchant, MetaGem, MetaItem } from "@/lib/api"
import type { EnchantGroup } from "../item-card"
import { ItemCard } from "../item-card"

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
  default: (props: any) => <img {...props} />,
}))

vi.mock("@/components/atoms/clickable-tooltip", () => ({
  ClickableTooltip: ({ children, content }: any) => (
    <div data-testid="tooltip-wrapper">
      {children}
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
}))

vi.mock("@/components/molecules/distribution-tooltip", () => ({
  DistributionTooltip: ({ entries, enchantEntries, craftingStats, fiberGems }: any) => (
    <div data-testid="dist-tooltip">
      <span data-testid="dist-entries">{entries.length}</span>
      {enchantEntries && <span data-testid="dist-enchants">{enchantEntries.length}</span>}
      {craftingStats && <span data-testid="dist-crafting">{craftingStats.join(",")}</span>}
      {fiberGems && <span data-testid="dist-fiber">{fiberGems.length}</span>}
    </div>
  ),
}))

function makeItem(
  slot: string,
  name: string,
  pct: number,
  quality = "EPIC",
  crafted = false,
): MetaItem {
  return {
    id: 1,
    item: {
      id: 1,
      blizzard_id: 1000,
      name,
      icon_url: "/icon.jpg",
      quality,
    },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    prev_usage_pct: null,
    snapshot_at: "2026-01-01",
    crafted,
    top_crafting_stats: crafted
      ? [
          "Haste",
          "Versatility",
        ]
      : [],
  }
}

function makeEnchant(slot: string, name: string, pct: number): MetaEnchant {
  return {
    id: 1,
    enchantment: {
      id: 1,
      blizzard_id: 7000,
      name,
    },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    prev_usage_pct: null,
    snapshot_at: "2026-01-01",
  }
}

function makeGem(socketType: string, name: string, pct: number): MetaGem {
  return {
    id: 1,
    item: {
      id: 1,
      blizzard_id: 3000,
      name,
      icon_url: "/gem.jpg",
      quality: "RARE",
    },
    slot: "GEM",
    socket_type: socketType,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    prev_usage_pct: null,
    snapshot_at: "2026-01-01",
  }
}

const defaultProps = {
  slot: "HEAD",
  entries: [
    makeItem("HEAD", "Helm of Glory", 85.0),
  ],
  enchants: new Map<string, EnchantGroup>(),
  fiberGems: [] as MetaGem[],
  activeColor: "#c79c6e",
  pillStyle: {
    "--pill-color": "#c79c6e",
  } as React.CSSProperties,
}

describe("itemCard", () => {
  it("renders the item name", () => {
    const { container } = render(<ItemCard {...defaultProps} />)
    expect(container.textContent).toContain("Helm of Glory")
  })

  it("renders the slot label", () => {
    const { container } = render(<ItemCard {...defaultProps} />)
    expect(container.textContent).toContain("Head")
  })

  it("renders the usage percentage", () => {
    const { container } = render(<ItemCard {...defaultProps} />)
    expect(container.textContent).toContain("85.0%")
  })

  it("renders an empty div when entries is undefined", () => {
    const { container } = render(<ItemCard {...defaultProps} entries={undefined} />)
    expect(container.querySelector('[data-testid="tooltip-wrapper"]')).toBeNull()
  })

  it("renders an empty div when entries is empty", () => {
    const { container } = render(<ItemCard {...defaultProps} entries={[]} />)
    expect(container.querySelector('[data-testid="tooltip-wrapper"]')).toBeNull()
  })

  it("shows CRAFTED badge on crafted items", () => {
    const crafted = [
      makeItem("HEAD", "Crafted Helm", 72.0, "EPIC", true),
    ]
    const { container } = render(<ItemCard {...defaultProps} entries={crafted} />)
    expect(container.textContent).toContain("CRAFTED")
  })

  it("does not show CRAFTED badge on non-crafted items", () => {
    const { container } = render(<ItemCard {...defaultProps} />)
    expect(container.textContent).not.toContain("CRAFTED")
  })

  it("renders the enchant name when provided", () => {
    const enchants = new Map<string, EnchantGroup>([
      [
        "HEAD",
        {
          slot: "HEAD",
          entries: [
            makeEnchant("HEAD", "Enchant Helm - Radiant Power", 65.0),
          ],
        },
      ],
    ])
    const { container } = render(<ItemCard {...defaultProps} enchants={enchants} />)
    expect(container.textContent).toContain("Enchant Helm - Radiant Power")
  })

  it("does not show enchant when no enchant group for slot", () => {
    const enchants = new Map<string, EnchantGroup>([
      [
        "CHEST",
        {
          slot: "CHEST",
          entries: [
            makeEnchant("CHEST", "Chest Enchant", 50.0),
          ],
        },
      ],
    ])
    const { container } = render(<ItemCard {...defaultProps} enchants={enchants} />)
    expect(container.textContent).not.toContain("Chest Enchant")
  })

  it("renders a tooltip with distribution entries", () => {
    const entries = [
      makeItem("HEAD", "Helm A", 70.0),
      makeItem("HEAD", "Helm B", 30.0),
    ]
    const { getByTestId } = render(<ItemCard {...defaultProps} entries={entries} />)
    expect(getByTestId("dist-tooltip")).toBeTruthy()
    expect(getByTestId("dist-entries").textContent).toBe("2")
  })

  it("passes enchant entries to distribution tooltip", () => {
    const enchants = new Map<string, EnchantGroup>([
      [
        "HEAD",
        {
          slot: "HEAD",
          entries: [
            makeEnchant("HEAD", "Enchant A", 60.0),
            makeEnchant("HEAD", "Enchant B", 40.0),
          ],
        },
      ],
    ])
    const { getByTestId } = render(<ItemCard {...defaultProps} enchants={enchants} />)
    expect(getByTestId("dist-enchants").textContent).toBe("2")
  })

  it("passes crafting stats to distribution tooltip for crafted items", () => {
    const crafted = [
      makeItem("HEAD", "Crafted Helm", 72.0, "EPIC", true),
    ]
    const { getByTestId } = render(<ItemCard {...defaultProps} entries={crafted} />)
    expect(getByTestId("dist-crafting").textContent).toContain("Haste")
  })

  it("does not pass crafting stats to distribution tooltip for non-crafted items", () => {
    const { queryByTestId } = render(<ItemCard {...defaultProps} />)
    expect(queryByTestId("dist-crafting")).toBeNull()
  })

  it("shows fiber gem badge on Reshii Wraps when fiber gems provided", () => {
    const reshii = [
      makeItem("HANDS", "Reshii Wraps of Insanity", 55.0),
    ]
    const fiber = [
      makeGem("TINKER", "Jeweler's Setting", 80.0),
    ]
    const { container } = render(
      <ItemCard {...defaultProps} slot="HANDS" entries={reshii} fiberGems={fiber} />,
    )
    const spans = Array.from(container.querySelectorAll("span"))
    expect(spans.some((s) => s.textContent === "Jeweler's Setting")).toBe(true)
  })

  it("does not show fiber gem badge on non-Reshii items", () => {
    const fiber = [
      makeGem("TINKER", "Jeweler's Setting", 80.0),
    ]
    const { container } = render(<ItemCard {...defaultProps} fiberGems={fiber} />)
    expect(container.textContent).not.toContain("Jeweler's Setting")
  })

  it("renders item icon", () => {
    const { container } = render(<ItemCard {...defaultProps} />)
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
    expect(img?.getAttribute("src")).toBe("/icon.jpg")
  })
})
