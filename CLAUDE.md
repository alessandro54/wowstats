# CLAUDE.md — bis-web (Next.js Frontend)

Guidance for Claude Code when working in this directory.

## Commands

All commands run from `bis-web/`. Package manager: **pnpm**.

```bash
pnpm dev              # Dev server on :5123
pnpm build            # Production build
pnpm start            # Run production build
pnpm lint             # oxlint
pnpm typecheck        # tsc --noEmit
pnpm test             # Vitest
pnpm test:unit        # Unit tests only
pnpm test:coverage    # Coverage report
pnpm storybook        # Storybook on :6006
pnpm build-storybook  # Build Storybook static
pnpm format           # Biome formatter
pnpm format:check     # Check formatting
pnpm stylelint        # Lint CSS
```

## Environment Variables

- `API_URL` — Rails API base URL (default `http://localhost:3000`)
- `NEXT_PUBLIC_SITE_URL` — used in root layout `metadataBase` and OG metadata (default `http://localhost:5123`)

## Architecture

### Framework & Stack

- **Next.js 16** with App Router and React Server Components
- **React 19** — React Compiler enabled (`reactCompiler: true`), no manual `useMemo`/`useCallback` needed
- **TypeScript 5.9** — strict mode, path alias `@/*` → `src/*`
- **Tailwind v4** + Radix UI primitives + **shadcn/ui** (new-york style)
- **Vitest** for unit tests; **Storybook 10** for component documentation
- **Biome** for formatting; **oxlint** for linting

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/
│   ├── atoms/              # Basic UI building blocks
│   ├── molecules/          # Mid-level feature components
│   ├── organisms/          # High-level feature sections
│   ├── providers/          # React context providers
│   └── ui/                 # shadcn/ui primitives
├── config/
│   └── wow/                # WoW class/spec/bracket config + app config
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api.ts              # All backend fetch functions + types
│   ├── utils/              # cn(), titleizeSlug(), formatBracket(), etc.
│   └── wow/                # Lookup helpers for classes, specs, brackets
└── stories/                # Storybook stories
```

### Route Structure

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home — class/spec selection (ClassPanels / ClassAccordion) |
| `/pvp/[classSlug]/[specSlug]` | `app/pvp/[classSlug]/[specSlug]/page.tsx` | Spec index — bracket selector |
| `/pvp/[classSlug]/[specSlug]/[bracket]` | `app/pvp/[classSlug]/[specSlug]/[bracket]/page.tsx` | Main PvP BiS page |
| `/pvp/meta/[bracket]/[role]` | `app/pvp/meta/[bracket]/[role]/page.tsx` | Meta tierlist by bracket + role |
| `/character/[region]/[realm]/[name]` | `app/character/[region]/[realm]/[name]/page.tsx` | Character profile |

All pages use `export const dynamic = "force-dynamic"` and `cache: "no-store"` fetches.

### Provider Chain (Root Layout)

```
ThemeProvider (next-themes, dark mode)
  └─ HoverProvider (tracks hovered WoW class slug globally)
       └─ SidebarProvider (shadcn sidebar state)
            └─ DynamicBackground (animated gradient)
                 └─ AppSidebar + SidebarInset
                      └─ TopNavProvider (dynamic top nav config)
                           └─ TopNav + main content + AppFooter
```

### Data Fetching Pattern

All API calls are server-side (RSC). Errors are silenced with `.catch(() => [])` so pages render empty states rather than crashing.

```typescript
export const dynamic = "force-dynamic"

const [items, enchants, gems, talents, topPlayers] = await Promise.all([
  fetchItems(bracket, spec.id, locale).catch(() => []),
  fetchEnchants(bracket, spec.id, locale).catch(() => []),
  fetchGems(bracket, spec.id, locale).catch(() => ({ meta: {...}, talents: [] })),
  fetchTalents(bracket, spec.id, locale).catch(() => ({ ... })),
  fetchTopPlayers(bracket, spec.id, region, locale).catch(() => ({ ... })),
])
```

### Localization

- Supported locales: `"en_US"` (default), `"es_MX"`
- `getLocale()` in `src/lib/locale.ts` reads from a `locale` cookie (server-side)
- Locale is passed as optional last param to all API fetch functions

---

## WoW Configuration (`src/config/wow/`)

### Classes (`classes-config.ts` + individual class files)

```typescript
WOW_CLASSES: WowClassConfig[]  // 13 classes

interface WowClassConfig {
  id: number
  name: string            // "Warrior"
  slug: WowClassSlug      // "warrior"
  iconUrl: string
  iconRemasteredUrl?: string
  bannerUrl?: string
  bgGradient?: string
  specs: WowClassSpec[]
}

