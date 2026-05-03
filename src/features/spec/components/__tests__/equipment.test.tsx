import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { MetaEnchant, MetaGem, MetaItem } from "@/lib/api"

import { Equipment } from "../equipment"

vi.mock("@/hooks/use-active-color", () => ({
  useActiveColor: vi.fn(() => "#c79c6e"),
}))

vi.mock("next/image", () => ({
  // eslint-disable-next-line next/no-img-element
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
  DistributionTooltip: ({ entries }: any) => (
    <div data-testid="dist-tooltip">{entries.length} entries</div>
  ),
}))

vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
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

function makeGem(slot: string, name: string, pct: number): MetaGem {
  return {
    id: 1,
    item: {
      id: 1,
      blizzard_id: 3000,
      name,
      icon_url: "/gem.jpg",
      quality: "RARE",
    },
    slot,
    socket_type: "PRISMATIC",
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    prev_usage_pct: null,
    snapshot_at: "2026-01-01",
  }
}

const items = [
  {
    slot: "HEAD",
    entries: [
      makeItem("HEAD", "Helm of Glory", 85),
    ],
  },
  {
    slot: "CHEST",
    entries: [
      makeItem("CHEST", "Breastplate", 70, "EPIC", true),
    ],
  },
]

const enchants = [
  {
    slot: "CHEST",
    entries: [
      makeEnchant("CHEST", "Radiance", 65),
    ],
  },
]

const gems = [
  {
    slot: "HEAD",
    entries: [
      makeGem("HEAD", "Deadly Sapphire", 73),
    ],
  },
]

describe("equipment", () => {
  it("renders item names", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} />,
    )
    expect(container.textContent).toContain("Helm of Glory")
    expect(container.textContent).toContain("Breastplate")
  })

  it("renders the Gear heading", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} />,
    )
    expect(container.textContent).toContain("Gear")
  })

  it("shows empty state when no items", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={[]} enchantGroups={[]} gemGroups={[]} />,
    )
    expect(container.textContent).toContain("No item data available")
  })

  it("renders enchant names on items", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={enchants} gemGroups={[]} />,
    )
    expect(container.textContent).toContain("Radiance")
  })

  it("shows Crafted badge on crafted items", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} />,
    )
    // CSS `uppercase` is visual only — textContent returns the literal "Crafted"
    expect(container.textContent).toContain("Crafted")
  })

  it("renders gem names on matching slots", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={gems} />,
    )
    expect(container.textContent).toContain("Deadly Sapphire")
  })

  it("does not show Gems section when empty", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} />,
    )
    expect(container.textContent).not.toContain("Gems")
  })

  it("shows usage percentages", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} />,
    )
    expect(container.textContent).toContain("85.0%")
    expect(container.textContent).toContain("70.0%")
  })

  it("renders crafted Reshii Wraps with crafted styling", () => {
    const reshii = [
      {
        slot: "HANDS",
        entries: [
          makeItem("HANDS", "Reshii Wraps of Insanity", 55, "EPIC", true),
        ],
      },
    ]
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={reshii} enchantGroups={[]} gemGroups={[]} />,
    )
    expect(container.textContent).toContain("Reshii Wraps of Insanity")
    expect(container.textContent).toContain("Crafted")
  })

  it("renders distribution tooltips", () => {
    const { getAllByTestId } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} />,
    )
    expect(getAllByTestId("tooltip-wrapper").length).toBeGreaterThan(0)
  })
})
