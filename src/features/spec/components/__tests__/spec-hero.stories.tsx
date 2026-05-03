import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecHero } from "../spec-hero"

const meta = {
  title: "Features/Spec/SpecHero",
  component: SpecHero,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SpecHero>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  specName: "havoc",
  className: "Demon Hunter",
  classSlug: "demon-hunter",
  specIconUrl: "/icon.jpg",
}

export const Default: Story = {
  args: baseArgs,
}
export const WithBracket: Story = {
  args: {
    ...baseArgs,
    bracketLabel: "3v3 Arena",
  },
}