interface WowClassSpec {
  id: number              // Blizzard spec ID, e.g. 71
  name: string            // "arms"
  url: string             // "/pvp/warrior/arms"
  iconUrl: string
  iconRemasteredUrl?: string
  splash?: { url: string; position?: string }
  animationUrl?: string
}
```

One file per class in `src/config/wow/classes/`: `warrior.ts`, `druid.ts`, etc.

### Brackets (`brackets-config.ts`)

```typescript
BRACKETS: BracketConfig[]  // 2v2, 3v3, shuffle

// Slugs: "2v2" | "3v3" | "shuffle"
// Note: shuffle API bracket is "shuffle-{classSlug}-{specSlug}" or "shuffle-overall"
// Use apiBracket(bracket, classSlug, specSlug) from src/config/wow/app-config.ts
```

### App Config (`app-config.ts`)

```typescript
// Class slug mapping for Blizzard API format
API_CLASS_SLUG: Record<string, string>  // e.g. "death-knight" → "deathknight"

// Build full API bracket string
apiBracket(bracket: string, classSlug: string, specSlug: string): string
// "shuffle" → "shuffle-warrior-arms"; others pass through as-is

// Tier scoring
tier(normPct: number): "S" | "A" | "B" | "C" | "D"
TIER_COLORS: Record<Tier, string>

TIERLIST_LINKS  // Meta tierlist nav links
```

### Equipment Config (`equipment-config.ts`)

```typescript
SLOT_ORDER: string[]   // 16 slots in display order
SLOT_LABELS: Record<string, string>
QUALITY_COLORS: Record<string, string>  // EPIC=#a335ee, RARE=#0070dd, etc.

formatSlot(slot: string): string
formatSocketType(type: string): string
getStatMeta(stat: string): { label: string; color?: string }
```

### CDN (`cdn-config.ts`)

```typescript
CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL ?? "https://pub-627f5a049a2d470c85b1b70cbd99a5ce.r2.dev"
// Used for remastered class/spec icons, splash art, animations
// Set NEXT_PUBLIC_CDN_URL in .env.local to override
```

---

## API Layer (`src/lib/api.ts`)

Base URL: `process.env.API_URL ?? "http://localhost:3000"`

All functions use `cache: "no-store"`. Internal helper: `apiFetch<T>(path, params, locale?)`.

### Fetch Functions

```typescript
fetchItems(bracket, specId, locale?)       → MetaItem[]
  // GET /api/v1/pvp/meta/items?bracket=&spec_id=&locale=

fetchEnchants(bracket, specId, locale?)    → MetaEnchant[]
  // GET /api/v1/pvp/meta/enchants?bracket=&spec_id=&locale=

fetchGems(bracket, specId, locale?)        → MetaGem[]
  // GET /api/v1/pvp/meta/gems?bracket=&spec_id=&locale=

fetchTalents(bracket, specId, locale?)     → TalentsResponse
  // GET /api/v1/pvp/meta/talents?bracket=&spec_id=&locale=

fetchTopPlayers(bracket, specId, region?, locale?)  → TopPlayersResponse
  // GET /api/v1/pvp/meta/top_players?bracket=&spec_id=&region=&locale=

fetchStatPriority(bracket, specId, locale?)         → StatPriorityResponse
  // GET /api/v1/pvp/meta/stat_priority?bracket=&spec_id=&locale=

fetchClassDistribution({ seasonId, bracket, region, role }, locale?)  → ClassDistributionResponse
  // GET /api/v1/pvp/meta/class_distribution?season_id=&bracket=&region=&role=&locale=

fetchCharacter(region, realm, name, locale?)   → CharacterProfile | null
  // GET /api/v1/characters/REGION/REALM/NAME — returns null on error
