# Spec: Summoner Atlas Phase 1 — 骨架 + 首页 MVP

## Problem Statement

LOL 玩家在海克斯大乱斗选人阶段只有 15-60 秒做出英雄选择和海克斯搭配决策。现有数据工具（OP.GG、U.GG 等）以表格和长列表为主，需要玩家主动搜索和阅读，不适合"对局中快速扫描"的场景。国服玩家尤其缺乏针对海克斯大乱斗的高质量数据决策界面——英雄外号/拼音搜索、国服专属数据、选人阶段优化的信息呈现，这三者没有一个工具同时做好。

## Solution

**Summoner Atlas** —— 一个 Hextech × Atlas（古代星图）视觉风格的数据决策台。Phase 1 交付完整的首页 + 英雄详情页，以 Mock 数据驱动 UI，验证视觉方向和技术架构。

核心差异化：
- **推为主、搜为辅**：首页直接展示版本结论（强势英雄、海克斯推荐、趋势变化），玩家进游戏前就能建立认知
- **Hextech 发光层级**：信息重要性通过发光强度编码，一眼定位关键数据
- **Atlas 星图概念**：数据之间的关系可视化（Phase 1 做静态预览）
- **全语言搜索**：支持中文名、拼音、外号（剑圣→易）、英文名混合搜索
- **设计感优先**：深色 Hextech 主题，设计感优先于功能密度

## User Stories

### 首页 — 版本格局浏览
1. 作为一个 ARAM 玩家，我打开首页时想立即看到当前版本的核心数字（版本号、样本量、更新时间），以便信任这些数据的时效性
2. 作为一个 ARAM 玩家，我想在首页直接看到当前版本胜率最高的 5-8 个英雄，以便在选人前就知道该抢什么
3. 作为一个 ARAM 玩家，我想看到哪些英雄的胜率在上升、哪些在下降，以便了解版本趋势
4. 作为一个 ARAM 玩家，我想看到当前版本最值得选的 5 个海克斯强化，以便决策时优先考虑
5. 作为一个 ARAM 玩家，我想看到一个可视化的英雄×海克斯协同关系预览（星图），以便感受数据之间的关联
6. 作为一个潜在用户，我想在首页看到其他模式（召唤师峡谷、云顶之弈）的入口，以便知道这个网站未来会覆盖更多内容

### 全局搜索
7. 作为一个在选人阶段的玩家，我想在搜索框输入英雄的中文名（如"亚索"），以便快速找到该英雄的数据
8. 作为一个在选人阶段的玩家，我想输入英雄的拼音（如"yasuo"），以便快速找到该英雄
9. 作为一个在选人阶段的玩家，我想输入英雄的外号（如"剑圣"→易、"石头人"→墨菲特），以便用熟悉的称呼找到英雄
10. 作为一个在选人阶段的玩家，我想输入英雄的英文名（如"Yasuo"），以便找到该英雄
11. 作为一个在选人阶段的玩家，我想在输入时即时看到搜索结果（无需按 Enter），以便节省时间
12. 作为一个桌面端玩家，我想按 Ctrl+K 唤出全屏搜索面板（Phase 2），以便手不离开键盘就能搜索
13. 作为一个玩家，当搜索无结果时我想看到有帮助的空状态提示，以便知道下一步该做什么

### 英雄详情页
14. 作为一个拿到随机英雄的玩家，我想进入英雄详情页后第一眼看到胜率、登场率和可信度三个核心数字，以便快速判断该不该选
15. 作为一个玩家，我想看到推荐技能加点顺序，以便知道该主升哪个技能
16. 作为一个玩家，我想看到推荐核心装备，以便出门装和后续出装决策
17. 作为一个玩家，我想看到推荐符文配置，以便快速应用
18. 作为一个玩家，我想看到该英雄胜率最高的 5 个海克斯组合，以便在强化选择时做出最优决策
19. 作为一个玩家，我想看到该英雄在当前版本的胜率变化趋势图，以便了解其强度走向
20. 作为一个玩家，我想在详情页一路滚动就能看完所有信息（不需要切换 Tab），以便在有限时间内获取全部关键数据

### 导航与国际化
21. 作为一个桌面端玩家，我想通过顶部导航栏访问所有主要页面，以便快速切换
22. 作为一个移动端玩家，我想通过底部 TabBar 访问核心功能，以便单手操作
23. 作为一个国服玩家，我想网站默认显示中文界面，以便无障碍使用
24. 作为一个国际服玩家，我想能切换到英文或韩文界面，以便用熟悉的语言使用
25. 作为一个玩家，我想在深色和浅色主题之间切换，以便适应不同的使用环境

