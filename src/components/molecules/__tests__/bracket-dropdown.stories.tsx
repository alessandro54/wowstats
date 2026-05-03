import type { Meta, StoryObj } from "@storybook/react-vite"
import { BracketDropdown } from "../bracket-dropdown"

const meta = {
  title: "Molecules/BracketDropdown",
  component: BracketDropdown,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BracketDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const TwoVTwo: Story = {
  args: {
    current: "2v2",
  },
}
export const ThreeVThree: Story = {
  args: {
    current: "3v3",
  },
}
export const ShuffleOverall: Story = {
  args: {
    current: "shuffle",
  },
}
