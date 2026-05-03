# AGENTS.md — bis-web (Next.js Frontend)

Shared guidance for all AI agents working in `bis-web/`.

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
pnpm perf:size        # Bundle size check (≤ 300KB gzip)
```

## Environment Variables

- `API_URL` — Rails API base URL (default `http://localhost:3000`)
- `NEXT_PUBLIC_SITE_URL` — used in root layout `metadataBase` and OG metadata (default `http://localhost:5123`)

## Architecture

### Framework & Stack

- **Next.js 16** with App Router, React Server Components, and Suspense streaming
- **React 19** — React Compiler enabled (`reactCompiler: true`), no manual `useMemo`/`useCallback` needed
- **TypeScript 5.9** — strict mode, path alias `@/*` → `src/*`
- **Tailwind v4** + Radix UI primitives + **shadcn/ui** (new-york style)
- **Vitest** for unit tests; **Storybook 10** for component documentation
- **Biome** for formatting; **oxlint** for linting
- **Raw WebGL** for homepage background (no Three.js)
- **Cloudflare R2 + Image Transforms** for CDN with auto-resize/AVIF

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
├── components/             # SHARED across 2+ pages (atomic design)
│   ├── atoms/              # Basic UI building blocks (cross-page only)
│   │   └── __tests__/      # Tests (.test.tsx) AND stories (.stories.tsx)
│   ├── molecules/          # Mid-level cross-page components
│   │   └── __tests__/      # Tests AND stories (colocated)
│   ├── organisms/          # High-level cross-page sections
│   │   └── __tests__/      # Tests AND stories (colocated)
│   ├── providers/          # React context providers
│   └── ui/                 # shadcn/ui primitives
├── features/               # PAGE-OWNED feature modules
│   ├── home/components/    # Used only by app/page.tsx
│   ├── character/components/ # Used only by /character/[...]
│   ├── spec/components/    # Used only by /pvp/[class]/[spec]/[bracket]
│   └── meta/components/    # Used only by /pvp/meta/...
├── config/
│   ├── cdn-config.ts       # CDN_BASE, cdnImage() for Cloudflare transforms
│   └── wow/                # WoW class/spec/bracket config + app config
├── hooks/                  # Custom React hooks
│   ├── use-sortable-table.ts
│   ├── use-class-panel-state.ts
│   └── ...
├── lib/
│   ├── api.ts              # All backend fetch functions + types
│   ├── fx/                 # Visual effects
│   │   ├── shaders/        # .vert/.frag GLSL files (imported via raw loader)
│   │   ├── particles/      # Canvas2D particle runners (snow, blood, plague, etc.)
│   │   ├── atmospheres/    # CSS atmosphere layers per spec
│   │   ├── home-bg.ts      # Homepage background particle data + constants
│   │   └── home-bg-webgl.ts # Raw WebGL renderer for homepage
│   ├── utils/              # cn(), titleizeSlug(), shannonEntropy(), etc.
│   └── wow/                # Lookup helpers for classes, specs, brackets
└── types/
    └── shaders.d.ts        # TypeScript declarations for .glsl/.vert/.frag imports
```

### Route Structure

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Home — hero + class grid (Suspense streamed) |
| `/pvp/[classSlug]/[specSlug]` | `app/pvp/[classSlug]/[specSlug]/page.tsx` | Spec index — bracket selector |
| `/pvp/[classSlug]/[specSlug]/[bracket]` | `app/pvp/[classSlug]/[specSlug]/[bracket]/page.tsx` | Main PvP BiS page (Suspense streamed) |
| `/pvp/meta/[bracket]/[role]` | `app/pvp/meta/[bracket]/[role]/page.tsx` | Meta tierlist (Suspense streamed) |
| `/character/[region]/[realm]/[name]` | `app/character/[region]/[realm]/[name]/page.tsx` | Character profile |

All pages use `export const dynamic = "force-dynamic"`. Data-heavy pages use `<Suspense>` with skeleton fallbacks for streaming.

### Provider Chain (Root Layout)

```
ThemeProvider (next-themes, dark mode)
  └─ HoverProvider (tracks hovered WoW class slug globally)
       └─ SidebarProvider (shadcn sidebar state)
            └─ DynamicBackground (animated gradient, reacts to hover + meta page top spec)
                 └─ AppSidebar + SidebarInset
                      └─ TopNavProvider (dynamic top nav config)
                           └─ TopNav + main content + AppFooter
