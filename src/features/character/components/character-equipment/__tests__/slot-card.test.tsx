import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { CharacterEquipmentItem } from "@/lib/api"
import { SlotCard } from "../slot-card"

function makeItem(overrides: Partial<CharacterEquipmentItem> = {}): CharacterEquipmentItem {
  return {
    slot: "HEAD",
    name: "Helm of the Resolute",
    quality: "EPIC",
    item_level: 639,
    blizzard_id: 12345,
    icon_url: "/icon.jpg",
    enchant: null,
    sockets: [],
    ...overrides,
  }
}

describe("SlotCard", () => {
  it("renders empty placeholder when no item provided", () => {
    const { container } = render(<SlotCard item={undefined} slot="HEAD" side="left" />)
    expect(container.textContent).toContain("Empty")
    expect(container.textContent).toContain("Head")
  })

  it("renders item name when item provided", () => {
    const { container } = render(<SlotCard item={makeItem()} slot="HEAD" side="left" />)
    expect(container.textContent).toContain("Helm of the Resolute")
  })

  it("renders item level badge", () => {
    const { container } = render(<SlotCard item={makeItem()} slot="HEAD" side="left" />)
    expect(container.textContent).toContain("639")
  })

  it("renders enchant when present", () => {
    const { container } = render(
      <SlotCard
        item={makeItem({
          enchant: "Woven Gold",
        })}
        slot="HEAD"
        side="left"
      />,
    )
    expect(container.textContent).toContain("Woven Gold")
  })

  it("renders sockets when present", () => {
    const { container } = render(
      <SlotCard
        item={makeItem({
          sockets: [
            {
              name: "Prismatic Gem",
              icon_url: null,
            },
          ],
        })}
        slot="HEAD"
        side="left"
      />,
    )
    expect(container.textContent).toContain("Prismatic Gem")
  })

  it("falls back to slot name when item name is null", () => {
    const { container } = render(
      <SlotCard
        item={makeItem({
          name: null,
        })}
        slot="WAIST"
        side="left"
      />,
    )
    expect(container.textContent).toContain("Waist")
  })

  it("uses left border class when side is left", () => {
    const { container } = render(<SlotCard item={makeItem()} slot="HEAD" side="left" />)
    expect(container.firstChild).toBeDefined()
    expect((container.firstChild as HTMLElement).className).toContain("border-l-2")
  })

  it("uses right border class when side is right", () => {
    const { container } = render(<SlotCard item={makeItem()} slot="HEAD" side="right" />)
    expect((container.firstChild as HTMLElement).className).toContain("border-r-2")
  })
})
