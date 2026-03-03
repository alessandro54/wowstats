# WoW BIS Storybook Documentation

This directory contains Storybook stories for the WoW BIS UI components, organized using Atomic Design principles.

## Structure

```text
stories/
├── atoms/          # Smallest UI building blocks
│   ├── class-hover-zone.stories.tsx
│   ├── clickable-tooltip.stories.tsx
│   ├── spec-heading.stories.tsx
│   ├── sticky-header.stories.tsx
│   ├── talent-icon.stories.tsx
│   └── theme-switcher.stories.tsx
├── molecules/      # (Coming soon) Combinations of atoms
├── organisms/      # (Coming soon) Complex components
└── README.md       # This file
```

## Atoms

### ClassHoverZone

Wrapper component that updates global hover context for synchronized class color effects across the UI.

**Key Features:**

- Updates global hover state on mouse enter/leave
- Works with HoverProvider context
- Visual state indicator in stories

### ClickableTooltip

Toggle-on-click tooltip component wrapping Radix UI Tooltip.

**Key Features:**

- Controlled open/close state
- Click to toggle (vs. hover-only)
- Supports all Radix placement options
- Rich content support

### SpecHeading

Displays class/spec heading with bracket information.

**Key Features:**

- Class-specific color theming via CSS variables
- Extracts bracket from URL pathname
- Auto-formats "Solo Shuffle" vs standard bracket names

### StickySpecHeader

Sticky header with progressive backdrop blur effect on scroll.

**Key Features:**

- CSS custom property for opacity (`--header-bg-opacity`)
- Dynamic backdrop-filter blur
- Smooth transitions based on scroll position

### TalentIcon

WoW talent icon display with optional tooltip and rank indicators.

**Key Features:**

- Configurable size and border color
- Partial rank visualization (diagonal clip)
- Optional clickable tooltip integration
- Image optimization via Next.js Image

### ThemeSwitcher

Three-way theme toggle (System, Light, Dark).

**Key Features:**

- next-themes integration
- Class-aware border coloring (reacts to hover state)
- Mounted state check to prevent hydration mismatch
- Lucide icons for visual clarity

## Running Storybook

```bash
# Development server
pnpm storybook

# Static build
pnpm build-storybook
```

Browse to http://localhost:6006

## Writing Stories

### Best Practices

1. **Use autodocs**: Add `tags: ["autodocs"]` to auto-generate component documentation
2. **Add descriptions**: Include component and story descriptions in parameters
3. **Define argTypes**: Provide controls and descriptions for better DX
4. **Multiple variants**: Show common use cases and edge cases
5. **Visual context**: Add wrapper divs, state indicators, or companion components

### Example Template

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { MyComponent } from "../../components/atoms/my-component"

const meta = {
  title: "Atoms/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Brief description of what this component does and when to use it.",
      },
    },
  },
  argTypes: {
    propName: {
      control: "select",
      options: ["option1", "option2"],
      description: "What this prop controls",
    },
  },
} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    propName: "option1",
  },
}

export const Variant: Story = {
  args: {
    propName: "option2",
  },
  parameters: {
    docs: {
      description: {
        story: "Specific use case description.",
      },
    },
  },
}
```

## Testing Philosophy

Stories serve as:

- **Visual regression tests** (via Storybook visual testing)
- **Component documentation** (via autodocs)
- **Development sandbox** (interactive controls)
- **Integration examples** (how components work together)

Unit tests (`.test.tsx`) focus on behavior and edge cases, while stories focus on visual states and user interactions.

## Dependencies

- `@storybook/react-vite` - Storybook framework
- Story files use relative imports from `../../components/`
- Decorators in `.storybook/preview.tsx` provide required context (ThemeProvider, HoverProvider)

## Next Steps

- [ ] Add molecules stories (bracket-selector, meta-bar-chart, etc.)
- [ ] Add organisms stories (equipment, talent-tree, etc.)
- [ ] Add interaction tests with `@storybook/test`
- [ ] Set up visual regression testing (Chromatic or similar)
