import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { CharacterEquipmentItem } from "@/lib/api"
import { CharacterEquipment } from "../character-equipment"

function makeItem(
  slot: string,
  name: string | null = null,
  quality: string | null = "EPIC",
  itemLevel: number | null = 639,
  iconUrl: string | null = "/icon.jpg",
  enchant: string | null = null,
  sockets: string[] = [],
): CharacterEquipmentItem {
  return {
    slot,
    name,
    quality,
    item_level: itemLevel,
    blizzard_id: 12345,
    icon_url: iconUrl,
    enchant,
    sockets,
  }
}

const items: CharacterEquipmentItem[] = [
  makeItem("HEAD", "Helm of the Resolute", "EPIC", 639, "/icon-head.jpg"),
  makeItem("CHEST", "Breastplate of Valor", "RARE", 626, "/icon-chest.jpg", "Woven Gold"),
  makeItem("FINGER_1", "Ring of Power", "EPIC", 639, null, null, [
    "Quicksilver Whetstone",
  ]),
]

describe("CharacterEquipment", () => {
  it("renders without crashing with items", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    expect(container.firstChild).toBeDefined()
  })

  it("renders the Equipment heading", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    expect(container.textContent).toContain("Equipment")
  })

  it("renders item names", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    expect(container.textContent).toContain("Helm of the Resolute")
    expect(container.textContent).toContain("Breastplate of Valor")
    expect(container.textContent).toContain("Ring of Power")
  })

  it("renders item level badges", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    const spans = container.querySelectorAll("span")
    const texts = Array.from(spans).map((s) => s.textContent)
    expect(texts).toContain("639")
    expect(texts).toContain("626")
  })

  it("renders item icons when icon_url is provided", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    const images = container.querySelectorAll("img")
    expect(images.length).toBeGreaterThan(0)
    const srcs = Array.from(images).map((img) => img.getAttribute("src"))
    expect(srcs.some((s) => s?.includes("/icon-head.jpg"))).toBe(true)
    expect(srcs.some((s) => s?.includes("/icon-chest.jpg"))).toBe(true)
  })

  it("renders a placeholder div when icon_url is null", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    // FINGER_1 has no icon_url — fallback bg-muted div should render
    const placeholders = container.querySelectorAll("div.h-8.w-8.rounded.bg-muted")
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it("renders enchant text when present", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    expect(container.textContent).toContain("Woven Gold")
  })

  it("renders socket gems when present", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    expect(container.textContent).toContain("Quicksilver Whetstone")
  })

  it("renders slot labels", () => {
    const { container } = render(<CharacterEquipment items={items} />)
    // formatSlot converts "HEAD" → "Head" etc.
    expect(container.textContent).toContain("Head")
    expect(container.textContent).toContain("Chest")
  })

  it("returns null and renders nothing when items is empty", () => {
    const { container } = render(<CharacterEquipment items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it("falls back to formatted slot name when item name is null", () => {
    const noNameItem = makeItem("WAIST", null)
    const { container } = render(
      <CharacterEquipment
        items={[
          noNameItem,
        ]}
      />,
    )
    // formatSlot("WAIST") should be rendered as the name
    expect(container.textContent).toContain("Waist")
  })

  it("renders multiple sockets on a single item", () => {
    const socketed = makeItem("NECK", "Amulet", "EPIC", 639, "/icon.jpg", null, [
      "Inscribed Illimited Diamond",
      "Culminating Blasphemite",
    ])
    const { container } = render(
      <CharacterEquipment
        items={[
          socketed,
        ]}
      />,
    )
    expect(container.textContent).toContain("Inscribed Illimited Diamond")
    expect(container.textContent).toContain("Culminating Blasphemite")
  })
})
