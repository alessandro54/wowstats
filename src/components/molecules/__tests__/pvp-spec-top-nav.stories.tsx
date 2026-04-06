import type { Meta, StoryObj } from "@storybook/react-vite"
import { TopNavProvider } from "@/components/providers/top-nav-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { PvpSpecTopNav } from "../pvp-spec-top-nav"
import { TopNav } from "../top-nav"

// Storybook mocks usePathname to return "/warrior/arms/pvp/2v2"
// so the bracket variant (with BracketSelector) is active by default.

function withProviders(Story: React.ComponentType) {
  return (
    <SidebarProvider>
      <TopNavProvider>
        <Story />
        <TopNav />
      </TopNavProvider>
    </SidebarProvider>
  )
}

const meta = {
  title: "Molecules/PvpSpecTopNav",
  component: PvpSpecTopNav,
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
          "Renderless component that configures the global TopNav for PvP spec pages. Shows breadcrumbs (PvP › Class › Spec) and conditionally adds BracketSelector to the center when the current pathname ends with a bracket slug.",
      },
    },
    layout: "fullscreen",
  },
  args: {
    className: "Warrior",
    classSlug: "warrior",
    specSlug: "arms",
  },
} satisfies Meta<typeof PvpSpecTopNav>

export default meta
type Story = StoryObj<typeof meta>

export const OnBracketPage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Pathname ends with `/2v2` (mocked) — BracketSelector appears in the center slot.",
      },
    },
  },
}

export const DeathKnight: Story = {
  args: {
    className: "Death Knight",
    classSlug: "death-knight",
    specSlug: "frost",
  },
  parameters: {
    docs: {
      description: {
        story: "Death Knight class name in breadcrumb.",
      },
    },
  },
}

export const Paladin: Story = {
  args: {
    className: "Paladin",
    classSlug: "paladin",
    specSlug: "retribution",
  },
  parameters: {
    docs: {
      description: {
        story: "Paladin retribution spec.",
      },
    },
  },
}
