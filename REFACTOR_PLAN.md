# Frontend Refactor Plan

## Strategy: Hybrid (Feature-Sliced + Atomic Design)

**Why hybrid:**
- Pure atomic = `home-*`, `spec-*`, `meta-*` prefixes pollute molecules/
- Pure page-grouping = duplication of shared atoms (button, tooltip)
- Best: shared primitives at root (atomic) + page-owned compos in `features/`

## Target Structure

```
src/
├── components/                     # SHARED across pages (atomic design)
│   ├── ui/                         # shadcn primitives (unchanged)
│   ├── atoms/                      # Cross-page primitives only
│   │   ├── clickable-tooltip       # used 4+ pages
│   │   ├── talent-card
│   │   ├── talent-icon
│   │   ├── transition-link
│   │   ├── trend-arrow
│   │   ├── lazy-section, lazy-image
│   │   └── theme-switcher, theme-dropdown
│   ├── molecules/                  # Cross-page composed
│   │   ├── talent-list
│   │   ├── talent-tree-node, talent-tree-edges
│   │   ├── pvp-talents
│   │   ├── region-switcher, role-switcher
│   │   ├── bracket-dropdown, bracket-selector, bracket-panels
│   │   ├── distribution-tooltip
│   │   └── nav-class-hover-card
│   ├── organisms/                  # Cross-page complex
│   │   ├── talent-tree
│   │   ├── talents
│   │   ├── app-sidebar
│   │   ├── dynamic-background
│   │   └── nav-main
│   └── providers/                  # unchanged
│
├── features/                       # PAGE-OWNED feature modules
│   ├── home/
│   │   ├── components/
│   │   │   ├── home-hero
│   │   │   ├── home-bg-canvas
│   │   │   ├── home-ambient
│   │   │   ├── home-bracket-cards
│   │   │   ├── home-class-grid
│   │   │   ├── home-top-specs-list
│   │   │   ├── class-grid          # only used by home
│   │   │   ├── class-orbital       # only used by home-class-grid
│   │   │   └── scroll-hint         # only used by home
│   │   └── __tests__/
│   ├── character/
│   │   ├── components/
│   │   │   ├── character-hero
│   │   │   ├── character-equipment
│   │   │   │   ├── center-card     # extracted molecule
│   │   │   │   ├── slot-card       # extracted molecule
│   │   │   │   └── stat-bars       # extracted molecule
│   │   │   └── spec-particle-fx
│   │   └── __tests__/
│   ├── spec/                       # /pvp/[class]/[spec]/[bracket]
│   │   ├── components/
│   │   │   ├── equipment/          # split 610-line organism
│   │   │   │   ├── index           # main orchestrator <200 lines
│   │   │   │   ├── stat-card
│   │   │   │   ├── gem-grid
│   │   │   │   ├── item-slot
│   │   │   │   └── item-card
│   │   │   ├── top-players
│   │   │   ├── stat-priority
│   │   │   ├── spec-hero
│   │   │   ├── spec-stat-bar
│   │   │   ├── spec-bracket-cards
│   │   │   ├── spec-winrate-chart
│   │   │   ├── spec-distribution-chart
│   │   │   ├── spec-comparison-table
│   │   │   ├── pvp-spec-top-nav
│   │   │   ├── hero-tree
│   │   │   └── player-row
│   │   └── __tests__/
│   └── meta/                       # /pvp/meta
│       ├── components/
│       │   ├── meta-stats-dashboard
│       │   ├── meta-stats-table
│       │   ├── meta-stats-skeleton
│       │   ├── meta-tier-list
│       │   ├── meta-kpi-row
│       │   ├── meta-insights-panel
│       │   ├── meta-highlights
│       │   ├── top-performers
│       │   ├── diversity-meter
│       │   └── dist-list
│       └── __tests__/
│
├── shared/                         # Layout-only (used by app/layout.tsx)
│   ├── top-nav, top-nav-config
│   ├── app-footer
│   ├── page-transition             # convert to hook later
│   └── scroll-to-top               # convert to hook later
│
├── hooks/                          # existing
├── config/                         # existing
└── lib/                            # existing
```

## Phase Breakdown

### Phase 1: Move Page-Owned Components (No Logic Change)

**Goal:** Reorganize without breaking. Pure file moves + import updates.

1. Create `src/features/{home,character,spec,meta}/components/`
2. Move home-* + class-grid + class-orbital + scroll-hint → features/home/
3. Move character-* + spec-particle-fx → features/character/
4. Move equipment + spec-* + top-players + stat-priority + hero-tree + pvp-spec-top-nav + player-row → features/spec/
5. Move meta-* + top-performers + diversity-meter + dist-list + meta-highlights → features/meta/
6. Update all imports via codemod or grep+sed
7. Run tests + typecheck after each move

**Risk:** Low. Each move + test cycle.

### Phase 2: Decompose Oversized Components

**equipment.tsx (610 lines)** → split into:
- `equipment/index.tsx` (orchestrator, <150 lines)
- `equipment/stat-card.tsx`
- `equipment/gem-grid.tsx`
- `equipment/item-slot.tsx`
- Keep ItemCard separate

**character-equipment.tsx (373 lines)** → split into:
- `character-equipment/index.tsx`
- `character-equipment/center-card.tsx`
- `character-equipment/slot-card.tsx`

**meta-stats-table.tsx (331 lines)** → split into:
- `meta-stats-table/index.tsx`
- `meta-stats-table/row.tsx`
- `meta-stats-table/header.tsx`

