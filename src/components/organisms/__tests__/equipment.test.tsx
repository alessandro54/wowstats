import type { MetaEnchant, MetaGem, MetaItem } from "@/lib/api"
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Equipment } from "../equipment"

vi.mock("@/hooks/use-active-color", () => ({
  useActiveColor: vi.fn(() => "#c79c6e"),
}))

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
  DistributionTooltip: ({ entries }: any) => (
    <div data-testid="dist-tooltip">
      {entries.length}
      {" "}
      entries
    </div>
  ),
}))

vi.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
}))

function makeItem(slot: string, name: string, pct: number, quality = "EPIC", crafted = false): MetaItem {
  return {
    id: 1,
    item: { id: 1, blizzard_id: 1000, name, icon_url: "/icon.jpg", quality },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-01-01",
    crafted,
    top_crafting_stats: crafted ? ["Haste", "Versatility"] : [],
  }
}

function makeEnchant(slot: string, name: string, pct: number): MetaEnchant {
  return {
    id: 1,
    enchantment: { id: 1, blizzard_id: 7000, name },
    slot,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-01-01",
  }
}

function makeGem(socketType: string, name: string, pct: number): MetaGem {
  return {
    id: 1,
    item: { id: 1, blizzard_id: 3000, name, icon_url: "/gem.jpg", quality: "RARE" },
    slot: "GEM",
    socket_type: socketType,
    usage_count: Math.round(pct * 10),
    usage_pct: pct,
    snapshot_at: "2026-01-01",
  }
}

const items = [
  { slot: "HEAD", entries: [makeItem("HEAD", "Helm of Glory", 85)] },
  { slot: "CHEST", entries: [makeItem("CHEST", "Breastplate", 70, "EPIC", true)] },
]

const enchants = [
  { slot: "CHEST", entries: [makeEnchant("CHEST", "Radiance", 65)] },
]

const gems = [
  { socketType: "PRISMATIC", entries: [makeGem("PRISMATIC", "Deadly Sapphire", 73)] },
]

describe("equipment", () => {
  it("renders item names", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} fiberGems={[]} />,
    )
    expect(container.textContent).toContain("Helm of Glory")
    expect(container.textContent).toContain("Breastplate")
  })

  it("renders the Items heading", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} fiberGems={[]} />,
    )
    expect(container.textContent).toContain("Items")
  })

  it("shows empty state when no items", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={[]} enchantGroups={[]} gemGroups={[]} fiberGems={[]} />,
    )
    expect(container.textContent).toContain("No item data available")
  })

  it("renders enchant names on items", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={enchants} gemGroups={[]} fiberGems={[]} />,
    )
    expect(container.textContent).toContain("Radiance")
  })

  it("shows CRAFTED badge on crafted items", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} fiberGems={[]} />,
    )
    expect(container.textContent).toContain("CRAFTED")
  })

  it("renders the Gems section when gems exist", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={gems} fiberGems={[]} />,
    )
    expect(container.textContent).toContain("Gems")
    expect(container.textContent).toContain("Deadly Sapphire")
  })

  it("does not show Gems section when empty", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} fiberGems={[]} />,
    )
    expect(container.textContent).not.toContain("Gems")
  })

  it("shows usage percentages", () => {
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} fiberGems={[]} />,
    )
    expect(container.textContent).toContain("85.0%")
    expect(container.textContent).toContain("70.0%")
  })

  it("renders fiber gem badge on crafted Reshii wraps", () => {
    const reshii = [{ slot: "HANDS", entries: [makeItem("HANDS", "Reshii Wraps of Insanity", 55, "EPIC", true)] }]
    const fiber = [makeGem("TINKER", "Jeweler's Setting", 80)]
    const { container } = render(
      <Equipment classSlug="warrior" itemGroups={reshii} enchantGroups={[]} gemGroups={[]} fiberGems={fiber} />,
    )
    // The fiber gem badge is hidden on mobile (hidden sm:inline), but the element is in the DOM
    const spans = Array.from(container.querySelectorAll("span"))
    expect(spans.some(s => s.textContent === "Jeweler's Setting")).toBe(true)
  })

  it("renders distribution tooltips", () => {
    const { getAllByTestId } = render(
      <Equipment classSlug="warrior" itemGroups={items} enchantGroups={[]} gemGroups={[]} fiberGems={[]} />,
    )
    expect(getAllByTestId("tooltip-wrapper").length).toBeGreaterThan(0)
  })
})
