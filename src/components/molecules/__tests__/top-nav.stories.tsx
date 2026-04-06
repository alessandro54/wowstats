import type { Meta, StoryObj } from "@storybook/react-vite"
import { TopNavProvider } from "@/components/providers/top-nav-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TopNav } from "../top-nav"
import { TopNavConfig } from "../top-nav-config"

function withProviders(Story: React.ComponentType) {
  return (
    <SidebarProvider>
      <TopNavProvider>
        <div className="w-full">
          <Story />
        </div>
      </TopNavProvider>
    </SidebarProvider>
  )
}

const meta = {
  title: "Molecules/TopNav",
  component: TopNav,
  tags: [
    "autodocs",
  ],
  decorators: [
    withProviders,
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Sticky top navigation bar. Reads config (left, center, hidden) from `TopNavProvider` context. Use `TopNavConfig` anywhere in the tree to configure it.",
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof TopNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Empty nav — just sidebar trigger and theme switcher.",
      },
    },
  },
}

export const WithBreadcrumb: Story = {
  render: () => (
    <>
      <TopNavConfig left={<span className="text-sm font-semibold">PvP › Warrior › Arms</span>} />
      <TopNav />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Left slot filled with a breadcrumb string.",
      },
    },
  },
}

export const WithCenterActions: Story = {
  render: () => (
    <>
      <TopNavConfig
        center={
          <div className="flex gap-1">
            {[
              "2v2",
              "3v3",
              "Solo",
              "RBG",
            ].map((b) => (
              <span key={b} className="bg-muted rounded px-2.5 py-1 text-xs font-medium">
                {b}
              </span>
            ))}
          </div>
        }
      />
      <TopNav />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Center slot used for bracket navigation.",
      },
    },
  },
}

export const WithBothSlots: Story = {
  render: () => (
    <>
      <TopNavConfig
        left={<span className="text-sm font-semibold">PvP › Warrior › Arms</span>}
        center={
          <div className="flex gap-1">
            {[
              "2v2",
              "3v3",
              "Solo",
              "RBG",
            ].map((b) => (
              <span key={b} className="bg-muted rounded px-2.5 py-1 text-xs font-medium">
                {b}
              </span>
            ))}
          </div>
        }
      />
      <TopNav />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Both left and center slots populated.",
      },
    },
  },
}

export const Hidden: Story = {
  render: () => (
    <>
      <TopNavConfig hidden />
      <TopNav />
      <div className="p-8 text-sm text-muted-foreground">
        TopNav is hidden — no header rendered above.
      </div>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: "Set `hidden` via TopNavConfig to suppress the bar entirely.",
      },
    },
  },
}
