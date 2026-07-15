<!-- HIGHEST PRIORITY RULE -->

## 🔴 语言规则（最高优先级）

**必须用简体中文回答所有问题，无例外。**

- 代码注释可以用英文
- 所有解释、分析、建议必须是中文
- 即使用户用英文提问，也用中文回答

# [CLAUDE.md](https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md)

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## 行为准则

**权衡:** 这些准则偏向谨慎而非速度。对简单任务，自行判断。

### 1. 先想后写

- 明确陈述假设。不确定就问。
- 有多种理解时，列出来，不要默默选一个。
- 有更简单的方案就说。该反驳时就反驳。

### 2. 简洁优先

- 不写没要求的功能。
- 不为一次性的代码建抽象层。
- 不为不可能的场景写错误处理。
- 200 行能缩到 50 行就重写。

### 3. 精准修改

- 不"顺便改进"相邻代码、注释、格式。
- 不改没坏的东西。
- 匹配现有风格，即使你更喜欢另一种写法。
- 自己改动造成的死代码要清理，原有死代码不要动。

### 4. 目标驱动

把任务变成可验证的目标，多步任务先列计划再执行。

---

## 项目专属规则

### 提交前检查清单

```
pnpm fmt    → 格式化必须通过
pnpm lint   → 0 error（warning 可以，但不能有 error）
pnpm build  → TypeScript + Next.js 构建必须通过
```

三项全部通过后再 `git commit`。

### 技术栈

| 层     | 技术                                             |
| ------ | ------------------------------------------------ |
| 框架   | Next.js 16 (App Router)                          |
| 数据   | Supabase PostgreSQL，v2 cache 在 `resg_cache` 表 |
| API    | `/api/v1/` RESTful，统一 `{ data, meta }` 响应   |
| UI     | React 19, Tailwind CSS 4, shadcn/ui (Base UI)    |
| 状态   | Zustand                                          |
| 包管理 | pnpm workspaces                                  |

### API 模式

服务端路由用 `apps/web/app/api/v1/supabase.ts` 的共享工具：

```ts
import { fetchCache, ok, notFound, serverError } from "../supabase"
```

客户端数据服务在 `apps/web/lib/mock-data.ts`，统一通过 `/api/v1/` 获取数据。

### 国际化

用 `localizedName(entity, locale)` 获取本地化名称对 `{ primary, secondary }`，不要直接写 `nameZh` / `name`。

---

## AGENT SKILLS

### promote-version-to-main

Import [promote-version-to-main](.agents/skills/promote-version-to-main/SKILL.md)

> ⚠️ Reminder: Always respond in Simplified Chinese.
