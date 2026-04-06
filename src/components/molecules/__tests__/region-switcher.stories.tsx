import type { Meta, StoryObj } from "@storybook/react-vite"
import { RegionSwitcher } from "../region-switcher"

const meta = {
  title: "Molecules/RegionSwitcher",
  component: RegionSwitcher,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Pill-style toggle for switching between Global, US, and EU regions. The active region is highlighted with a background. Used to filter leaderboard and meta data by region.",
      },
    },
    layout: "centered",
  },
  args: {
    onSwitch: () => {},
  },
} satisfies Meta<typeof RegionSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Global: Story = {
  args: {
    current: "all",
  },
  parameters: {
    docs: {
      description: {
        story: "Default state — Global is selected, showing data across all regions.",
      },
    },
  },
}

export const US: Story = {
  args: {
    current: "us",
  },
  parameters: {
    docs: {
      description: {
        story: "US region selected.",
      },
    },
  },
}

export const EU: Story = {
  args: {
    current: "eu",
  },
  parameters: {
    docs: {
      description: {
        story: "EU region selected.",
      },
    },
  },
}
