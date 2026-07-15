# Summoner Atlas

League of Legends ARAM data analytics platform. Real-time champion win rates, augment rankings, build recommendations, and combo relationship graphs — powered by a Hextech-themed visualization layer.

## Features

- **Champion Rankings** — Win rates, pick rates, and confidence scoring across game modes.
- **Build Explorer** — Per-champion skill orders, summoner spells, and boot choices ranked by win rate and sample size.
- **Augment Explorer** — Optimal augment rankings with descriptions, icons, and champion synergy data.
- **Champion Compare** — Side-by-side stat comparison for any two champions.
- **Champion Search** — Real-time fuzzy search with inline win rates and confidence badges.
- **Atlas Graph** — Star-chart visualization of champion/augment combo relationships.
- **i18n** — Chinese, English, and Korean localizations with locale-aware name display.

## Tech Stack

| Layer       | Technology                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Framework   | [Next.js 16](https://nextjs.org/) (App Router)                                                      |
| UI          | React 19, [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Base UI) |
| Animation   | [GSAP](https://gsap.com/) + ScrollTrigger, [Framer Motion](https://www.framer.com/motion/)          |
| Charts      | [Recharts](https://recharts.org/), [D3.js](https://d3js.org/)                                       |
| State       | [Zustand](https://zustand.docs.pmnd.rs/)                                                            |
| Icons       | [Hugeicons](https://hugeicons.com/)                                                                 |
| Database    | [Supabase](https://supabase.com/) (PostgreSQL)                                                      |
| Language    | TypeScript 6                                                                                        |
| Lint/Format | oxlint, oxfmt                                                                                       |
| Package Mgr | pnpm (workspaces)                                                                                   |

## Architecture

### Data Pipeline

```
CommunityDragon CDN          resg.top API            Supabase (PostgreSQL)
(static assets)              (stats / combos)        (cache + persistence)
      │                           │                        │
      ▼                           ▼                        ▼
  Champion icons              Win rates              resg_cache (jsonb)
  Item / spell icons          Build combos           game_versions
  Augment images              Descriptions           static_champions
                                                    static_augments
      │                           │                        │
      └───────────────────────────┴────────────────────────┘
                                  │
                                  ▼
                     Next.js API Routes (/api/v1/)
                    (server-side, no client secrets)
                                  │
                                  ▼
                     Frontend Data Service
                    (client-side hydration)
```

### REST API

All endpoints under `/api/v1/`, returning a unified `{ data, meta }` envelope:

| Endpoint                    | Description              | Query Params                           |
| --------------------------- | ------------------------ | -------------------------------------- |
| `GET /api/v1/champions`     | Champion rankings        | `?search=`, `?sort=winRate`, `?limit=` |
| `GET /api/v1/champions/:id` | Champion detail + builds | —                                      |
| `GET /api/v1/augments`      | Augment rankings         | `?search=`, `?limit=`                  |
| `GET /api/v1/augments/:id`  | Augment detail           | —                                      |
| `GET /api/v1/items`         | Item stats + icons       | —                                      |
| `GET /api/v1/runes`         | Rune stats + icons       | —                                      |
| `GET /api/v1/versions`      | Game version history     | —                                      |

### Supabase Schema

| Table              | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| `resg_cache`       | JSONB cache for all computed data (rankings, combos, items, runes) |
| `static_champions` | Champion static data (id, alias, name_zh, name_en, image_url)      |
| `static_augments`  | Augment static data (id, name_zh, name_en, icon_url)               |
| `game_versions`    | Patch version history                                              |

### Cache Keys (resg_cache)

| Key Pattern                                     | Content                                           |
| ----------------------------------------------- | ------------------------------------------------- |
| `v2:champions:global:aram:{version}`            | 173 champions with win rates, matches, images     |
| `v2:augments:global:aram:{version}`             | 206 augments with descriptions, win rates, images |
| `v2:champion-combos:global:aram:{version}:{id}` | Skill orders, summoner spells, boots per champion |
| `items:global:aram:latest`                      | 50 items with stats and icons                     |
| `runes:global:aram:latest`                      | 40 runes with stats, paths, and icons             |

## Project Structure

```
summoner-atlas/
├── apps/web/
│   ├── app/
│   │   ├── [lang]/              # Localized pages
│   │   │   ├── champions/       # Rankings + detail
│   │   │   ├── augments/        # Rankings + detail
│   │   │   ├── builds/          # Build browser
│   │   │   ├── compare/         # Side-by-side compare
│   │   │   ├── search/          # Full-text search
│   │   │   ├── meta/            # Meta overview
│   │   │   ├── atlas/           # Graph visualization
│   │   │   └── patches/         # Version history
│   │   └── api/v1/              # RESTful data API
│   │       ├── supabase.ts      # Shared DB client
│   │       ├── champions/       # Champion endpoints
│   │       ├── augments/        # Augment endpoints
│   │       ├── items/           # Item endpoints
│   │       ├── runes/           # Rune endpoints
│   │       └── versions/        # Version endpoints
│   ├── components/              # App UI (command palette, charts, layout)
│   ├── hooks/                   # useTranslation, useLanguage
│   └── lib/                     # Data service, localizedName, utilities
├── packages/
│   ├── data-access/             # Supabase client
│   ├── ui/                      # Shared components (Base UI + shadcn)
│   └── i18n/                    # zh / en / ko translations
├── supabase/migrations/         # DB schema
└── data/                        # Reference data (dev only)
```

## Getting Started

### Prerequisites

- Node.js >= 24
- pnpm >= 11

### Setup

```bash
pnpm install
```

### Environment Variables

Create `apps/web/.env`:

```env
SUMMONER_ATLAS_SUPABASE_URL="https://your-project.supabase.co"
SUMMONER_ATLAS_SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

### Development

```bash
pnpm dev        # → http://localhost:3100
```

### Build

```bash
pnpm build
pnpm lint
pnpm fmt
```
