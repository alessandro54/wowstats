import type { Meta, StoryObj } from "@storybook/react-vite"
import { HomeBracketCards } from "../home-bracket-cards"

const meta = {
  title: "Features/Home/HomeBracketCards",
  component: HomeBracketCards,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomeBracketCards>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    brackets: [],
  },
}
