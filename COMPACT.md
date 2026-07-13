# Summoner Atlas — 工作上下文（2026-07-13）

## 项目与约束

- 工作目录：`/workspaces/summoner-atlas`。
- 所有对话回复必须使用简体中文。
- 使用 pnpm monorepo；主应用位于 `apps/web`，技术栈为 Next.js 16、React 19、TypeScript、Tailwind CSS。
- 只做与用户请求直接相关的最小改动；不要擅自清理或重构相邻代码。
- 自定义提交信息命令：`.agents/commands/gen-commit.md`。只生成英文 Conventional Commit 文本，绝不执行 `git commit`。

## 最近已提交工作

当前 `HEAD`：`8dcbdde feat: redesign localized app experience`

该提交完成了大范围的本地化与界面改造：

- 新增 `packages/i18n`，支持 `zh`、`en`、`ko` 三种 locale 与基础文案字典。
- 新增 `apps/web/proxy.ts`：`/en/*` 和 `/ko/*` 内部重写至 `/zh/*`，并以 `x-summoner-atlas-locale` 请求头传递语言。
- `apps/web/app/layout.tsx` 与 `LocaleProvider` 根据请求语言设置 `html lang` 和客户端语言上下文。
- 新增语言选择器、全局搜索、数据上下文栏、详情页 Open Graph 图片，以及多处页面的本地化链接与标题。
- 移除旧的 `award-home.tsx`、`home.tsx` 与大部分历史全局 CSS；页面主要采用 Tailwind 工具类。
- 新增 `packages/ui`（Base UI/shadcn 组件集合）。
- 新增产品与设计资料：`PRODUCT.md`、`DESIGN.md`、`REDESIGN_PLAN.md`。

## 当前未提交变更

当前工作树有两项未提交变更：

- `COMPACT.md`：本工作上下文的更新。
- `apps/web/components/language-switcher.tsx`：语言切换修复。

变更内容：将语言选择从 `router.push(...)` 改为
`window.location.assign(...)`。

原因：locale 依赖 `proxy.ts` 的内部重写和请求头；客户端软导航会复用 `/zh` 的布局与 `LocaleProvider` 状态，导致选择 English/한국어 后视觉上没有切换。完整页面跳转会重新经过代理并创建正确的语言上下文。

## 已验证

- `pnpm --filter @summoner-atlas/web typecheck` 通过。
- 本地开发服务器直接请求 `/en` 时：
  - HTML 为 `lang="en"`；
  - 首页包含 `Patch decision desk` 等英文文案。
- `git diff --check` 通过。

## 本地化现状与注意事项

- 静态界面文案会随 `zh` / `en` / `ko` 切换。
- 英雄名、海克斯名等来自当前数据源的字段仍为中文；这不是语言选择失败，而是数据本身尚未提供多语言字段。
- `localizePath()` 位于 `packages/i18n/src/index.ts`，会把 `/zh/...`、`/en/...`、`/ko/...` 前缀替换为目标语言。
- 根路由 `/` 会永久重定向至 `/zh`。

## 核心位置

- 语言选择：`apps/web/components/language-switcher.tsx`
- 语言上下文：`apps/web/components/locale-provider.tsx`
- 服务器语言读取：`apps/web/lib/i18n-server.ts`
- 代理重写：`apps/web/proxy.ts`
- 翻译字典与路由工具：`packages/i18n/src/index.ts`
- 应用布局：`apps/web/app/layout.tsx`

## 数据与运行命令

- 数据层：`apps/web/lib/data.ts`；缓存/Supabase 相关代码在 `resg-cache.ts` 与 `supabase-server.ts`。
- API 路由位于 `apps/web/app/api/`。
- 常用验证：

```bash
pnpm --filter @summoner-atlas/web typecheck
pnpm --filter @summoner-atlas/web lint
pnpm --filter @summoner-atlas/web test
pnpm --filter @summoner-atlas/web build
```

## 下一步

- 如需提交当前语言修复，先按 `gen-commit` 规则生成提交信息；不要自动执行提交。
- 若要让英雄/海克斯名称也随语言变化，需要确认上游数据是否提供 locale 字段或引入一份受维护的本地化映射，不能把中文数据误判为路由故障。