### 数据可信度
26. 作为一个玩家，我想看到每个数据指标旁的可信度标识（高/中/低），以便不被低样本数据误导
27. 作为一个玩家，我想了解数据方法论的说明，以便理解数据来源和局限性
28. 作为一个玩家，我想看到 Riot Games 免责声明，以便知道本网站与官方的关系

### 空状态与错误
29. 作为一个玩家，当数据加载中时我想看到骨架屏而非空白，以便知道内容即将出现
30. 作为一个玩家，当数据加载失败时我想看到有意义的错误提示和重试按钮，以便能尝试恢复
31. 作为一个玩家，当访问不存在的页面时我想看到 404 页面和返回首页入口，以便不会迷失

## Implementation Decisions

### 技术栈
- Next.js App Router，TypeScript
- Tailwind CSS + shadcn/ui（底层迁移至 Base UI）
- 图表：Recharts（90% 标准图表）+ D3.js（Atlas 力导向网络图）
- 动效：GSAP（时间线/ScrollTrigger）+ Framer Motion（组件级过渡）
- 数据：Phase 1 使用 Mock 数据，通过 DataService 接口注入
- 国际化：自研 i18n 包，路由 `/[lang]/`
- 主题：CSS 变量驱动，Dark/Light 切换

### 项目结构
```
apps/web/
  app/[lang]/           → 国际化路由页面
  components/
    ui/                  → shadcn/ui 组件（Base UI 底层）
    layout/              → 导航、Footer、布局组件
    home/                → 首页专有组件（Hero、BentoGrid、Trending...）
    champions/           → 英雄相关组件（SearchResult、DetailCard...）
    charts/              → 图表组件封装（Recharts + D3）
    shared/              → 通用组件（GlowBadge、ConfidencePill...）
  lib/
    data-service.ts      → DataService 接口定义
    mock-data.ts         → MockDataService 实现
    theme.ts             → 主题配置与 CSS 变量生成
packages/
  data-access/           → DataService 接口 + 类型定义
  i18n/                  → 翻译系统（已完备）
```

### DataService 接口（唯一接缝）

```typescript
interface DataService {
  getPatchSummary(): Promise<PatchSummary>
  getTopChampions(params: { mode: GameMode; region: Region; limit: number }): Promise<ChampionRank[]>
  getTrendingChampions(params: { mode: GameMode; region: Region }): Promise<{ up: ChampionTrend[]; down: ChampionTrend[] }>
  getTopAugments(params: { mode: GameMode; limit: number }): Promise<AugmentRank[]>
  searchChampions(params: { query: string; mode: GameMode }): Promise<ChampionSearchResult[]>
  getChampionDetail(params: { id: string; mode: GameMode }): Promise<ChampionDetail>
  getAtlasPreview(params: { mode: GameMode }): Promise<AtlasGraphData>
}
```

Phase 1 全部由 MockDataService 实现，返回固定数据。切换到真实数据时只需替换工厂函数。

### 视觉设计系统
- **主色**：Hextech 电光蓝 `#00D4FF` + 深紫 `#7B2FBE` + 琥珀暖色点缀 `#F0C060`
- **发光层级**：L3 高强度（Hero 核心数字）> L2 中强度（卡片边框、选中态）> L1 氛围（分隔线、非活跃 hover）
- **深色背景**：`#0A0E17`（页面）/ `#111827`（卡片）/ `#1A2332`（悬浮）
- **浅色背景**：`#F5F7FA`（页面）/ `#FFFFFF`（卡片）/ `#F0F2F5`（悬浮）
- **字体**：英文展示字体 Cinzel（标题）+ Inter（正文）+ CJK 系统字体栈
- **圆角**：锐利几何感，非 shadcn 默认的 0.5rem——关键卡片使用 `2px` 或切角设计
- **阴影**：全部覆写为 Hextech 发光 box-shadow，不使用灰黑默认阴影

### 首页 7 个 Section 布局

