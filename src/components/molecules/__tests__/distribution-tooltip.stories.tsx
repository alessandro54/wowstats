import React from "react"
import Image from "next/image"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type { DistEntry } from "../distribution-tooltip"
import { DistributionTooltip } from "../distribution-tooltip"
import { TrendArrow } from "@/components/atoms/trend-arrow"

const WZ = "https://wow.zamimg.com/images/wow/icons/large"
// Icons confirmed working (used elsewhere in stories)
const ICON_SWORD = `${WZ}/ability_warrior_savageblow.jpg`
const ICON_ENCHANT = `${WZ}/spell_nature_starfall.jpg`
const ICON_GEM_1 = `${WZ}/inv_misc_gem_sapphire_02.jpg`
const ICON_GEM_2 = `${WZ}/inv_helmet_154.jpg`

const weaponEntries: DistEntry[] = [
  {
    name: "Void-Touched Claymore",
    pct: 61.3,
    trend: "up",
    quality: "EPIC",
    icon_url: ICON_SWORD,
  },
  {
    name: "Emerald Dream Greatsword",
    pct: 22.7,
    trend: "down",
    quality: "EPIC",
    icon_url: ICON_SWORD,
  },
  {
    name: "Ulduar's Echo",
    pct: 10.1,
    trend: "stable",
    quality: "RARE",
    icon_url: ICON_SWORD,
  },
  {
    name: "Other",
    pct: 5.9,
    quality: "UNCOMMON",
  },
]

const enchantEntries: DistEntry[] = [
  {
    name: "Authority of Radiant Power",
    pct: 54.8,
    trend: "stable",
    icon_url: ICON_ENCHANT,
  },
  {
    name: "Authority of the Depths",
    pct: 30.2,
    trend: "up",
    icon_url: ICON_ENCHANT,
  },
  {
    name: "Stormrider's Fury",
    pct: 15.0,
    trend: "down",
    icon_url: ICON_ENCHANT,
  },
]

const gemEntries: DistEntry[] = [
  {
    name: "Masterful Jewel Doublet",
    pct: 72.4,
    trend: "up",
    icon_url: ICON_GEM_1,
  },
  {
    name: "Quick Jewel Cluster",
    pct: 27.6,
    trend: "new",
    icon_url: ICON_GEM_2,
  },
]

const meta = {
  title: "Molecules/DistributionTooltip",
  component: DistributionTooltip,
  tags: [
    "autodocs",
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Tooltip content showing alternative item/enchant distributions, crafting stats, and fiber gem choices. Rendered inside a Radix tooltip popup.",
      },
    },
    layout: "centered",
  },
  args: {
    entries: weaponEntries,
    activeColor: "#c79c6e",
  },
} satisfies Meta<typeof DistributionTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const AlternativesOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "Shows item alternatives (entries after index 0).",
      },
    },
  },
}

export const WithEnchantAlternatives: Story = {
  args: {
    enchantEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "Two-column layout: item alternatives + enchant alternatives.",
      },
    },
  },
}

export const WithCraftingStats: Story = {
  args: {
    craftingStats: [
      "haste",
      "crit",
      "mastery",
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Includes a crafted-item stat section below the alternatives.",
      },
    },
  },
}

export const WithGems: Story = {
  args: {
    gemEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows gem options below the alternatives.",
      },
    },
  },
}

export const FullTooltip: Story = {
  args: {
    enchantEntries,
    craftingStats: [
      "haste",
      "crit",
    ],
    gemEntries,
  },
  parameters: {
    docs: {
      description: {
        story: "All sections combined.",
      },
    },
  },
}

// ─── Design variants ────────────────────────────────────────────────────────
// These stories prototype alternative visual treatments without touching the
// production component. Scroll through all three to compare.

const ALL_ENTRIES = [
  weaponEntries[0],
  ...weaponEntries.slice(1),
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
      {children}
    </p>
  )
}

/**
 * Variant A — Progress Bars
 * Each row has an inline bar showing relative adoption. The #1 pick uses the
 * class colour; alternatives are muted. Makes the "how dominant is BiS?" story
 * immediately scannable.
 */
