import { notFound } from "next/navigation"
import { PageFrame } from "@/components/page-frame"
import { confidence, getAugment, getChampions, number, percent } from "@/lib/data"

export async function generateMetadata({ params }: { params: Promise<{ augmentId: string }> }) {
  const augment = await getAugment(Number((await params).augmentId))
  return { title: augment ? `${augment.name} 海克斯数据 | summoner-atlas` : "海克斯不存在 | summoner-atlas" }
}

export default async function AugmentDetail({ params }: { params: Promise<{ augmentId: string }> }) {
  const id = Number((await params).augmentId)
  const [augmentResult, championsResult] = await Promise.allSettled([getAugment(id), getChampions()])
  const augment = augmentResult.status === "fulfilled" ? augmentResult.value : null
  if (!augment) notFound()
  const champions = championsResult.status === "fulfilled" ? championsResult.value : []
  return (
    <PageFrame>
      <article className="detail-page">
        <section className="augment-hero">
          <span className="augment-glyph">A</span>
          <div>
            <span className="eyebrow">海克斯摘要 / 16.13</span>
            <h1>{augment.name}</h1>
            <p>{augment.description || "该海克斯暂无公开描述。"}</p>
          </div>
          <dl>
            <div>
              <dt>胜率</dt>
              <dd>{percent(augment.winRate)}</dd>
            </div>
            <div>
              <dt>场次</dt>
              <dd>{number(augment.matches)}</dd>
            </div>
            <div>
              <dt>可信度</dt>
              <dd>{confidence(augment.matches)}</dd>
            </div>
          </dl>
        </section>
        <section className="recommendation">
          <span className="eyebrow">适配英雄</span>
          <h2>从强势英雄开始验证</h2>
          <p>当前公开接口尚未提供该海克斯的逐英雄交叉表；以下是同版本高样本英雄入口，进入详情后可查看其组合数据。</p>
          <div className="recommendation-grid">
            {champions
              .toSorted((a, b) => b.winRate - a.winRate)
              .slice(0, 4)
              .map((champion) => (
                <a href={`/zh/champions/${champion.id}`} key={champion.id}>
                  <strong>{champion.name}</strong>
                  <span>
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
