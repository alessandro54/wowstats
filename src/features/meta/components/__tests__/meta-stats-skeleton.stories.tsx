import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetaStatsSkeleton } from "../meta-stats-skeleton"

const meta = {
  title: "Features/Meta/MetaStatsSkeleton",
  component: MetaStatsSkeleton,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MetaStatsSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
