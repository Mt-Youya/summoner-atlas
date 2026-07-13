import Link from "next/link"
import { ContextBar } from "@/components/context-bar"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { DATA_CONTEXT, getChampions, number, percent } from "@/lib/data"

export const metadata = {
  title: "组合研究 | summoner-atlas",
  description: "从英雄进入真实组合、出装与海克斯协同数据。",
}

export default async function CombinationsPage() {
  const champions = (await getChampions()).toSorted((a, b) => b.winRate - a.winRate).slice(0, 12)
  return (
    <PageFrame>
      <PageTitle
        eyebrow="组合研究 / 渐进式流程"
        title="先选英雄，再看可行组合"
        description="组合研究不使用多层弹窗。先选一个英雄，详情页会展示当前版本下公开的技能、鞋子、出装与海克斯协同样本。"
      />
      <ContextBar context={DATA_CONTEXT} />
      <section className="grid gap-4 py-12 md:grid-cols-3 md:pb-28">
        {champions.map((champion) => (
          <Link
            className="flex min-h-48 flex-col border border-border bg-surface p-6 hover:bg-surface-raised"
            href={`/zh/champions/${champion.id}`}
            key={champion.id}
          >
            <span className="font-mono text-xs text-primary">英雄</span>
            <h2 className="my-3 text-3xl tracking-[-.04em]">{champion.name}</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {percent(champion.winRate)} 胜率 · {number(champion.matches)} 场
            </p>
            <b className="mt-auto text-xs">研究组合 →</b>
          </Link>
        ))}
      </section>
    </PageFrame>
  )
}
