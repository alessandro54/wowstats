import type { Meta, StoryObj } from "@storybook/react-vite"
import { HomeBgCanvas } from "../home-bg-canvas"

const meta = {
  title: "Features/Home/HomeBgCanvas",
  component: HomeBgCanvas,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomeBgCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
export const WithColor: Story = {
  args: {
    color: "#a330c9",
  },
}