| Section | 内容 | 布局 | 动效 |
|---------|------|------|------|
| S1 Hero | 版本号 + 样本量 + 搜索框 + 价值主张 | 全宽居中 | 星图背景 GSAP 漂移 |
| S2 强势英雄 | Top 5-8 英雄卡片 + 水平条形图 | Bento Grid（第一名最大）| Staggered reveal |
| S3 趋势变化 | 上升/下降英雄 + 变化幅度 | 双列对比 | 数字滚动动画 |
| S4 海克斯推荐 | Top 5 海克斯 + 适配英雄 | 横向滚动卡片 | Hover 发光增强 |
| S5 Atlas 预览 | 星图节点 + 连线静态预览 | 全宽交互预览区 | 节点闪烁 + 网格旋转 |
| S6 模式入口 | 其他模式卡片 | 三列 Grid | Hover 抬升 |
| S7 Footer | 数据方法/来源/关于/免责 | 四列 Footer | 无 |

### 英雄详情页布局
单页滚动，从上到下：Sticky Header（返回+名称+胜率）→ 核心数据三数字 + Sparkline → 推荐构筑流程图（技能→装备→符文）→ 海克斯组合 Top 5 卡片 → 高胜率搭配表格 → 版本趋势面积图。

### 搜索交互
- 首页搜索框：输入即搜，下拉面板展示结果（头像+名称+胜率），选中跳转详情
- 别名匹配：中文外号、拼音、英文名，权重低于正式名称但必须命中
- Phase 2 加入 Ctrl+K 全屏命令面板

### 路由设计
```
/[lang]                    → 首页
/[lang]/champions/[id]    → 英雄详情
/[lang]/champions          → 英雄排行榜（Phase 2）
/[lang]/augments           → 海克斯排行榜（Phase 2）
/[lang]/atlas              → Atlas 探索区（Phase 3）
```

## Testing Decisions

### 测试原则
- 只测试外部行为，不测试实现细节
- 页面级测试：渲染页面 → Mock DataService 注入 → 断言关键数据可见
- 组件级测试：渲染组件 → 传入 props → 断言渲染结果和交互行为
- 不做快照测试

### 测试模块
1. **DataService Mock**：验证 MockDataService 返回的数据结构符合接口约定
2. **首页模块**：每个 Section 使用 Mock 数据独立渲染，断言关键内容可见
3. **英雄详情页**：Mock 数据注入，断言核心数字、构筑流程、海克斯组合渲染
4. **搜索组件**：输入 → 等待防抖 → 断言结果列表包含预期项；别名匹配测试
5. **国际化路由**：访问 `/[lang]` → 断言页面内容语言正确
6. **主题切换**：切换 Dark/Light → 断言 CSS 变量正确切换

### 不测试的内容
- Supabase 集成（Mock 数据替代，Phase 1 无后端依赖）
- GSAP 动画时间线（动画是视觉行为，不适合单元测试）
- 视觉还原度（由 `/impeccable` 人工审计）

## Out of Scope

- Ctrl+K 全屏搜索面板（Phase 2）
- Recharts 图表接入（Phase 2，Phase 1 用静态 SVG/CSS 模拟图表外观）
- D3 力导向网络图交互版（Phase 3，Phase 1 仅静态 SVG 预览）
- 英雄排行榜独立页、海克斯排行榜页、装备/符文页（Phase 2）
- 英雄对比页、版本记录/Meta 页（Phase 2）
- 个人中心、OAuth 登录（Phase 3）
- 后台管理（Phase 3）
- 真实数据接入（Phase 2+，Phase 1 全部 Mock）
- Service Worker 离线缓存（Phase 2）
- 字体子集化（Phase 2，Phase 1 用 Google Fonts 直接加载）
- 移动端独立优化（Phase 1 桌面端为主，移动端仅保证可用）

## Further Notes

### 品牌差异化核心
Summoner Atlas 的名字就是差异化方向——不做第 N+1 个数据表格网站，而是做"数据星图"。S5 Atlas 预览区和 Hextech 发光层级是这个差异化的两个核心锚点。Phase 1 不追求功能完整，追求视觉第一印象的"惊艳感"。

### 上下文切换约束
玩家在游戏和网站之间切换——这不是普通浏览场景。网站必须在玩家切进来的 0.5 秒内建立信任。这意味着：
- Hero 区的版本数字和可信度标识是信任锚点
- 发光效果指向最重要的信息，减少认知搜索时间
- 骨架屏和错误状态需要精心设计，不能出现白屏

### 竞品参考
- OP.GG：功能全但视觉平淡，白底表格风格
- U.GG：暗色主题但设计风格偏传统
- Mobalytics：设计感较强，Gamify 风格
- Porofessor：Overlay 工具，游戏内显示

Summoner Atlas 的定位：**比 OP.GG 更好看，比 U.GG 更快，比 Mobalytics 更专注于数据探索而非 Gamification。**
