import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecBracketCards } from "../spec-bracket-cards"

const meta = {
  title: "Features/Spec/SpecBracketCards",
  component: SpecBracketCards,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SpecBracketCards>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    brackets: [],
    classSlug: "demon-hunter",
  },
}
