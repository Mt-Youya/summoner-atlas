# ARAM Home Redesign — Tickets

## 01 — Shared Shell: gpt-taste PageFrame, PageTitle, SiteFooter

**What to build:** 后续所有页面的布局 shell 组件升级到 gpt-taste 风格。用户在排行榜页看到全宽 gpt-taste 布局、超大排印标题、AIDA Action 页脚。

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

- [ ] PageFrame 改为全宽无约束布局，支持 gpt-taste 全幅 section
- [ ] PageTitle 改用 gpt-taste `clamp()` mega-heading 排版，描述文本行宽控制在 65-75ch
- [ ] SiteFooter 改为 AIDA Action 阶段风格 — 大规模链接/CTA 区域 + 免责声明
- [ ] 所有三个 locale (zh/en/ko) UI 文案正常
- [ ] 390px/768px/1440px 无横向溢出

---

## 02 — gpt-taste RankingTable + RankingFilters

**What to build:** 排行榜表格和筛选栏升级到 gpt-taste 精密仪表风格。用户看到 glass-morphism 筛选栏、gpt-taste 排版表头、等宽数字右对齐、hover 行高亮。表格保留高数据密度，用 gpt-taste 的间距/字体/颜色 token 做升级。

**Blocked by:** 01 — Shared Shell

**Status:** ready-for-agent

- [ ] 表头吸顶 (sticky header)，大列表滚动时表头保持可见
- [ ] 数字右对齐 + `tabular-nums`，可快速扫描对比
- [ ] 桌面端保持标准 HTML table 语义，移动端退化为数据行卡片
- [ ] 桌面 mobile-row 的搜索/筛选/排序 URL 同步状态保持不变
- [ ] Tier、可信度、版本变化数据展示正确
- [ ] 每种实体类型 (champion/augment/item/rune) 的 identity 组件正确显示
- [ ] 空结果/加载/错误状态都有文案反馈

---

## 03 — Champions List Page

**What to build:** `/zh/champions` 完整 gpt-taste 体验。用户看到 glass-morphism 筛选栏 + gpt-taste 排版表格 + 英雄头像 + Tier 标记 + 数据指标（胜率/登场率/场次/可信度/版本变化）。筛选/排序/搜索功能完整且 URL 同步。

**Blocked by:** 02 — RankingTable + RankingFilters

**Status:** ready-for-agent

- [ ] PageFrame + PageTitle + RankingView + RankingTable 组合渲染正确
- [ ] 搜索框输入中文名/拼音/外号能过滤英雄列表
- [ ] 排序切换 (胜率/登场率/场次) 正常工作
- [ ] 最低样本量筛选 (全部/1000/5000) 正常工作
- [ ] 清除按钮重置所有筛选
- [ ] URL search params 刷新后状态恢复
- [ ] 移动端筛选控件不竖排不错位

---

## 04 — Champion Detail Page

**What to build:** `/zh/champions/[id]` 重构为"结论优先"结构。hero 区展示英雄头像 + 超大名称 + 核心数据 (胜率/场次/可信度)，下方依次为：最佳组合推荐卡片 → 海克斯协同 → 完整组合数据表。GSAP 文本揭示动效 (桌面端)。数据与原页面 100% 一致。

**Blocked by:** 02 — RankingTable + RankingFilters

**Status:** ready-for-agent

- [ ] Hero 区：英雄头像 + 名称 + 别名 + 数据摘要 (胜率/场次/可信度)
- [ ] 最佳组合卡片区：最佳 combo 胜率 + 样本量 + combo 解读文字
- [ ] 海克斯协同区：最佳 synergy 及对应海克斯名称
- [ ] 完整 combo 列表 (Top 10)，每条显示 combo 说明 + 胜率 + 场次 + 可信度
- [ ] 数据获取失败时优雅降级 (combo 空显示"暂无组合数据")
- [ ] Hero GSAP 动画只在桌面端且 prefers-reduced-motion: no-preference 时播放
- [ ] OG 图片生成正常 (`opengraph-image.tsx`)

---

## 05 — Augments List Page

**What to build:** `/zh/augments` 完整 gpt-taste 体验。复用 RankingTable，海克斯行显示品质颜色 (棱彩/黄金/白银) + 海克斯图标 + 描述摘要。搜索/排序/品质筛选全部正常工作。

**Blocked by:** 02 — RankingTable + RankingFilters

**Status:** ready-for-agent

- [ ] PageFrame + RankingView + RankingTable 渲染正确
- [ ] 海克斯品质颜色正确映射 (prismatic/gold/silver)
- [ ] AugmentIdentity 组件显示 resg.top 彩色图或 CDragon 灰度 fallback
- [ ] 描述文字单行截断 (line-clamp-1)
- [ ] 搜索框能按海克斯名称过滤
- [ ] 排序 (胜率/登场率/场次) 和最低样本量筛选正常
- [ ] URL search params 刷新恢复

---

## 06 — Augment Detail Page

**What to build:** `/zh/augments/[id]` gpt-taste 重构。Hero 区展示海克斯名称 + 描述 + 胜率/场次/可信度。下方展示适配英雄卡片网格 (Top 4 高胜率英雄)。GSAP 文本揭示动效 (桌面端)。

**Blocked by:** 02 — RankingTable + RankingFilters

**Status:** ready-for-agent

- [ ] Hero 区：海克斯品质标识 + 名称 + 描述 + 数据摘要
- [ ] 适配英雄卡片网格 (2x2，桌面端 4 张卡片)
- [ ] 每张卡片显示英雄名称 + 胜率 + 场次，点击跳转英雄详情
- [ ] 海克斯无描述时显示"暂无描述"占位
- [ ] GSAP 动画仅在桌面端 + prefers-reduced-motion: no-preference 时播放
- [ ] OG 元数据正确
