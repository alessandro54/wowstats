import type { Meta, StoryObj } from "@storybook/react-vite"
import { ClassHoverZone } from "../../components/atoms/class-hover-zone"
import { useHoverSlug } from "../../components/providers/hover-provider"

const meta = {
  title: "Atoms/ClassHoverZone",
  component: ClassHoverZone,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wrapper component that updates the global hover context when the user hovers over a WoW class element. Used for synchronized hover effects across the UI (e.g., highlighting class colors in navigation and theme switcher).",
      },
    },
  },
  argTypes: {
    slug: {
      control: "select",
      options: [
        "warrior",
        "paladin",
        "death-knight",
        "mage",
        "priest",
        "warlock",
        "rogue",
        "druid",
        "hunter",
        "shaman",
        "monk",
        "demon-hunter",
        "evoker",
      ],
      description: "WoW class slug that determines which class color to activate",
    },
    className: {
      control: "text",
      description: "Optional CSS classes to apply to the wrapper div",
    },
  },
} satisfies Meta<typeof ClassHoverZone>

export default meta
type Story = StoryObj<typeof meta>

/** Visual indicator to show current hover state */
function HoverStateIndicator() {
  const hoverSlug = useHoverSlug()
  return (
    <div className="bg-background fixed top-4 right-4 rounded border p-3 shadow-lg">
      <div className="text-muted-foreground mb-1 text-xs">Hover State:</div>
      <div className="font-mono text-sm">
        {hoverSlug
          ? (
              <span style={{ color: `var(--color-class-${hoverSlug})` }}>{hoverSlug}</span>
            )
          : (
              <span className="text-muted-foreground">null</span>
            )}
      </div>
    </div>
  )
}

export const Default: Story = {
  args: {
    slug: "warrior",
    className: "inline-block rounded border px-4 py-3 transition-colors hover:bg-muted",
    children: "Hover me to see Warrior class state",
  },
  render: args => (
    <>
      <HoverStateIndicator />
      <ClassHoverZone {...args}>{args.children}</ClassHoverZone>
    </>
  ),
}

export const MultipleClasses: Story = {
  args: {
    slug: "warrior",
    children: "Hover me",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multiple hover zones demonstrating different class colors. Hover over each to see the global state update.",
      },
    },
  },
  render: () => (
    <>
      <HoverStateIndicator />
      <div className="flex flex-wrap gap-3">
        {["warrior", "paladin", "death-knight", "mage", "priest", "rogue", "druid", "hunter"].map(
          slug => (
            <ClassHoverZone
              key={slug}
              slug={slug as any}
              className="hover:bg-muted cursor-default rounded border px-4 py-2 transition-colors"
            >
              <span className="capitalize" style={{ color: `var(--color-class-${slug})` }}>
                {slug.replace("-", " ")}
              </span>
            </ClassHoverZone>
          ),
        )}
      </div>
    </>
  ),
}
