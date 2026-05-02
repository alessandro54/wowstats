import type { Meta, StoryObj } from "@storybook/react-vite"
import { HomeTopSpecsList } from "../home-top-specs-list"

const meta = {
  title: "Features/Home/HomeTopSpecsList",
  component: HomeTopSpecsList,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof HomeTopSpecsList>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    specs: [],
  },
}
