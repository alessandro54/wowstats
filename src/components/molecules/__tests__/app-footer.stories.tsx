import type { Meta, StoryObj } from "@storybook/react-vite"
import { AppFooter } from "../app-footer"

const meta = {
  title: "Molecules/AppFooter",
  component: AppFooter,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
