import type { Meta, StoryObj } from "@storybook/react-vite"
import { CenterCard } from "../center-card"

const meta = {
  title: "Features/Character/CharacterEquipment/CenterCard",
  component: CenterCard,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CenterCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    classSlug: "demon-hunter",
    characterName: "Synthracks",
    className: "Demon Hunter",
    avgIlvl: 639,
    activeColor: "#a330c9",
  },
}

export const WithSpecAndStats: Story = {
  args: {
    classSlug: "demon-hunter",
    characterName: "Synthracks",
    className: "Demon Hunter",
    specName: "havoc",
    avgIlvl: 639,
    activeColor: "#a330c9",
    statPcts: {
      VERSATILITY: 12,
      MASTERY_RATING: 18,
      HASTE_RATING: 9,
      CRIT_RATING: 22,
    },
  },
}
