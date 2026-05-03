import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScrollHint } from "../scroll-hint"

const meta = {
  title: "Features/Home/ScrollHint",
  component: ScrollHint,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ScrollHint>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
