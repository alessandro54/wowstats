import type { Meta, StoryObj } from "@storybook/react-vite"
import { NavUser } from "../../components/organisms/nav-user"
import { SidebarProvider } from "../../components/ui/sidebar"

const meta = {
  title: "Organisms/NavUser",
  component: NavUser,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "User profile dropdown in the sidebar footer. Shows avatar, name, email and account action menu items.",
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
} satisfies Meta<typeof NavUser>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    user: {
      name: "Alessandro",
      email: "alessandro@example.com",
      avatar: "https://render.worldofwarcraft.com/eu/character/ragnaros/0/0-avatar.jpg",
    },
  },
}

export const LongName: Story = {
  args: {
    user: {
      name: "Thunderstrikethunderbolt",
      email: "very-long-email-address@world-of-warcraft.com",
      avatar: "https://render.worldofwarcraft.com/eu/character/ragnaros/0/0-avatar.jpg",
    },
  },
  parameters: {
    docs: {
      description: { story: "Verifies that long names and emails truncate properly." },
    },
  },
}
