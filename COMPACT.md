# Summoner Atlas — 工作上下文（2026-07-14）

## 项目与约束

- 工作目录：`/workspaces/summoner-atlas`。
- 所有对话回复必须使用简体中文。
- 使用 pnpm monorepo；主应用位于 `apps/web`，技术栈为 Next.js 16、React 19、TypeScript、Tailwind CSS。
- 只做与用户请求直接相关的最小改动；不要擅自清理或重构相邻代码。
- 自定义提交信息命令：`.agents/commands/gen-commit.md`。只生成英文 Conventional Commit 文本，绝不执行 `git commit`。

## 最近已提交工作

当前 `HEAD`：`1e500cf fix: switch item images from DataDragon to CDragon`

### 提交历史

- `1e500cf` — fix: switch item images from DataDragon to CDragon（生产环境 502）
- `cf39093` — style: enlarge identity icons and add border styling
- `9aa262b` — feat: add data sync pipeline, ranking images, and table fixes
- `ccd3a6d` — refactor: reorganize components into subdirectories and split PageFrame
- `8345149` — refactor: migrate to dynamic [locale] routing and complete i18n coverage

## 组件结构

```
apps/web/components/
├── display/          metric-value, tier-mark, sample-confidence, rank-change, data-freshness
├── identity/         champion-identity, augment-identity, item-identity, rune-identity
├── layout/           page-frame, site-header, site-footer, page-title
├── ranking/          ranking-table, ranking-view, ranking-filters
├── selector/         context-selector, mode-selector, region-selector, version-selector
├── build-recommendation.tsx
├── global-game-search.tsx
├── language-switcher.tsx
├── locale-provider.tsx
└── preferences-panel.tsx
```

## 数据层架构

```
apps/web/lib/data.ts          — 所有数据获取函数，CDragon + resg.top API
apps/web/lib/resg-cache.ts    — Supabase 缓存层（withResgCache）
apps/web/lib/augment-images.ts — 143 个海克斯的 resg.top 彩色图片映射
apps/web/lib/context.ts       — 数据版本上下文
apps/web/lib/site.ts          — canonical URL 工具
apps/web/lib/supabase-server.ts — Supabase 服务端客户端
```

### 数据流

resg.top API / CDragon API → `data.ts` 函数 → `withResgCache`（Supabase 缓存，TTL 3600s）→ API Route → 客户端 `RankingView` fetch → `RankingTable`

### 图片 URL 来源

- **Champion**: `championIcon(id)` — CDragon champion-icons 目录
- **Augment**: 优先 `augmentResgImage(id)`（resg.top 彩色），fallback CDragon 灰度图标
- **Item**: `cdragonIcon(iconPath)` — CDragon items.json 的 iconPath
- **Rune**: `cdragonIcon(iconPath)` — CDragon perks.json 的 iconPath

### DATA_VERSION

默认 `16.13`，通过 `RESG_DATA_VERSION` 环境变量控制。resg.top 版本号为 semver 风格（如 16.13），不是 Riot 补丁号。

## 缓存注意事项

- `withResgCache` 优先从 Supabase `resg_cache` 表读取，命中则直接返回而不调用 API
- 缓存 TTL 3600 秒，expires_at 过期后自动重新拉取
- **关键问题**：旧代码写入的缓存条目不包含 `imageUrl` 等新字段，TTL 内会返回无图数据
- fallback 数据现均已补充 `imageUrl`，API/缓存故障时也能显示图片

## 已验证

- `pnpm --filter @summoner-atlas/web typecheck` 零错误
- `pnpm dev` / `pnpm build` 正常

## 同步管线

```
packages/data-access/
├── src/cli.ts               — CLI 入口：pnpm sync [--static] [--resg] [--all]
├── src/supabase.ts           — Supabase 客户端（service_role，自动 loadEnvFile）
├── src/sync/
│   ├── index.ts              — 编排：syncStatic(), syncResg(), syncAll()
│   ├── helpers.ts            — CDragon URL 构建，locale 映射
│   ├── sync-champions.ts     — CDragon champion-summary → Supabase + i18n TS 文件
│   ├── sync-augments.ts      — CDragon cherry-augments → Supabase + i18n TS 文件
│   ├── sync-items.ts         — CDragon items → Supabase
│   ├── sync-summoner-spells.ts
│   ├── sync-versions.ts      — DataDragon versions.json
│   ├── sync-resg-champions.ts
│   ├── sync-resg-augments.ts
│   ├── sync-resg-items.ts
│   ├── sync-resg-base-stats.ts
│   └── sync-resg-synergy.ts
└── migrations/
    ├── 001_static_tables.sql
    └── 002_resg_tables.sql
```

## i18n

- `packages/i18n/src/index.ts` — `t()`, `localizePath()`, `translateChampionName()` 等
- `packages/i18n/src/data-translations.ts` — 自动生成的 173 个英雄翻译（zh→[en,ko]）
- `packages/i18n/src/augment-translations.ts` — 自动生成的 502 个海克斯名称翻译
- `packages/i18n/src/locales/{zh,en,ko}/common.json` — 静态 UI 文案
- 语言切换使用 `window.location.assign()` 做完整页面跳转（非客户端导航，确保 proxy.ts 重新处理 locale 请求头）

## 已记录问题

- Augment desc 翻译表为空（CDragon cherry-augments 无多语描述字段，需从 resg.top 补）
- Items/runes 数据使用随机回退统计（无真实 resg.top 数据源）
- classifyTier 函数仍内嵌于 ranking-table.tsx
