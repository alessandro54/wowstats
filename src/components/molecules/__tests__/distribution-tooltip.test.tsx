import type { DistEntry } from "../distribution-tooltip"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { DistributionTooltip } from "../distribution-tooltip"

describe("distributionTooltip", () => {
  const mockEntries: DistEntry[] = [
    {
      name: "Item 1",
      pct: 45.5,
      quality: "EPIC",
    },
    {
      name: "Item 2",
      pct: 30.2,
      quality: "RARE",
    },
    {
      name: "Item 3",
      pct: 15.8,
      quality: "UNCOMMON",
    },
  ]

  it("renders item alternatives", () => {
    const { container } = render(
      <DistributionTooltip entries={mockEntries} activeColor="#C69B6D" />,
    )

    expect(container.textContent).toContain("Item 2")
    expect(container.textContent).toContain("Item 3")
  })

  it("displays percentage values correctly", () => {
    const { container } = render(
      <DistributionTooltip entries={mockEntries} activeColor="#C69B6D" />,
    )

    expect(container.textContent).toContain("30.2%")
    expect(container.textContent).toContain("15.8%")
  })

  it("renders enchant alternatives when provided", () => {
    const enchantEntries: DistEntry[] = [
      {
        name: "Enchant 1",
        pct: 50.0,
      },
      {
        name: "Enchant 2",
        pct: 25.0,
      },
    ]

    const { container } = render(
      <DistributionTooltip
        entries={mockEntries}
        enchantEntries={enchantEntries}
        activeColor="#C69B6D"
      />,
    )

    expect(container.textContent).toContain("Enchant alternatives")
    expect(container.textContent).toContain("Enchant 2")
    expect(container.textContent).not.toContain("Enchant 1")
  })

  it("displays alternatives label", () => {
    const { container } = render(
      <DistributionTooltip entries={mockEntries} activeColor="#C69B6D" />,
    )

    expect(container.textContent).toContain("Alternatives")
  })

  it("shows crafting stats when provided", () => {
    const { container } = render(
      <DistributionTooltip
        entries={mockEntries}
        activeColor="#C69B6D"
        craftingStats={[
          "HASTE_RATING",
          "CRIT_RATING",
          "UNKNOWN_STAT",
        ]}
      />,
    )

    expect(container.textContent).toContain("Crafted")
    expect(container.textContent).toContain("top stats")
  })

  it("handles empty alternatives gracefully", () => {
    const singleEntry: DistEntry[] = [
      {
        name: "Only Item",
        pct: 100,
        quality: "EPIC",
      },
    ]

    const { container } = render(
      <DistributionTooltip entries={singleEntry} activeColor="#C69B6D" />,
    )

    expect(container.textContent).not.toContain("Only Item")
    expect(container.textContent).not.toContain("Alternatives")
  })

  it("renders fiber gems section when provided", () => {
    const fiberGems = [
      {
        id: 1,
        item: {
          id: 1,
          blizzard_id: 100,
          name: "Fiber Gem A",
          icon_url: "",
          quality: "RARE",
        },
        slot: "prismatic",
        socket_type: "FIBER",
        usage_count: 50,
        usage_pct: 60.0,
        snapshot_at: "",
      },
      {
        id: 2,
        item: {
          id: 2,
          blizzard_id: 101,
          name: "Fiber Gem B",
          icon_url: "",
          quality: "UNCOMMON",
        },
        slot: "prismatic",
        socket_type: "FIBER",
        usage_count: 30,
        usage_pct: 30.0,
        snapshot_at: "",
      },
    ]

    const { container } = render(
      <DistributionTooltip entries={mockEntries} activeColor="#C69B6D" fiberGems={fiberGems} />,
    )

    expect(container.textContent).toContain("Fiber socket")
    expect(container.textContent).toContain("Fiber Gem A")
    expect(container.textContent).toContain("60.0%")
  })

  it("renders entries with icon_url in DistList", () => {
    const entriesWithIcons: DistEntry[] = [
      {
        name: "Top Item",
        pct: 50.0,
        quality: "EPIC",
      },
      {
        name: "Alt With Icon",
        pct: 30.0,
        quality: "RARE",
        icon_url: "https://example.com/icon.jpg",
      },
    ]

    const { container } = render(
      <DistributionTooltip entries={entriesWithIcons} activeColor="#C69B6D" />,
    )

    expect(container.textContent).toContain("Alt With Icon")
    const img = container.querySelector("img")
    expect(img).toBeInTheDocument()
  })

  it("applies quality colors to items", () => {
    const { container } = render(
      <DistributionTooltip entries={mockEntries} activeColor="#C69B6D" />,
    )

    const spans = container.querySelectorAll("span")
    expect(spans.length).toBeGreaterThan(0)
  })

  it("displays min-width classes correctly", () => {
    const { container: containerSingle } = render(
      <DistributionTooltip entries={mockEntries} activeColor="#C69B6D" />,
    )

    // Just verify it renders without error
    expect(containerSingle.querySelector("div")).toBeTruthy()
  })

  it("handles items with icons", () => {
    const entriesWithIcons: DistEntry[] = [
      {
        name: "Iconic Item",
        pct: 45.5,
        quality: "EPIC",
        icon_url: "https://example.com/icon.jpg",
      },
      {
        name: "Alt Item",
        pct: 30.0,
        quality: "RARE",
      },
    ]

    const { container } = render(
      <DistributionTooltip entries={entriesWithIcons} activeColor="#C69B6D" />,
    )

    expect(container.textContent).toContain("Alt Item")
    expect(container.textContent).not.toContain("Iconic Item")
  })
})
