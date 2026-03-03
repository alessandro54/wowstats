import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClickableTooltip } from "../../components/atoms/clickable-tooltip";

const meta = {
  title: "Atoms/ClickableTooltip",
  component: ClickableTooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip component with toggle behavior on click (instead of just hover). Used for talent icons and other interactive elements where the tooltip should stay open until dismissed.",
      },
    },
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Preferred side for tooltip placement",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment of tooltip relative to trigger",
    },
    content: {
      description: "Content to display inside the tooltip",
    },
  },
} satisfies Meta<typeof ClickableTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    side: "top",
    align: "center",
    children: <button className="rounded border px-3 py-1.5 hover:bg-muted">Click me</button>,
    content: "Talent details shown here",
  },
  render: (args) => (
    <div className="flex items-center justify-center p-24">
      <ClickableTooltip {...args} />
    </div>
  ),
};

export const WithRichContent: Story = {
  args: {
    side: "top",
    align: "center",
    children: (
      <button className="rounded border px-3 py-1.5 hover:bg-muted">
        Talent Info
      </button>
    ),
    content: (
      <div className="space-y-1">
        <div className="font-semibold">Mortal Strike</div>
        <div className="text-xs text-muted-foreground">Usage: 74.2%</div>
        <div className="text-xs">Deals massive physical damage</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Tooltip can contain rich content including multiple lines, formatting, and nested elements.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center justify-center p-24">
      <ClickableTooltip {...args} />
    </div>
  ),
};

export const AllPlacements: Story = {
  args: {
    side: "top",
    align: "center",
    children: <button className="rounded border px-3 py-1.5">Placement</button>,
    content: "Tooltip",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows all possible placement options for the tooltip.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <div key={side} className="flex items-center justify-center">
          <ClickableTooltip
            side={side}
            align="center"
            content={`Tooltip on ${side}`}
          >
            <button className="rounded border px-3 py-1.5 capitalize hover:bg-muted">
              {side}
            </button>
          </ClickableTooltip>
        </div>
      ))}
    </div>
  ),
};
