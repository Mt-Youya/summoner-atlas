# Summoner Atlas — 工作上下文（2026-07-13）

## 当前目标

将项目重构为一个基于 Next.js 16、pnpm monorepo、TypeScript、Tailwind CSS、shadcn/ui（Base UI）、Zustand、Hugeicons 与 GSAP 的英雄数据站。用户要求严格按 `REDESIGN_PLAN.md` 一次性完成，并且视觉要有 AWWWARDS 级冲击力；但该文档的正式视觉方向是“极地战术舱”的深色数据工具，后续实现应以文档的产品和信息架构为准。

工作目录曾从 `resg-lol` 移至 `/Users/yonjay/codes/demos/summoner-atlas`；当前会话环境显示的 cwd 是 `/Users/yonjay/codes/demos/resg-lol`，继续修改前先确认实际项目根目录和文件是否一致。

## 用户明确要求

- 不要只给方案，要直接完成实现并自行运行、检查路由。
- 组件与页面使用 Tailwind CSS；不要继续把主要 UI 留在巨大的全局 CSS 中。
- 用 Next.js Route Handlers 作为浏览器到数据源之间的 API 层。
- 多接口并发才可用 `Promise.allSettled`；单接口（例如 `getAugments`）不要无意义地包 `Promise.all` / `Promise.allSettled`。
- 数据缓存改用 Supabase，不使用 Vercel Redis。
- 不虚构 OAuth、账户后端或管理员写入功能；没有认证方案时只能完成 UI 和明确的未接入状态。

## 已完成或已修改

### 工程与数据

- pnpm monorepo 已有根 `package.json` 和 `apps/web` 工作区。
- Web 技术栈是 Next.js 16、React 19、TypeScript、Tailwind、Base UI/shadcn、Zustand、GSAP、Hugeicons。
- 已新增内部 Route Handlers：
  - `apps/web/app/api/champions/route.ts`
  - `apps/web/app/api/champions/[championId]/route.ts`
  - `apps/web/app/api/augments/route.ts`
  - `apps/web/app/api/augments/[augmentId]/route.ts`
- `ranking-explorer.tsx` 已改为从内部 `/api/champions`、`/api/augments` 请求数据。
- 已确认 RESG 上游的可用版本为 `16.13`：
  - `https://api.resg.top/api/champions/stats?version=16.13` 返回 200
  - 使用 Data Dragon 的 `26.15` 会返回 404。
- `lib/data.ts` 应使用：

```ts
export const DATA_VERSION = process.env.RESG_DATA_VERSION ?? "16.13"
```

- 英雄详情页的组合文本已从“综合方案”改为真实可读组合，例如：
  - `闪现 · 幽灵疾步 ｜ 狂战士胫甲 ｜ 主Q副W`
- 英雄协同强化已把类似 `A:1220` 的内部标识尽量映射为强化名称。

### 页面和路由

- 已有主页 `/zh`、英雄榜、强化榜、英雄详情、强化详情等核心路由。
- 已增加：
  - `/zh/compare`
  - `/zh/profile/accounts`
  - `/zh/profile/preferences`
- `PageFrame`、错误/加载/404、榜单浏览器和部分英雄详情已开始迁移为 Tailwind 工具类。
- `components/ui/button.tsx` 是 Base UI/shadcn 风格 Button；另有 Tailwind 风格 Input。
- 主页已有 GSAP/ScrollTrigger 动画实现，但仍混有旧的 `award-home.tsx`、`home.tsx` 和大量全局 CSS。

## 关键待修复项

### 1. 立即检查 `getAugments`

此前发现 `apps/web/lib/data.ts` 可能被并发编辑覆盖成错误代码：

```ts
const augments = await request(...).catch((_) => null)
if (arguments === null) return []
```

这是错误的。单接口必须改成：

```ts
export async function getAugments(version = DATA_VERSION): Promise<AugmentRank[]> {
  let augments: AugmentStat[]
  try {
    augments = await request<AugmentStat[]>(/* URL */)
  } catch {
    return []
  }

  return augments.map(/* 映射 */)
}
```

不要把单请求包进 `Promise.allSettled`。

### 2. Supabase 缓存尚未实现

用户已创建 Supabase 项目，当前位于 **Settings → API Keys** 页面。已确认的取值方式：

- 使用下方 **Secret keys → default** 的 `sb_secret_...`，只用于服务器。
- 不使用上方的 `sb_publishable_...`。
- 还需要 Project URL（通常在 **Settings → General** 的 Project URL）。
- 不要让用户把 secret 发到对话；应本地填写：

```env
# apps/web/.env.local
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
RESG_DATA_VERSION=16.13
```

绝不能用 `NEXT_PUBLIC_` 前缀，也绝不能让 secret 进入客户端 bundle。

建议的数据库表（在 Supabase SQL Editor 执行）：