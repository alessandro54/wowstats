import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecDistributionChart } from "../spec-distribution-chart"

const meta = {
  title: "Features/Spec/SpecDistributionChart",
  component: SpecDistributionChart,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SpecDistributionChart>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    brackets: [],
  },
}
