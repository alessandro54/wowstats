import type { Meta, StoryObj } from "@storybook/react-vite"
import { WOW_CLASSES } from "@/config/wow/classes/classes-config"
import { HomeClassGrid } from "../home-class-grid"

const meta = {
  title: "Features/Home/HomeClassGrid",
  component: HomeClassGrid,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomeClassGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    classes: WOW_CLASSES,
  },
}
