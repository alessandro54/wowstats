import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeSwitcher } from "../../components/atoms/theme-switcher";

const meta = {
  title: "Atoms/ThemeSwitcher",
  component: ThemeSwitcher,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Theme toggle component with three modes: System, Light, and Dark. Border color adapts to the current hovered class slug, creating a cohesive hover experience across the UI.",
      },
    },
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Click the icons to switch between System (auto), Light, and Dark themes.",
      },
    },
  },
};

export const InContext: Story = {
  parameters: {
    docs: {
      description: {
        story: "Theme switcher shown in a typical header/navigation context.",
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-between rounded border bg-card p-4">
      <div className="text-sm font-medium">WoW BIS</div>
      <ThemeSwitcher />
    </div>
  ),
};
