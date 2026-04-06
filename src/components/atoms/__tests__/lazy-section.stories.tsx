import type { Meta, StoryObj } from "@storybook/react-vite"
import { LazySection } from "../lazy-section"

const meta = {
  title: "Atoms/LazySection",
  component: LazySection,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Defers rendering of children until the section scrolls near the viewport. Uses IntersectionObserver to mount children on demand, reducing initial render cost for below-the-fold content.",
      },
    },
    layout: "centered",
  },
} satisfies Meta<typeof LazySection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div
        style={{
          width: 320,
          height: 120,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Lazy-loaded content
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Content is rendered immediately in Storybook because the section is already in the viewport. In a real page, children would only mount once the section scrolls within 200 px of the viewport.",
      },
    },
  },
}

export const WithCustomRootMargin: Story = {
  args: {
    rootMargin: "0px",
    children: (
      <div
        style={{
          width: 320,
          height: 120,
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Loaded only when in view
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uses `rootMargin="0px"` so content mounts only when the element actually enters the viewport with no pre-loading buffer.',
      },
    },
  },
}
