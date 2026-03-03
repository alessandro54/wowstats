import type { Meta, StoryObj } from "@storybook/react-vite";
import { StickySpecHeader } from "../../components/atoms/sticky-header";
import { SpecHeading } from "../../components/atoms/spec-heading";

const meta = {
  title: "Atoms/StickySpecHeader",
  component: StickySpecHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sticky header wrapper that progressively applies backdrop blur and background opacity as the user scrolls. Creates a frosted glass effect for better readability over scrolled content.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "CSS classes to apply to the header (should include 'sticky top-0')",
    },
  },
} satisfies Meta<typeof StickySpecHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="font-semibold">Sticky Header</div>,
  },
  parameters: {
    docs: {
      description: {
        story: "Scroll down to see the header background fade in with blur effect.",
      },
    },
  },
  render: () => (
    <div className="h-96 w-full max-w-xl overflow-auto rounded border">
      <StickySpecHeader className="sticky top-0 z-10 border-b bg-background/70 p-3">
        <div className="font-semibold">Sticky Header</div>
        <div className="text-xs text-muted-foreground">Scroll to see effect</div>
      </StickySpecHeader>
      <div className="space-y-2 p-3">
        {Array.from({ length: 50 }).map((_, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            Scroll content row {index + 1}
          </p>
        ))}
      </div>
    </div>
  ),
};

export const WithSpecHeading: Story = {
  args: {
    children: <div>Content</div>,
  },
  parameters: {
    docs: {
      description: {
        story: "Real-world usage combining with SpecHeading component.",
      },
    },
  },
  render: () => (
    <div className="h-96 w-full max-w-2xl overflow-auto rounded border">
      <StickySpecHeader className="sticky top-0 z-10 border-b bg-background p-4">
        <SpecHeading className="Warrior" classSlug="warrior" specSlug="arms" />
      </StickySpecHeader>
      <div className="space-y-4 p-4">
        <div className="rounded border p-4">
          <h3 className="font-semibold mb-2">Equipment</h3>
          <div className="space-y-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="text-sm">Item slot {i + 1}</div>
            ))}
          </div>
        </div>
        <div className="rounded border p-4">
          <h3 className="font-semibold mb-2">Talents</h3>
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="text-sm">Talent {i + 1}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
