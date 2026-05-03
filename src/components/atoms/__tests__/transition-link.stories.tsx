import type { Meta, StoryObj } from "@storybook/react-vite"
import { TransitionLink } from "../transition-link"

const meta = {
  title: "Atoms/TransitionLink",
  component: TransitionLink,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TransitionLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: "/pvp/warrior/arms/3v3",
    children: "View Warrior Arms 3v3",
  },
}