```

### Data Fetching Pattern

All API calls are server-side (RSC) inside `<Suspense>` boundaries. Page shell renders instantly, data streams in.

```typescript
// Page shell renders immediately
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AsyncContent />  {/* Data fetching happens here */}
    </Suspense>
  )
}

// Async content streams in when API responds
async function AsyncContent() {
  const data = await fetchData().catch(() => fallback)
  return <Component data={data} />
}
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
  iconRemasteredUrl?: string  // cdnImage() transform URL
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
  effect?: SpecParticleEffect    // "snow" | "blood" | "shadowsmoke" | "venomdrip" | ...
  atmosphere?: SpecAtmosphere    // "frost" | "toxic" | "shadow" | "fire" | ...
}
```

One file per class in `src/config/wow/classes/`: `warrior.ts`, `druid.ts`, etc.

### CDN (`cdn-config.ts`)

```typescript
CDN_BASE = "https://cdn.wowinsights.xyz"
// Direct asset URLs (banners, animations, splash art)

cdnImage(path, width)
// Returns Cloudflare Image Transform URL for auto-resize + AVIF
// Uses R2 origin as source (can't self-reference cdn.wowinsights.xyz)
```

---

## Visual Effects (`src/lib/fx/`)

### Homepage Background (WebGL)
- `home-bg.ts` — particle constants, init/update logic, device detection
- `home-bg-webgl.ts` — raw WebGL renderer (FBM shader + point sprites)
- `shaders/*.vert`, `shaders/*.frag` — GLSL files imported via custom Turbopack loader (`loaders/raw.js`)
- GPU benchmark: renders 8 test frames, falls back to CSS if device can't sustain 15fps

### Spec Particle Effects (Canvas2D)
- `particles/snow.ts`, `blood.ts`, `plague.ts`, `rainoffire.ts`, `coinrain.ts`, `shadowsmoke.ts`, `venomdrip.ts`
- Each exports `runX(ctx, W, H): () => void` (returns cleanup function)
- Registered in `spec-particle-fx.tsx` via `RUNNERS` record

### Spec Atmospheres (CSS)
- `atmospheres/frost.tsx`, `toxic.tsx`, `shadow.tsx`, `fire.tsx`, etc.
- Pure CSS gradient overlays, no JS animation
- Registered in `spec-particle-fx.tsx` via `ATMOSPHERES` record
- Canvas renders at `z-index: -10`, atmospheres at `z-index: -1`

---

## Components

### Hybrid Atomic Design + Feature-Sliced

**`components/`** = SHARED across 2+ pages (atomic design)

- **Atoms** (`src/components/atoms/`) — Cross-page primitives: `clickable-tooltip`, `talent-icon`, `talent-card`, `transition-link`, `lazy-section`, `theme-switcher`
- **Molecules** (`src/components/molecules/`) — Cross-page composed: `talent-list`, `talent-tree-node`, `pvp-talents`, `bracket-dropdown`, `region-switcher`, `distribution-tooltip`, `spec-particle-fx`
- **Organisms** (`src/components/organisms/`) — Cross-page sections: `talents`, `talent-tree`, `app-sidebar`, `dynamic-background`, `nav-main`, `hero-section`
- **UI** (`src/components/ui/`) — shadcn primitives

**`features/<page>/components/`** = PAGE-OWNED, used by exactly one page tree

- `features/home/` — `home-hero`, `home-bg-canvas`, `home-class-grid`, `scroll-hint`
- `features/character/` — `character-hero`, `character-equipment/` (split: index, slot-card, center-card)
- `features/spec/` — `equipment/` (split), `top-players`, `stat-priority`, `spec-*`, `pvp-spec-top-nav`
- `features/meta/` — `meta-stats-dashboard`, `meta-stats-table`, `meta-tier-list`, `meta-insights-panel`, `class-wheel`, `top-performers`, `diversity-meter`

### Component Placement Rules

1. Used by 1 page only → `features/<page>/components/`
2. Used by 2+ pages → `components/molecules/` or `components/organisms/`
3. UI primitive (no domain logic) → `components/ui/` or `components/atoms/`

### Size Limits (enforced by `lefthook` pre-commit)

- Atoms: <100 lines
- Molecules: <200 lines
- Organisms / features components: <300 lines

Exceeded → split into sub-files in a directory: `foo.tsx` → `foo/{index,sub-a,sub-b}.tsx`.

### Test Requirements

- All molecules + organisms + features components require a colocated test file
- Pre-commit hook (`scripts/check-test-exists.sh`) blocks commits without tests

Add new shadcn components: `pnpm dlx shadcn@latest add <component>`

### Hooks

```typescript
useActiveColor(defaultSlug?)      // CSS var for hovered class color
useIsMobile()                     // window width < 768px
useSortableTable(entries, comparators, defaultKey)  // Generic sortable table
useClassPanelState(classes)       // State management for class panel slider
```

### Providers

| Provider | Hook(s) | Purpose |
|---|---|---|
| `hover-provider.tsx` | `useHoverSlug()`, `useSetHoverSlug()` | Global hovered WoW class (drives color changes) |
| `theme-provider.tsx` | (wraps next-themes) | Dark/light mode |
| `top-nav-provider.tsx` | `useTopNav()` | Dynamic top nav config per page |

---

## Testing

- **Tests and stories are colocated** in `__tests__/` directories next to their components
- Each component has both `.test.tsx` and `.stories.tsx` in the same `__tests__/` folder
- Storybook config points to `src/components/**/*.stories.tsx`
- Run: `pnpm test:unit` (Vitest), `pnpm storybook` (component explorer)

## Performance

- **Bundle size budget**: ≤ 300KB gzip (checked in CI via `size-limit`)
- **No Three.js** — replaced with raw WebGL (~175KB savings)
- **Cloudflare Image Transforms** — `cdnImage()` auto-resizes + converts to AVIF
- **Suspense streaming** — page shell renders instantly, data streams in
- **LazySection** — below-fold content deferred via IntersectionObserver
- **Preconnect** — `cdn.wowinsights.xyz` and `render.worldofwarcraft.com`

## Shader Imports

GLSL files (`.vert`, `.frag`, `.glsl`) are imported as strings via:
- **Turbopack**: `loaders/raw.js` configured in `next.config.ts` → `turbopack.rules`
- **Vitest**: inline transform plugin in `vitest.config.ts`
- **TypeScript**: declarations in `src/types/shaders.d.ts`

## Key Gotchas

1. **Shuffle bracket**: API expects `"shuffle-warrior-arms"` not `"shuffle"`. Use `apiBracket()`.
2. **Class slug API mismatch**: `"death-knight"` → `"deathknight"` in Blizzard API. Use `API_CLASS_SLUG` map.
3. **Item icons**: Use `<img>` not `<Image>` for item/enchant/gem icons (dynamic CDN domains).
4. **React Compiler**: Do not add manual `useMemo`/`useCallback` — compiler handles it.
5. **Top nav is dynamic**: Set via `useTopNav()` in layout/pages; resets on navigation.
6. **Hover state is global**: `HoverProvider` tracks one class slug app-wide for color transitions.
7. **CDN transforms**: `cdnImage()` always uses R2 origin URL as source — Cloudflare can't transform from its own domain.
8. **WebGL strict mode**: `dispose()` must NOT call `loseContext()` — React strict mode re-runs effects on the same canvas.
9. **Shader precision**: FBM hash requires `precision highp float` — `mediump` produces garbage on some GPUs.
