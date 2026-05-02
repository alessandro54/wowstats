import type { Meta, StoryObj } from "@storybook/react-vite"
import type { MetaDataset } from "../meta-stats-dashboard"
import { MetaStatsDashboard } from "../meta-stats-dashboard"

const emptyDataset: MetaDataset = {
  entries: [],
  totalEntries: 0,
  weightedRating: 0,
  weightedWR: 0,
  topSpec: {
    name: "",
    className: "",
    color: "#fff",
  },
  mostReliable: {
    name: "",
    className: "",
    color: "#fff",
    bK: 0,
  },
}

const meta = {
  title: "Features/Meta/MetaStatsDashboard",
  component: MetaStatsDashboard,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MetaStatsDashboard>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    bracket: "2v2",
    initialRole: "dps",
    initialRegion: "all",
    datasets: {
      all: emptyDataset,
      us: emptyDataset,
      eu: emptyDataset,
    },
    allBrackets: {
      "2v2": {
        all: emptyDataset,
        us: emptyDataset,
        eu: emptyDataset,
      },
    },
  },
}
