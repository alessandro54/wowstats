# WoW Insights — Frontend

**WoW Insights** tracks World of Warcraft PvP meta in real time. It analyzes live leaderboard data from US and EU servers to show what the best players are actually using — gear, enchants, gems, talents, and stat priorities — broken down by spec and bracket.

## Features

- **BiS Gear** — Most popular items per slot for any spec and bracket (2v2, 3v3, Solo Shuffle)
- **Enchants & Gems** — Top enchant and gem choices with usage percentages
- **Talent Builds** — Full talent tree visualization with top build highlighted and per-node usage stats
- **Stat Priority** — Median stat distribution from top-ranked characters
- **Top Players** — Leaderboard of highest-rated players per spec, linkable to their full profile
- **Class Tierlist** — Meta ranking of all specs by bracket and role, with presence and win rate scores
- **Character Profiles** — Individual character pages showing their current equipment and talent loadout
- **Localization** — English and Spanish (Latin America) support

## Stack

- [Next.js 16](https://nextjs.org) — App Router, React Server Components
- [React 19](https://react.dev) with React Compiler
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com)
- [Vitest](https://vitest.dev) + [Storybook](https://storybook.js.org)

## Requirements

- Node.js >= 22
- pnpm
- The [bis Rails API](../bis/) running locally (or set `API_URL`)

## Setup

```bash
pnpm install
cp .env.example .env.local          # set API_URL, NEXT_PUBLIC_CDN_URL if needed
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
pnpm lint         # linting
pnpm typecheck    # type check
pnpm test         # unit tests
pnpm storybook    # component explorer on :6006
```
