import type { Meta, StoryObj } from "@storybook/react-vite"
import { RoleSwitcher } from "../role-switcher"

const meta = {
  title: "Molecules/RoleSwitcher",
  component: RoleSwitcher,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Pill-style toggle for switching between DPS, Healer, and Tank roles. The active role is highlighted with a background. Used to filter meta tierlist entries by role.",
      },
    },
    layout: "centered",
  },
  args: {
    onSwitch: () => {},
  },
} satisfies Meta<typeof RoleSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const DPS: Story = {
  args: {
    current: "dps",
  },
  parameters: {
    docs: {
      description: {
        story: "DPS role selected — the default view on the meta tierlist page.",
      },
    },
  },
}

export const Healer: Story = {
  args: {
    current: "healer",
  },
  parameters: {
    docs: {
      description: {
        story: "Healer role selected.",
      },
    },
  },
}

export const Tank: Story = {
  args: {
    current: "tank",
  },
  parameters: {
    docs: {
      description: {
        story: "Tank role selected.",
      },
    },
  },
}
