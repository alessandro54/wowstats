import type { Meta, StoryObj } from "@storybook/react-vite"
import { SpecWinRateChart } from "../spec-winrate-chart"

const meta = {
  title: "Features/Spec/SpecWinRateChart",
  component: SpecWinRateChart,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SpecWinRateChart>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    brackets: [],
  },
}
