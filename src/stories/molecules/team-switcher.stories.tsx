import type { Meta, StoryObj } from "@storybook/react-vite"
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react"
import { TeamSwitcher } from "../../components/molecules/team-switcher"
import { SidebarProvider } from "../../components/ui/sidebar"

function withSidebar(Story: React.ComponentType) {
  return (
    <SidebarProvider>
      <div className="p-4">
        <Story />
      </div>
    </SidebarProvider>
  )
}

const sampleTeams = [
  {
    name: "Acme Inc",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Command,
    plan: "Free",
  },
]

const meta = {
  title: "Molecules/TeamSwitcher",
  component: TeamSwitcher,
  tags: [
    "autodocs",
  ],
  decorators: [
    withSidebar,
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Sidebar dropdown to switch between teams/organisations. Click the trigger to open the menu and select a different team.",
      },
    },
    layout: "centered",
  },
  args: {
    teams: sampleTeams,
  },
} satisfies Meta<typeof TeamSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleTeam: Story = {
  args: {
    teams: sampleTeams.slice(0, 1),
  },
  parameters: {
    docs: {
      description: {
        story: "Only one team available — switcher still renders the dropdown.",
      },
    },
  },
}
