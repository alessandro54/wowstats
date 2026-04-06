import type { Meta, StoryObj } from "@storybook/react-vite"
import { HoverProvider } from "../../components/providers/hover-provider"
import { SidebarProvider } from "../../components/ui/sidebar"
import { NavMain } from "../nav-main"

const meta = {
  title: "Organisms/NavMain",
  component: NavMain,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Interactive class/spec navigation menu. Expands on hover to show specs with bracket links (2v2, 3v3, Solo). In collapsed mode, shows a hover card popup.",
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <HoverProvider>
        <SidebarProvider>
          <div
            style={{
              width: 260,
            }}
          >
            <Story />
          </div>
        </SidebarProvider>
      </HoverProvider>
    ),
  ],
} satisfies Meta<typeof NavMain>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Full sidebar open state — hover over a class to expand specs.",
      },
    },
  },
}

export const CollapsedMode: Story = {
  decorators: [
    (Story) => (
      <HoverProvider>
        <SidebarProvider defaultOpen={false}>
          <div
            style={{
              width: 60,
            }}
          >
            <Story />
          </div>
        </SidebarProvider>
      </HoverProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Collapsed sidebar — class icons with hover card popups for spec selection.",
      },
    },
  },
}
