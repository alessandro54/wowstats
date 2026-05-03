import type { Meta, StoryObj } from "@storybook/react-vite"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CenterCard } from "../center-card"

const meta = {
  title: "Features/Spec/Equipment/CenterCard",
  component: CenterCard,
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
} satisfies Meta<typeof CenterCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    classSlug: "demon-hunter",
    activeColor: "#a330c9",
    specName: "Havoc",
    className: "Demon Hunter",
    bracketLabel: "3v3",
  },
}
