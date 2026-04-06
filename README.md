# WoW Insights — Frontend

**WoW Insights** tracks World of Warcraft PvP meta in real time. It analyzes live leaderboard data from US and EU servers to show what the best players are actually using — gear, enchants, gems, talents, and stat priorities — broken down by spec and bracket.

## Features

- **BiS Gear** — Most popular items per slot for any spec and bracket (2v2, 3v3, Solo Shuffle, Blitz)
- **Enchants & Gems** — Top enchant and gem choices with usage percentages
- **Talent Builds** — Full talent tree visualization with top build highlighted and per-node usage stats
- **Stat Priority** — Median stat distribution from top-ranked characters
- **Top Players** — Leaderboard of highest-rated players per spec, linkable to their full profile
- **Class Tierlist** — Meta ranking of all specs by bracket and role, with presence and win rate scores
- **Character Profiles** — Individual character pages showing their current equipment and talent loadout
- **Spec Particle Effects** — Canvas-based visual effects per spec (snow, blood, plague, venom drip, shadow smoke, etc.)
- **WebGL Background** — Custom raw WebGL FBM noise shader with ember particles on the homepage
- **Localization** — English and Spanish (Latin America) support

## Stack

- [Next.js 16](https://nextjs.org) — App Router, React Server Components, Suspense streaming
- [React 19](https://react.dev) with React Compiler
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- [Vitest](https://vitest.dev) + [Storybook 10](https://storybook.js.org)
- Raw WebGL (no Three.js)
- Cloudflare R2 + Image Transforms for CDN

## Requirements

- Node.js >= 22
- pnpm

## Setup

```bash
pnpm install
cp .env.example .env.local          # set API_URL if needed
pnpm dev                            # http://localhost:5123
```

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `API_URL` | `http://localhost:3000` | Rails API base URL |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:5123` | Used in OG metadata |

## Development

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # linting (oxlint)
pnpm typecheck    # type check
pnpm test         # all tests
pnpm test:unit    # unit tests only
pnpm storybook    # component explorer on :6006
pnpm perf:size    # bundle size check
pnpm format       # Biome formatter
```

## CI

Single pipeline (`.github/workflows/ci.yml`) runs on PRs to `develop` and `main`:
- Lint & typecheck
- Unit tests
- Chromatic visual tests
- Bundle size check (≤ 300KB gzip)
