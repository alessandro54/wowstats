import type { Meta, StoryObj } from "@storybook/react-vite"
import { HomeHero } from "../home-hero"

const meta = {
  title: "Features/Home/HomeHero",
  component: HomeHero,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomeHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    seasonId: 39,
    totalEntries: 12450,
  },
}
