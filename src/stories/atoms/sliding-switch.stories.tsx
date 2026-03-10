import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { SlidingSwitch } from "../../components/atoms/sliding-switch"

const options = [
  { value: "all" as const, label: <span className="px-3 py-1.5 block text-xs font-medium">ALL</span> },
  { value: "us" as const, label: <span className="px-3 py-1.5 block text-xs font-medium">US</span> },
  { value: "eu" as const, label: <span className="px-3 py-1.5 block text-xs font-medium">EU</span> },
]

function SlidingSwitchDemo({ bordered }: { bordered?: boolean }) {
  const [value, setValue] = useState("all")
  return (
    <SlidingSwitch
      options={options}
      value={value}
      onValueChange={setValue}
      bordered={bordered}
    />
  )
}

const meta = {
  title: "Atoms/SlidingSwitch",
  component: SlidingSwitch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Generic pill-style toggle switch with a smooth sliding indicator. Uses the active WoW class color as accent.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof SlidingSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SlidingSwitchDemo />,
  parameters: {
    docs: { description: { story: "Region selector with ALL / US / EU options." } },
  },
}

export const NoBorder: Story = {
  render: () => <SlidingSwitchDemo bordered={false} />,
  parameters: {
    docs: { description: { story: "Without the outer border." } },
  },
}
