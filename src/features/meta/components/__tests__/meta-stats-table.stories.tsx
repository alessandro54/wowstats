import type { Meta, StoryObj } from "@storybook/react-vite"
import { MetaStatsTable } from "../meta-stats-table"

const meta = {
  title: "Features/Meta/MetaStatsTable",
  component: MetaStatsTable,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof MetaStatsTable>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    entries: [],
  },
}
