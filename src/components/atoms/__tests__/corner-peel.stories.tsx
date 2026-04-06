import type { Meta, StoryObj } from "@storybook/react-vite"
import { CornerPeel } from "../corner-peel"

const meta = {
  title: "Atoms/CornerPeel",
  component: CornerPeel,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A triangular corner sticker button used to flip hero talent cards. Shows a class-colored triangle with a text label that grows on hover.",
      },
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="border-border relative h-48 w-64 rounded-xl border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CornerPeel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    activeColor: "#c79c6e",
    onClick: () => {},
    label: "Alt\n40%",
  },
}

export const MageColor: Story = {
  args: {
    activeColor: "#69ccf0",
    onClick: () => {},
    label: "Main\n95%",
  },
}

export const DruidColor: Story = {
  args: {
    activeColor: "#ff7d0a",
    onClick: () => {},
    label: "Alt\n22%",
  },
}
