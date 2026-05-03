import type { Meta, StoryObj } from "@storybook/react-vite"
import { ThemeDropdown } from "../theme-dropdown"

const meta = {
  title: "Atoms/ThemeDropdown",
  component: ThemeDropdown,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
