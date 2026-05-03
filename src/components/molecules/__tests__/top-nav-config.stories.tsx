import type { Meta, StoryObj } from "@storybook/react-vite"
import { TopNavConfig } from "../top-nav-config"

const meta = {
  title: "Molecules/TopNavConfig",
  component: TopNavConfig,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TopNavConfig>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
export const WithLeft: Story = {
  args: {
    left: <span className="text-sm">Left content</span>,
  },
}
export const Hidden: Story = {
  args: {
    hidden: true,
  },
}
