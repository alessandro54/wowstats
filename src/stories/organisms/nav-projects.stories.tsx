import type { Meta, StoryObj } from "@storybook/react-vite"
import { Frame, Map, PieChart } from "lucide-react"
import { NavProjects } from "../../components/organisms/nav-projects"
import { SidebarProvider } from "../../components/ui/sidebar"

const meta = {
  title: "Organisms/NavProjects",
  component: NavProjects,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sidebar project list with per-item dropdown actions (View, Share, Delete). Collapses when sidebar is in icon mode.",
      },
    },
    layout: "centered",
  },
  decorators: [
    Story => (
      <SidebarProvider>
        <div style={{ width: 260 }}>
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavProjects>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    projects: [
      { name: "Arms PvP Guide", url: "#", icon: Frame },
      { name: "Arena Analytics", url: "#", icon: PieChart },
      { name: "Ladder Map", url: "#", icon: Map },
    ],
  },
}

export const SingleProject: Story = {
  args: {
    projects: [{ name: "My Solo Project", url: "#", icon: Frame }],
  },
  parameters: {
    docs: { description: { story: "Single project — the 'More' overflow button is still shown." } },
  },
}
