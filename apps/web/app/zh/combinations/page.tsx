import Link from "next/link"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { getChampions, number, percent } from "@/lib/data"

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
      <section className="choice-grid">
        {champions.map((champion) => (
          <Link href={`/zh/champions/${champion.id}`} key={champion.id}>
            <span>英雄</span>
            <h2>{champion.name}</h2>
            <p>
              {percent(champion.winRate)} 胜率 · {number(champion.matches)} 场
            </p>
            <b>研究组合 →</b>
          </Link>
        ))}
      </section>
    </PageFrame>
  )
}