```

### Key Types

```typescript
MetaItem        { item: { id, blizzard_id, name, icon_url, quality }, slot, usage_count, usage_pct, crafted, top_crafting_stats }
MetaEnchant     { enchantment: { id, blizzard_id, name }, slot, usage_count, usage_pct }
MetaGem         { item: { ... }, slot, socket_type, usage_count, usage_pct }
MetaTalent      { talent: { id, blizzard_id, name, description, talent_type, node_id, display_row, display_col, max_rank, icon_url, prerequisite_node_ids }, usage_count, usage_pct, in_top_build, top_build_rank, tier }
TalentsResponse { meta: { bracket, spec_id, total_players, total_weighted, snapshot_at }, talents: MetaTalent[] }
TopPlayer       { name, realm, region, rating, wins, losses, rank, score, avatar_url, class_slug }
CharacterProfile { name, realm, region, class_slug, pvp_entries, equipment, talents, stat_pcts, avatar_url, inset_url }
ClassDistributionSpec { class, spec, spec_id, role, count, meta_score, presence_score, winrate_score, rating_score, ... }
StatPriorityResponse  { bracket, spec_id, stats: { stat, median }[] }
```

---

## Components

### Atomic Design

- **Atoms** (`src/components/atoms/`) — `talent-icon.tsx`, `item-card.tsx`, `dist-list.tsx`, `spec-heading.tsx`, `sticky-header.tsx`, `theme-switcher.tsx`, etc.
- **Molecules** (`src/components/molecules/`) — `equipment.tsx`, `pvp-talents.tsx`, `top-players.tsx`, `bracket-selector.tsx`, `class-panels.tsx`, `meta-bar-chart.tsx`, `meta-donut-chart.tsx`, `meta-spec-table.tsx`, `talent-tree-node.tsx`, etc.
- **Organisms** (`src/components/organisms/`) — `app-sidebar.tsx`, `equipment.tsx`, `talent-tree.tsx`, `talents.tsx`, `hero-section.tsx`, `stat-priority.tsx`, `dynamic-background.tsx`
- **UI** (`src/components/ui/`) — shadcn primitives: `button`, `card`, `sidebar`, `tooltip`, `dropdown-menu`, `hover-card`, `skeleton`, `table`, `select`, `sheet`, `avatar`, etc.

Add new shadcn components: `pnpm dlx shadcn@latest add <component>`

### Providers

| Provider | Hook(s) | Purpose |
|---|---|---|
| `hover-provider.tsx` | `useHoverSlug()`, `useSetHoverSlug()` | Global hovered WoW class (drives color changes) |
| `theme-provider.tsx` | (wraps next-themes) | Dark/light mode |
| `top-nav-provider.tsx` | `useTopNav()` | Dynamic top nav config per page |

---

## Hooks (`src/hooks/`)

```typescript
useActiveColor(defaultSlug?)  // Returns CSS var for hovered class color; falls back to defaultSlug then --color-primary
useIsMobile()                 // True if window width < 768px
```

---

## Utilities (`src/lib/`)

```typescript
// utils/index.ts
cn(...inputs)                              // clsx + tailwind-merge
titleizeSlug(slug)                         // "death-knight" → "Death Knight"
formatRealm(realm)                         // alias for titleizeSlug
winRate(wins, losses)                      // "73%" or "—"
formatBracket(bracket)                     // "shuffle-overall" → "Solo Shuffle"

// wow/classes.ts
getWowClassBySlug(slug)
getWowClassById(id)
getAllClasses()

// wow/specs.ts
getSpecBySlug(classSlug, specSlug)
getSpecById(specId)                        // returns { class, spec }
getAllSpecs()

// wow/brackets.ts
getBracketBySlug(slug)
isValidBracketSlug(slug)
```

---

## Styling Conventions

- **CSS variables for class colors**: `var(--color-class-warrior)`, `var(--color-class-death-knight)`, etc.
- **CSS variables for stat colors**: `var(--color-stat-haste)`, etc.
- Use `<Image />` (next/image) for `render.worldofwarcraft.com` and CDN URLs
- Use `<img />` for item/enchant/gem icons — these come from arbitrary Blizzard CDN subdomains not in the allowlist
- Dark mode: `<html suppressHydrationWarning>` + `ThemeProvider`

## Image Domains (`next.config.ts`)

Only two domains allowed for `<Image />`:
- `render.worldofwarcraft.com` — official WoW assets
- `pub-627f5a049a2d470c85b1b70cbd99a5ce.r2.dev` — custom CDN (remastered icons, splash art)

---

## Testing

- **Vitest** unit tests alongside components (`.test.tsx`)
- **Storybook** stories alongside components (`.stories.tsx`)
- All atoms, molecules, and organisms have both `.test.tsx` and `.stories.tsx`
- Run: `pnpm test`, `pnpm storybook`

## Key Gotchas

1. **Shuffle bracket**: API expects `"shuffle-warrior-arms"` not `"shuffle"`. Use `apiBracket()`.
2. **Class slug API mismatch**: `"death-knight"` → `"deathknight"` in Blizzard API. Use `API_CLASS_SLUG` map.
3. **Item icons**: Use `<img>` not `<Image>` for item/enchant/gem icons (dynamic CDN domains).
4. **React Compiler**: Do not add manual `useMemo`/`useCallback` — compiler handles it.
5. **Top nav is dynamic**: Set via `useTopNav()` in layout/pages; resets on navigation.
6. **Hover state is global**: `HoverProvider` tracks one class slug app-wide for color transitions.