**Risk:** Medium. Component extraction may break prop chains.

### Phase 3: Tooltip Consolidation

5 tooltip variants → unified system:

```tsx
<ClickableTooltip variant="default">
<ClickableTooltip variant="distribution" data={...}>
<ClickableTooltip variant="player" data={...}>
<ClickableTooltip variant="pvp-talent" data={...}>
<ClickableTooltip variant="talent-node" data={...}>
```

OR keep specialized variants but extract base layout:
```tsx
// atoms/tooltip-base.tsx (positioning, animation, click-outside)
// molecules/distribution-tooltip.tsx (uses tooltip-base)
// molecules/player-tooltip.tsx (uses tooltip-base)
```

**Recommend:** Option B (extract base). Less invasive, keeps type safety.

**Risk:** Medium. Tooltip behavior is interactive—needs visual regression check.

### Phase 4: Test Coverage Push

**Critical missing tests (P1):**
- character-hero
- equipment + sub-molecules (after split)
- character-equipment sub-molecules
- spec-winrate-chart, spec-distribution-chart
- meta-stats-table, meta-stats-skeleton

**Pattern:** Follow `character-equipment.test.tsx` `makeItem()` factory pattern.

**Target:** 56% → 80% coverage.

### Phase 5: Atom Cleanup

- `page-transition` → `hooks/use-view-transition.ts`
- `scroll-to-top` → `hooks/use-scroll-to-top.ts`
- Remove now-empty atoms

### Phase 6: Documentation

- JSDoc on equipment, character-equipment, talents, talent-tree
- Add `features/<page>/README.md` per feature with overview
- Update root README with new structure

## Code Quality Preservation

### Lock-Down Rules (Add to AGENTS.md)

1. **Component placement decision tree:**
   - Used by 1 page only → `features/<page>/components/`
   - Used by 2+ pages → `components/molecules/` or `components/organisms/`
   - UI primitive (no domain logic) → `components/ui/` or `components/atoms/`

2. **Size limits:**
   - Atom: <100 lines
   - Molecule: <200 lines
   - Organism: <300 lines (hard ceiling)
   - Exceeded → split

3. **Test requirements:**
   - All molecules + organisms require test
   - PR blocks if new molecule/organism without test

4. **No page-specific prefixes in molecules/**:
   - `home-*`, `spec-*`, `meta-*` belong in features/
   - Generic prefixes OK (`bracket-*`, `talent-*`, `pvp-*`)

### Lefthook Pre-commit Additions

```yaml
size-check:
  glob: "src/components/**/*.tsx"
  run: |
    for f in {staged_files}; do
      lines=$(wc -l < "$f")
      max=300
      [[ "$f" =~ /atoms/ ]] && max=100
      [[ "$f" =~ /molecules/ ]] && max=200
      [ "$lines" -gt "$max" ] && echo "FAIL: $f ($lines > $max)" && exit 1
    done

test-coverage:
  glob: "src/components/(molecules|organisms)/**/*.tsx"
  run: |
    for f in {staged_files}; do
      dir=$(dirname "$f")
      base=$(basename "$f" .tsx)
      [ ! -f "$dir/__tests__/$base.test.tsx" ] && \
        echo "FAIL: missing test for $f" && exit 1
    done
```

## Execution Order (PRs)

| PR | Scope | Risk | Tests required |
|----|-------|------|---------------|
| 0 | Delete dead `/characters` route | None | Verify no inbound links |
| 1 | Move home/* + scroll-hint → features/home | Low | Run existing |
| 2 | Move character/* → features/character | Low | Run existing |
| 3 | Move meta/* → features/meta | Low | Run existing |
| 4 | Move spec/* + pvp-spec-top-nav → features/spec | Low | Run existing |
| 5 | Split equipment.tsx → sub-molecules | Med | Add new tests |
| 6 | Split character-equipment.tsx | Med | Add new tests |
| 7 | Split meta-stats-table.tsx | Med | Add new tests |
| 8 | Tooltip base extraction | Med | Visual regression |
| 9 | Add P1 missing tests | Low | New tests |
| 10 | Atom→hook conversions | Low | Update imports |
| 11 | JSDoc + README docs | None | None |
| 12 | Lefthook size/test rules | Low | CI verification |

## Estimated Effort

- Phase 1 (moves): 4-6 PRs, 2-3 hours each
- Phase 2 (split): 3 PRs, 3-4 hours each
- Phase 3 (tooltip): 1 PR, 4 hours
- Phase 4 (tests): 1-2 PRs, 4-6 hours total
- Phase 5 (cleanup): 1 PR, 1 hour
- Phase 6 (docs): 1 PR, 2 hours

**Total: ~30-40 hours, 12 PRs**

## Resolved Decisions

1. **`/characters` route** — DELETE. Stub returns null. Only `/character/...` is live.
2. **`scroll-hint`** → features/home/ (only home uses)
3. **`pvp-spec-top-nav`** → features/spec/
4. **`spec-particle-fx`** → keep in shared molecules/ (app-wide, used in character + potential other pages)
5. **Index files** → SKIP. Direct paths clearer, easier to grep usage. Add later only if pages import 5+ compos.

## Success Metrics

- Test coverage: 56% → 80%
- No component >300 lines
- Zero page-prefixed components in `components/molecules/`
- All shared components have JSDoc
- Lefthook enforces size + test rules
