# CONTEXT — Summoner Atlas

项目通用语言 (ubiquitous language) 词汇表。不含实现细节。

## 设计系统

- **gpt-taste:** 本项目采用的设计工程体系——AIDA 页面结构、GSAP ScrollTrigger 动效、bento grid、cinematic typography。详见 [ADR 0001](docs/adr/0001-gpt-taste-design-system.md)。
- **AIDA:** Attention (Hero) → Interest (Bento) → Desire (GSAP Scroll) → Action (Footer/CTA) 的页面章节结构。
- **Bento Grid:** 零空隙 (grid-flow-dense) 的网格布局，用于数据卡片展示。列跨度和行跨度必须数学上验证无空洞。
- **Glass-morphism:** 半透明背景 + backdrop-blur + 细边框的 UI 面板风格 (`gpt-glass`)。

## 领域模型

- **Data Context:** 一次数据查询的上下文元组——region + mode + patch (+ optional tier + timeRange)。所有统计页面的最基础信息。
- **Region:** 服务器区域 (CN/KR/NA/TW/EUW/EUNE/GLOBAL)。默认 GLOBAL。
- **Game Mode:** 游戏模式 (summoners-rift/aram/arena)。一期只覆盖 ARAM。
- **Patch:** RESG 数据版本号 (如 16.13)。独立于 Riot 官方补丁号。
- **Ranked Metric:** 一个实体的竞技指标——winRate + pickRate + matches + confidence + optional previousPatchDelta。
- **Tier:** S/A/B/C/D 五级强度评定。由 `classifyTier(winRate, pickRate)` 加权计算得出 (70% 胜率 + 30% 登场率)。
- **Confidence:** 样本可信度——low (<1000 场) / medium (1000-5000) / high (>=5000)。
- **Augment Quality:** 海克斯品质等级——prismatic (棱彩) / gold (黄金) / silver (白银)。

## 数据来源

- **RESG:** resg.top API，提供全球公开对局样本的统计数据。
- **CDragon:** CommunityDragon CDN，提供英雄/装备/符文/海克斯图标资源。
- **Supabase Cache:** `withResgCache()` 封装的读穿缓存层。TTL 3600s。带版本前缀 (v2) 防陈旧缓存。

## 技术术语

- **shadcn/base-ui:** 项目的 headless UI 组件基础层 (`@base-ui/react`)。gpt-taste 在 shadcn 框架内做样式升级，不改源码。详见 [ADR 0002](docs/adr/0002-shadcn-retention-with-gpt-taste-styling.md)。
- **Desktop-first degradation:** 桌面全量 gpt-taste (GSAP+bento)，移动端简化 (无 GSAP，单列)。详见 [ADR 0003](docs/adr/0003-desktop-first-gpt-taste-mobile-degradation.md)。
