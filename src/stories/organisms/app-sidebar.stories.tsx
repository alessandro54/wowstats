import type { Meta, StoryObj } from "@storybook/react-vite"
import { AppSidebar } from "../../components/organisms/app-sidebar"
import { HoverProvider } from "../../components/providers/hover-provider"
import { SidebarProvider } from "../../components/ui/sidebar"

const meta = {
  title: "Organisms/AppSidebar",
  component: AppSidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Main application sidebar combining TeamSwitcher, NavMain (class/spec navigation), and the collapsible rail. Requires SidebarProvider and HoverProvider context.",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    Story => (
      <HoverProvider>
        <SidebarProvider>
          <div style={{ display: "flex", height: "100vh" }}>
            <Story />
            <main className="flex-1 p-4">
              <p className="text-muted-foreground text-sm">Main content area</p>
            </main>
          </div>
        </SidebarProvider>
      </HoverProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CollapsedIcon: Story = {
  parameters: {
    docs: {
      description: { story: "Sidebar collapsed to icon-only rail mode." },
    },
  },
  decorators: [
    Story => (
      <HoverProvider>
        <SidebarProvider defaultOpen={false}>
          <div style={{ display: "flex", height: "100vh" }}>
            <Story />
            <main className="flex-1 p-4">
              <p className="text-muted-foreground text-sm">Collapsed sidebar</p>
            </main>
          </div>
        </SidebarProvider>
      </HoverProvider>
    ),
  ],
}
