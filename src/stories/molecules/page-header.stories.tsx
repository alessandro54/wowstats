import type { Meta, StoryObj } from "@storybook/react-vite"
import { PageHeader } from "../../components/molecules/page-header"
import { SidebarProvider } from "../../components/ui/sidebar"

function withSidebar(Story: React.ComponentType) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <Story />
      </div>
    </SidebarProvider>
  )
}

const meta = {
  title: "Molecules/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  decorators: [withSidebar],
  parameters: {
    docs: {
      description: {
        component:
          "Sticky top header with sidebar trigger, an optional left slot (breadcrumbs / title), an optional centered slot, and the theme switcher on the right.",
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: { description: { story: "Empty header — just sidebar trigger and theme switcher." } },
  },
}

export const WithTitle: Story = {
  args: {
    children: <span className="text-sm font-semibold">Arms Warrior · 2v2</span>,
  },
  parameters: {
    docs: { description: { story: "Left slot filled with a page title." } },
  },
}

export const WithCenterSlot: Story = {
  args: {
    centerSlot: (
      <div className="flex gap-1">
        {["2v2", "3v3", "Solo", "RBG"].map(b => (
          <span key={b} className="bg-muted rounded px-2.5 py-1 text-xs font-medium">
            {b}
          </span>
        ))}
      </div>
    ),
  },
  parameters: {
    docs: {
      description: { story: "Center slot used for bracket navigation (e.g. BracketSelector)." },
    },
  },
}
