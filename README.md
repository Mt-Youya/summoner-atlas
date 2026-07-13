# Summoner Atlas

> A cross-region data map for League of Legends.

[简体中文](README.zh.md) · [한국어](README.ko.md)

Summoner Atlas is a League of Legends data platform designed to help players understand champions, items, runes, and play trends across regions, patches, and game modes.

The project is currently in the redesign-planning stage. Read [REDESIGN_PLAN.md](REDESIGN_PLAN.md) for the complete product, design, and implementation specification.

![Summoner Atlas logo](public/brand/summoner-atlas-logo-concept.png)

## Product goals

- Support multiple regions, including China, Korea, North America, Taiwan, and Europe.
- Support Summoner's Rift, ARAM, Arena, and future game modes.
- Surface data for champions, augments, items, runes, patch changes, and build combinations.
- Help users make fast, reliable decisions with patch context and sample-size signals.

## Planned capabilities

- Global search for champion names, Chinese pinyin, aliases, and augment names.
- Champion and augment rankings with patch, region, mode, role, quality, and sort filters.
- Champion detail pages with recommendations, abilities, items, runes, augments, and combinations.
- Augment detail pages with reverse champion discovery.
- Combination research and patch-trend analysis.
- User accounts, third-party account linking, preferences, and an admin console.

## Planned stack

- Next.js 16
- TypeScript
- pnpm monorepo
- shadcn/ui with Base UI primitives
- Zustand
- Hugeicons

## Design principles

- Show actionable conclusions before raw data.
- Make fast lookup work across devices. Mobile layouts must not compress desktop tables.
- Make the patch, update time, sample size, and confidence level explicit.
- Build with accessible semantics, focus states, and feedback states.
- Keep the visual identity original. Do not use Riot Games logos or official game assets as brand marks.

## Documentation

- [Redesign implementation plan](REDESIGN_PLAN.md)
- [简体中文 README](README.md)
- [한국어 README](README.ko.md)

## Development status

This repository currently contains product and frontend redesign preparation. During implementation, treat the migration contract and phase acceptance criteria in [REDESIGN_PLAN.md](REDESIGN_PLAN.md) as the source of truth. Planned features must not be presented as shipped features.

## Disclaimer

Summoner Atlas is an independent community data project and is not affiliated with Riot Games. `League of Legends` and related marks are trademarks or registered trademarks of Riot Games, Inc. Data sources and usage must be reviewed for compliance before release.
