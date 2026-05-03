import type { Meta, StoryObj } from "@storybook/react-vite"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SlotCard } from "../slot-card"

const meta = {
  title: "Features/Spec/Equipment/SlotCard",
  component: SlotCard,
  tags: [
    "autodocs",
  ],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof SlotCard>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    slot: "HEAD",
    entries: undefined,
    enchantBySlot: new Map(),
    gemBySlot: new Map(),
    activeColor: "#a330c9",
    isBis: false,
    side: "left",
  },
}
