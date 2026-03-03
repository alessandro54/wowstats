import type { Meta, StoryObj } from "@storybook/react-vite"
import type { WowClassSlug } from "../../config/wow/classes/classes-config"
import { useEffect } from "react"
import DynamicBackground from "../../components/organisms/dynamic-background"
import { HoverProvider, useSetHoverSlug } from "../../components/providers/hover-provider"

const ALL_SLUGS: WowClassSlug[] = [
  "warrior",
  "paladin",
  "hunter",
  "rogue",
  "priest",
  "shaman",
  "mage",
  "warlock",
  "monk",
  "druid",
  "demon-hunter",
  "death-knight",
  "evoker",
]

/** Injects a slug into HoverProvider context so the background reacts. */
function SlugInjector({ slug }: { slug: WowClassSlug | null }) {
  const set = useSetHoverSlug()
  useEffect(() => {
    set(slug)
  }, [slug, set])
  return null
}

function InteractiveWrapper({ slug }: { slug: WowClassSlug | null }) {
  return (
    <HoverProvider>
      <SlugInjector slug={slug} />
      <div className="relative h-[500px] w-full overflow-hidden" style={{ isolation: "isolate", transform: "translateZ(0)" }}>
        <DynamicBackground />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3">
          <p className="text-foreground text-lg font-semibold">
            {slug ? slug.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase()) : "No class"}
          </p>
          <p className="text-muted-foreground text-sm">
            Use the
            {" "}
            <code className="bg-muted rounded px-1 text-xs">slug</code>
            {" "}
            control below to switch classes
          </p>
        </div>
      </div>
    </HoverProvider>
  )
}

const meta = {
  title: "Organisms/DynamicBackground",
  component: DynamicBackground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Animated background blobs that react to the active WoW class (via URL or hover context). Shows a top-center blob in the class color and a spec-gradient at the bottom on spec pages.",
      },
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof DynamicBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  args: { slug: "warrior" } as any,
  argTypes: {
    slug: {
      control: "select",
      options: [null, ...ALL_SLUGS],
      description: "WoW class slug injected into hover context",
    },
  } as any,
  render: (args: any) => <InteractiveWrapper slug={args.slug} />,
  parameters: {
    docs: {
      description: {
        story: "Pick any class from the dropdown to see the background blob change color in real-time.",
      },
    },
  },
}

export const AllClasses: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4">
      {ALL_SLUGS.map(slug => (
        <HoverProvider key={slug}>
          <SlugInjector slug={slug} />
          <div className="relative h-48 overflow-hidden border" style={{ isolation: "isolate", transform: "translateZ(0)" }}>
            <DynamicBackground />
            <div className="relative z-10 flex h-full items-center justify-center">
              <span className="text-foreground bg-background/60 rounded-md px-2 py-1 text-xs font-medium capitalize backdrop-blur-sm">
                {slug.replace("-", " ")}
              </span>
            </div>
          </div>
        </HoverProvider>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "Gallery of all 13 class color blobs side-by-side." },
    },
  },
}

export const NoClass: Story = {
  render: () => <InteractiveWrapper slug={null} />,
  parameters: {
    docs: {
      description: { story: "Fallback pink blob when no class is active." },
    },
  },
}
