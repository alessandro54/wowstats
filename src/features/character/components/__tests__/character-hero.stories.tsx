import type { Meta, StoryObj } from "@storybook/react-vite"
import { CharacterHero } from "../character-hero"

const meta = {
  title: "Features/Character/CharacterHero",
  component: CharacterHero,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CharacterHero>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  name: "Synthracks",
  realm: "Outland",
  region: "EU",
  classSlug: "demon-hunter",
  className: "Demon Hunter",
  armoryUrl: "https://worldofwarcraft.blizzard.com/en-gb/character/eu/outland/synthracks",
}

export const NoPortrait: Story = {
  args: baseArgs,
}

export const WithSpec: Story = {
  args: {
    ...baseArgs,
    specName: "havoc",
    race: "Night Elf",
  },
}

export const WithAvatar: Story = {
  args: {
    ...baseArgs,
    specName: "havoc",
    race: "Night Elf",
    avatarUrl: "https://render.worldofwarcraft.com/eu/character/outland/8/synthracks-avatar.jpg",
  },
}
