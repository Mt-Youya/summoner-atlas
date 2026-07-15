# Summoner Atlas

League of Legends / Teamfight Tactics data analytics platform. Real-time champion win rates, augment rankings, meta trends, and combo relationship graphs — powered by a Hextech-themed visualization layer.

## Features

- **Champion Rankings** — Browse top-performing champions across game modes with win rates, pick rates, and confidence scoring.
- **Trend Analysis** — Track climbing and falling champions with diverging visual comparisons.
- **Augment Explorer** — Discover optimal augment choices with champion synergy recommendations.
- **Atlas Graph** — Interactive star-chart visualization of champion/augment combo relationships.
- **Champion Search** — Real-time search with inline win rates and confidence badges.
- **Multi-mode Support** — ARAM, Summoner's Rift, TFT, and Arena (data coverage varies by mode).
- **i18n** — Chinese, English, and Korean localizations.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| Animation | [GSAP](https://gsap.com/) + ScrollTrigger, [Framer Motion](https://www.framer.com/motion/) |
| Charts | [Recharts](https://recharts.org/), [D3.js](https://d3js.org/) |
| State | [Zustand](https://zustand.docs.pmnd.rs/) |
| Icons | [Hugeicons](https://hugeicons.com/) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Language | TypeScript 6 |
| Lint/Format | oxlint, oxfmt |
| Package Manager | pnpm (workspaces) |

## Project Structure

```
summoner-atlas/
├── apps/
│   └── web/                # Next.js web application
│       ├── app/[lang]/      # Localized routes (atlas, champions, augments, builds, compare, meta, etc.)
│       ├── components/      # App-specific UI components
│       ├── hooks/           # Custom React hooks
│       └── lib/             # Data services, utilities
├── packages/
│   ├── data-access/         # Supabase client & database layer
│   ├── ui/                  # Shared UI component library (Base UI + shadcn)
│   └── i18n/                # Translation system (zh / en / ko)
└── supabase/
    └── migrations/          # Database schema migrations
```

## Getting Started

### Prerequisites

- Node.js >= 24
- pnpm >= 11

### Setup

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The dev server starts at [http://localhost:3100](http://localhost:3100).

### Build

```bash
pnpm build
```

### Lint & Format

```bash
pnpm lint
pnpm fmt
```

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

## License

This project is not affiliated with Riot Games. League of Legends and Teamfight Tactics are trademarks of Riot Games, Inc.
