import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ContextBar } from "@/components/context-bar"
import { PageFrame } from "@/components/page-frame"
import { DATA_CONTEXT, DATA_VERSION, confidence, getAugment, getChampions, number, percent } from "@/lib/data"
import { canonical } from "@/lib/site"

export async function generateMetadata({ params }: { params: Promise<{ augmentId: string }> }): Promise<Metadata> {
  const augment = await getAugment(Number((await params).augmentId))
  if (!augment) return { title: "海克斯不存在" }
  const path = `/zh/augments/${augment.id}`
  return {
    title: `${augment.name} 海克斯数据`,
    description: `${augment.name} 在大乱斗 ${DATA_VERSION} 的胜率、场次与可信度。`,
    alternates: { canonical: path },
    openGraph: {
      title: `${augment.name}｜海克斯数据`,
      description: `${percent(augment.winRate)} 胜率 · ${number(augment.matches)} 场`,
      url: canonical(path),
    },
  }
}

export default async function AugmentDetail({ params }: { params: Promise<{ augmentId: string }> }) {
  const id = Number((await params).augmentId)
  const [augmentResult, championsResult] = await Promise.allSettled([getAugment(id), getChampions()])
  const augment = augmentResult.status === "fulfilled" ? augmentResult.value : null
  if (!augment) notFound()
  const champions = championsResult.status === "fulfilled" ? championsResult.value : []
  return (
    <PageFrame>
      <article className="pb-28">
        <div className="pt-8">
          <ContextBar context={DATA_CONTEXT} />
        </div>
        <section className="grid gap-7 border-b border-border py-16 md:grid-cols-[76px_1fr_auto] md:items-center md:py-24">
          <span className="grid size-14 place-items-center border border-primary font-mono text-primary">A</span>
          <div>
            <span className="font-mono text-xs tracking-[.1em] text-primary">海克斯摘要 / 16.13</span>
            <h1 className="my-2 text-[clamp(3rem,7vw,5.5rem)] font-black tracking-[-.1em]">{augment.name}</h1>
            <p className="text-muted-foreground">{augment.description || "该海克斯暂无公开描述。"}</p>
          </div>
          <dl className="flex gap-7">
            <div className="grid gap-1.5">
              <dt className="text-xs text-muted-foreground">胜率</dt>
              <dd className="m-0 font-mono">{percent(augment.winRate)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-xs text-muted-foreground">场次</dt>
              <dd className="m-0 font-mono">{number(augment.matches)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-xs text-muted-foreground">可信度</dt>
              <dd className="m-0 font-mono">{confidence(augment.matches)}</dd>
            </div>
          </dl>
        </section>
        <section className="border-b border-border py-16">
          <span className="font-mono text-xs tracking-[.1em] text-primary">适配英雄</span>
          <h2 className="my-3 text-4xl font-black tracking-[-.06em]">从强势英雄开始验证</h2>
          <p className="max-w-[64ch] leading-8 text-muted-foreground">
            当前公开接口尚未提供该海克斯的逐英雄交叉表；以下是同版本高样本英雄入口，进入详情后可查看其组合数据。
          </p>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {champions
              .toSorted((a, b) => b.winRate - a.winRate)
              .slice(0, 4)
              .map((champion) => (
                <a
                  className="grid min-h-36 content-center gap-2 border border-border bg-surface p-6 hover:bg-surface-raised"
                  href={`/zh/champions/${champion.id}`}
                  key={champion.id}
                >
                  <strong className="text-2xl text-primary">{champion.name}</strong>
                  <span className="text-xs text-muted-foreground">
                    {percent(champion.winRate)} · {number(champion.matches)} 场
                  </span>
                </a>
              ))}
          </div>
        </section>
      </article>
    </PageFrame>
  )
}
