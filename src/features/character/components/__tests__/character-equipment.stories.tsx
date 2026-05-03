import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CharacterEquipmentItem } from "@/lib/api"
import { CharacterEquipment } from "../character-equipment"

function makeItem(
  slot: string,
  name: string,
  itemLevel = 639,
  enchant: string | null = null,
): CharacterEquipmentItem {
  return {
    slot,
    name,
    quality: "EPIC",
    item_level: itemLevel,
    blizzard_id: 12345,
    icon_url: "/icon.jpg",
    enchant,
    sockets: [],
  }
}

const items: CharacterEquipmentItem[] = [
  makeItem("HEAD", "Helm of the Resolute"),
  makeItem("CHEST", "Breastplate of Valor", 626, "Woven Gold"),
  makeItem("HANDS", "Gauntlets of Power"),
  makeItem("LEGS", "Greaves of Steel", 632),
  makeItem("MAIN_HAND", "Blade of the Damned"),
]

const meta = {
  title: "Features/Character/CharacterEquipment",
  component: CharacterEquipment,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CharacterEquipment>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    items: [],
    classSlug: "demon-hunter",
    characterName: "Synthracks",
    className: "Demon Hunter",
  },
}

export const WithItems: Story = {
  args: {
    items,
    classSlug: "demon-hunter",
    characterName: "Synthracks",
    className: "Demon Hunter",
    specName: "havoc",
    statPcts: {
      VERSATILITY: 12,
      MASTERY_RATING: 18,
      HASTE_RATING: 9,
      CRIT_RATING: 22,
    },
  },
}
