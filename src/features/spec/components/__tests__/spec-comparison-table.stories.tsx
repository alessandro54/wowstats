import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecComparisonTable } from "../spec-comparison-table"

const meta = {
  title: "Features/Spec/SpecComparisonTable",
  component: SpecComparisonTable,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SpecComparisonTable>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    brackets: [],
  },
}
