import type { Meta, StoryObj } from "@storybook/react-vite"
import { ChoiceChevrons } from "../choice-chevrons"

const meta = {
  title: "Atoms/ChoiceChevrons",
  component: ChoiceChevrons,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ChoiceChevrons>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    activeColor: "#a330c9",
  },
}
