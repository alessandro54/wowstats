import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecStatBar } from "../spec-stat-bar"

const meta = {
  title: "Features/Spec/SpecStatBar",
  component: SpecStatBar,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SpecStatBar>

export default meta
type Story = StoryObj<typeof meta>

export const Winning: Story = {
  args: {
    winRate: 0.55,
    presence: 0.18,
    playerCount: 1250,
    classColor: "#a330c9",
  },
}

export const Losing: Story = {
  args: {
    winRate: 0.45,
    presence: 0.05,
    playerCount: 230,
    classColor: "#c41e3a",
  },
}

export const Empty: Story = {
  args: {
    winRate: 0,
    presence: 0,
    playerCount: 0,
    classColor: "#a330c9",
  },
}
