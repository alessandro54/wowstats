import type { Meta, StoryObj } from "@storybook/react-vite"
import { SlotCard } from "../slot-card"

const meta = {
  title: "Features/Character/CharacterEquipment/SlotCard",
  component: SlotCard,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SlotCard>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    item: undefined,
    slot: "HEAD",
    side: "left",
  },
}

export const Filled: Story = {
  args: {
    slot: "HEAD",
    side: "left",
    item: {
      slot: "HEAD",
      name: "Helm of the Resolute",
      quality: "EPIC",
      item_level: 639,
      blizzard_id: 12345,
      icon_url: "/icon.jpg",
      enchant: null,
      sockets: [],
    },
  },
}

export const WithEnchant: Story = {
  args: {
    slot: "CHEST",
    side: "left",
    item: {
      slot: "CHEST",
      name: "Breastplate of Valor",
      quality: "EPIC",
      item_level: 626,
      blizzard_id: 67890,
      icon_url: "/chest.jpg",
      enchant: "Woven Gold",
      sockets: [
        {
          name: "Prismatic Gem",
          icon_url: null,
        },
      ],
    },
  },
}
