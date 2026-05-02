import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetaInsightsPanel } from "../meta-insights-panel"

const meta = {
  title: "Features/Meta/MetaInsightsPanel",
  component: MetaInsightsPanel,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MetaInsightsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    entries: [],
  },
}
