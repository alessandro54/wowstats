import type { Meta, StoryObj } from "@storybook/react-vite"
import { TrendArrow } from "../trend-arrow"

const meta = {
  title: "Atoms/TrendArrow",
  component: TrendArrow,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TrendArrow>

export default meta
type Story = StoryObj<typeof meta>

export const Up: Story = {
  args: {
    trend: "up",
  },
}
export const Down: Story = {
  args: {
    trend: "down",
  },
}
export const Stable: Story = {
  args: {
    trend: "stable",
  },
}
export const New: Story = {
  args: {
    trend: "new",
  },
}
export const None: Story = {
  args: {},
}
