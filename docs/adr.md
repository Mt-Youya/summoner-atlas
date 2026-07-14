# Architecture Decision Records — Summoner Atlas gpt-taste Redesign

**Date:** 2026-07-14

---

## ADR 1: gpt-taste Design System Adoption

### Context

Summoner Atlas 现有 UI 在 DESIGN.md 中定位于"极地战术舱"——深蓝暗色、冰青主色、零滚动动效、尊重 `prefers-reduced-motion`。实际实现呈现为开发者后台风格的朴素界面，与竞品 (op.gg, u.gg, lolalytics) 存在显著体验差距。

用户要求用 gpt-taste 完全重新设计 UI/UX。gpt-taste 是一个 AWWWARDS 级别的设计工程体系，要求 GSAP ScrollTrigger 重型动效、AIDA 页面结构、gapless bento grid、cinematic typography。

这两个方向从根本上冲突：DESIGN.md 说"不使用滚动特效"，gpt-taste 说"静态界面严格禁止"。

### Decision

**拥抱 gpt-taste 全量动效体系。** 使用 GSAP ScrollTrigger (pinning, stacking, scrubbing, text reveal) 作为桌面端默认体验。保留 `prefers-reduced-motion` 完全禁用动效的能力。

- 桌面端 (>=1024px): 全量 GSAP 动效
- 平板端 (768-1023px): 简化动效 (fade only, no pin)
- 移动端 (<768px): 零 GSAP，纯静态布局
- `prefers-reduced-motion: reduce`: 全端零动效

### Consequences

**正面:** 品牌辨识度大幅提升，AIDA 结构提供清晰的信息层级引导，动效提供自然的浏览节奏。
**负面:** GSAP 增加客户端体积 (~30KB gzipped)，桌面/移动体验差异大需维护两套交互逻辑。

### Alternatives Considered

- **保守路线 (DESIGN.md 原文):** 零滚动动效，被拒绝——无法解决品牌辨识度问题。
- **折中方案 (首页动效 + 数据页静态):** 被拒绝——跨页面不一致造成割裂感。

---

## ADR 2: shadcn Retention with gpt-taste Styling

### Context

项目深度依赖 shadcn/ui (Base UI, "base-nova" style)，`@summoner-atlas/ui` 包提供 60+ 组件。gpt-taste 默认要求完全自定义的组件实现。

### Decision

**保留 shadcn/ui 框架，在 theme 层做 gpt-taste 样式升级。** 功能性组件 (Button, Dialog, Sheet, Select, Input 等) 不变，通过 CSS 变量和 Tailwind class 重写视觉表现。展示型组件在 app 层新建，不污染 UI 包。

关键约束：不改 `packages/ui/` 源码，CSS 覆盖在 `apps/web/app/globals.css`，gpt-taste 专属组件在 `apps/web/components/home/`。

### Consequences

**正面:** 不破坏 shadcn 可访问性基础，`packages/ui/` 包保持稳定，可渐进式替换。
**负面:** 部分 shadcn 默认样式需额外 CSS 覆盖，无法达到 100% gpt-taste 设计纯度。

### Alternatives Considered

- **完全脱离 shadcn:** 被拒绝——风险太大，破坏可访问性基础。

---

## ADR 3: Desktop-First gpt-taste with Mobile Degradation

### Context

gpt-taste 天然偏向桌面端——cinematic hero、4 列 bento grid、GSAP card stacking 在移动端体验差或技术上不可行。PRODUCT.md 要求 390px 下功能完整可用、触控目标 >= 44px。

### Decision

**桌面端全量 gpt-taste，移动端简化降级。**
- 桌面 (>=1024px): 全量 GSAP，4 列 bento，`py-24 md:py-36`
- 平板 (768-1023px): 简化 grid，GSAP fade only，`py-16`
- 移动 (<768px): 零 GSAP，单列，`py-12`
- 所有断点: 触控目标 >= 44px

### Consequences

**正面:** 桌面最佳展示效果，移动不牺牲可用性，GSAP `matchMedia` 按需加载。
**负面:** 两套交互体验差异大，需维护断点逻辑。

### Alternatives Considered

- **双端均等 gpt-taste:** 被拒绝——移动端 GSAP 体验差，触屏与 ScrollTrigger 冲突。
- **先只做桌面:** 被拒绝——PRODUCT.md 要求 390px 可用。