export const VariantBars: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "**Variant A — Progress Bars.** Inline bar per row. BiS bar tinted with class colour; alternatives muted. Relative adoption is instantly visible.",
      },
    },
  },
  render: ({ activeColor }) => {
    const sections: {
      label: string
      entries: DistEntry[]
    }[] = [
      {
        label: "Alternatives",
        entries: weaponEntries,
      },
      {
        label: "Enchants",
        entries: enchantEntries,
      },
      {
        label: "Gems",
        entries: gemEntries,
      },
    ]
    return (
      <div className="min-w-56 space-y-4 text-sm">
        {sections.map(({ label, entries }) => (
          <div key={label}>
            <SectionLabel>{label}</SectionLabel>
            <div className="space-y-1.5">
              {entries.map((e, i) => (
                <div key={e.name} className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    {e.icon_url && (
                      <Image
                        src={e.icon_url}
                        width={16}
                        height={16}
                        className="shrink-0 rounded opacity-80"
                        alt=""
                      />
                    )}
                    <span
                      className={`min-w-0 flex-1 truncate text-sm ${i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {e.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {e.pct.toFixed(1)}%
                      </span>
                      <TrendArrow trend={e.trend} />
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-muted/40">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${e.pct}%`,
                        background: i === 0 ? activeColor : "hsl(var(--muted-foreground))",
                        opacity: i === 0 ? 0.85 : 0.35,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * Variant B — Featured Hero
 * The #1 pick gets a prominent "hero" block (large icon, full name, big %).
 * Alternatives sit below in a compact list. Creates clear visual hierarchy.
 */
export const VariantFeatured: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "**Variant B — Featured Hero.** BiS pick is a prominent card; alternatives are a compact list below. Visual hierarchy makes the winner obvious at a glance.",
      },
    },
  },
  render: ({ activeColor }) => {
    const [best, ...rest] = ALL_ENTRIES
    return (
      <div className="w-64 space-y-3">
        {/* Hero block */}
        <div
          className="flex items-center gap-3 rounded-lg border p-3"
          style={{
            borderColor: `${activeColor}55`,
            background: `${activeColor}0d`,
          }}
        >
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded text-lg font-bold"
            style={{
              color: activeColor,
            }}
          >
            #1
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="truncate text-sm font-semibold"
              style={{
                color: activeColor,
              }}
            >
              {best.name}
            </div>
            <div className="text-xs text-muted-foreground">Used by {best.pct.toFixed(1)}%</div>
          </div>
        </div>

        {/* Alternatives */}
        {rest.length > 0 && (
          <div>
            <SectionLabel>Alternatives</SectionLabel>
            <div className="space-y-1">
              {rest.map((e, i) => (
                <div key={e.name} className="flex items-center gap-2">
                  <span className="w-4 shrink-0 text-center text-[10px] font-bold text-muted-foreground">
                    #{i + 2}
                  </span>
                  <span className="flex-1 truncate text-sm text-muted-foreground">{e.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {e.pct.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enchants */}
        <div className="border-t border-border/40 pt-2">
          <SectionLabel>Enchant alternatives</SectionLabel>
          <div className="space-y-1">
            {enchantEntries.slice(1).map((e, i) => (
              <div key={e.name} className="flex items-center gap-2">
                <span className="w-4 shrink-0 text-center text-[10px] font-bold text-muted-foreground">
                  #{i + 2}
                </span>
                <span className="flex-1 truncate text-sm text-muted-foreground">{e.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{e.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Variant C — Ranked Pill List
 * Single column, no section dividers. Each entry has a coloured rank pill on
 * the left. Pct is right-aligned. All sections flow vertically — no two-col
 * split. Feels more like a leaderboard.
 */
export const VariantRankedPills: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "**Variant C — Ranked Pills.** Single column leaderboard feel. Rank pill on left, right-aligned %. No two-col split — everything stacks. Good for narrow tooltips.",
      },
    },
  },
  render: ({ activeColor }) => {
    const RANK_COLORS = [
      activeColor,
      "#a335ee",
      "#0070dd",
      "#9d9d9d",
    ]

    function RankedList({ entries, label }: { entries: DistEntry[]; label: string }) {
      return (
        <div>
          <SectionLabel>{label}</SectionLabel>
          <div className="space-y-1">
            {entries.map((e, i) => (
              <div key={e.name} className="flex items-center gap-2">
                <span
                  className="inline-flex h-4 w-5 shrink-0 items-center justify-center rounded text-[9px] font-bold"
                  style={{
                    background: `${RANK_COLORS[i] ?? "#6b7280"}22`,
                    color: RANK_COLORS[i] ?? "#6b7280",
                  }}
                >
                  {i + 1}
                </span>
                {e.icon_url && (
                  <Image
                    src={e.icon_url}
                    width={16}
                    height={16}
                    className="shrink-0 rounded opacity-80"
                    alt=""
                  />
                )}
                <span className="flex-1 truncate text-sm">{e.name}</span>
                <span className="flex shrink-0 items-center gap-1">
                  <span
                    className="font-mono text-xs font-semibold"
                    style={{
                      color: i === 0 ? activeColor : undefined,
                    }}
                  >
                    {e.pct.toFixed(1)}%
                  </span>
                  <TrendArrow trend={e.trend} />
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="w-56 space-y-4">
        <RankedList entries={ALL_ENTRIES} label="Items" />
        <div className="border-t border-border/40" />
        <RankedList entries={enchantEntries} label="Enchants" />
        <div className="border-t border-border/40" />
        <RankedList entries={gemEntries} label="Gems" />
      </div>
    )
  },
}

/**
 * Variant D — Current Item First + 2-col below
 * Top: full-width detail block for the equipped (currently shown) item.
 * Below: 2-column grid — left = item alternatives, right = enchants + gems.
 * Trend arrows used throughout.
 */
export const VariantCurrentFirst: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "**Variant D — Current First + 2-col.** Top card shows the currently equipped item (entries[0]) with usage %, quality colour, and trend. Below: 2-col — alternatives left, enchants + gems right. Trends everywhere.",
      },
    },
  },
  render: ({ activeColor }) => {
    const current = weaponEntries[0]
    const alternatives = weaponEntries.slice(1)
    const enchantAlts = enchantEntries.slice(1)

    const QUALITY_COLORS: Record<string, string> = {
      EPIC: "#a335ee",
      RARE: "#0070dd",
      UNCOMMON: "#1eff00",
    }
    const qualityColor = current.quality ? QUALITY_COLORS[current.quality] : activeColor

    function EntryRow({ e }: { e: DistEntry }) {
      return (
        <div className="flex items-center gap-1.5">
          {e.icon_url && (
            <Image
              src={e.icon_url}
              width={20}
              height={20}
              className="shrink-0 rounded opacity-90"
              alt=""
            />
          )}
          <span
            className="flex-1 truncate text-sm"
            style={{
              color: e.quality ? QUALITY_COLORS[e.quality] : undefined,
            }}
          >
            {e.name}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <span className="font-mono text-xs text-muted-foreground">{e.pct.toFixed(1)}%</span>
            <TrendArrow trend={e.trend} />
          </span>
        </div>
      )
    }

    return (
      <div className="w-80 space-y-3">
        {/* Current item — top full-width card */}
        <div
          className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
          style={{
            borderColor: `${qualityColor}44`,
            background: `${qualityColor}0d`,
          }}
        >
          {current.icon_url && (
            <Image
              src={current.icon_url}
              width={32}
              height={32}
              className="shrink-0 rounded"
              alt=""
            />
          )}
          <div className="min-w-0 flex-1">
            <div
              className="truncate text-sm font-semibold"
              style={{
                color: qualityColor,
              }}
            >
              {current.name}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Currently equipped
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className="font-mono text-sm font-bold"
              style={{
                color: qualityColor,
              }}
            >
              {current.pct.toFixed(1)}%
            </span>
            <TrendArrow trend={current.trend} />
          </div>
        </div>

        {/* 2-col below */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left — item alternatives */}
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Alternatives
            </p>
            <div className="space-y-1">
              {alternatives.map((e) => (
                <EntryRow key={e.name} e={e} />
              ))}
            </div>
          </div>

          {/* Right — enchants + gems */}
          <div className="space-y-3 border-l border-border/40 pl-4">
            <div>
              <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-wider uppercase">
                Enchants
              </p>
              <div className="space-y-1">
                {enchantAlts.map((e) => (
                  <EntryRow key={e.name} e={e} />
                ))}
              </div>
            </div>
            <div className="border-t border-border/30 pt-2">
              <p className="text-muted-foreground mb-1.5 text-[10px] font-semibold tracking-wider uppercase">
                Gems
              </p>
              <div className="space-y-1">
                {gemEntries.map((e) => (
                  <EntryRow key={e.name} e={e} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
