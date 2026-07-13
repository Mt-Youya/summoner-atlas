import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ContextBar } from "@/components/context-bar"
import { PageFrame } from "@/components/page-frame"
import {
  DATA_CONTEXT,
  DATA_VERSION,
  championIcon,
  comboLabel,
  confidence,
  getChampion,
  getChampionCombos,
  getChampionSynergy,
  getAugments,
  number,
  percent,
} from "@/lib/data"
import { canonical } from "@/lib/site"

export async function generateMetadata({ params }: { params: Promise<{ championId: string }> }): Promise<Metadata> {
  const champion = await getChampion(Number((await params).championId))
  if (!champion) return { title: "英雄不存在" }
  const path = `/zh/champions/${champion.id}`
  return {
    title: `${champion.name} 大乱斗数据`,
    description: `${champion.name} 在大乱斗 ${DATA_VERSION} 的胜率、场次、可信度与组合数据。`,
    alternates: { canonical: path },
    openGraph: {
      title: `${champion.name}｜大乱斗数据`,
      description: `${percent(champion.winRate)} 胜率 · ${number(champion.matches)} 场`,
      url: canonical(path),
    },
  }
}

export default async function ChampionDetail({ params }: { params: Promise<{ championId: string }> }) {
  const id = Number((await params).championId)
  const [championResult, combosResult, synergyResult, augmentsResult] = await Promise.allSettled([
    getChampion(id),
    getChampionCombos(id),
    getChampionSynergy(id),
    getAugments(),
  ])
  const champion = championResult.status === "fulfilled" ? championResult.value : null
  if (!champion) notFound()
  const combos = combosResult.status === "fulfilled" ? combosResult.value : []
  const synergy = synergyResult.status === "fulfilled" ? synergyResult.value : []
  const augments = augmentsResult.status === "fulfilled" ? augmentsResult.value : []
  const bestCombo = combos.filter((combo) => combo.total_matches >= 5000).toSorted((a, b) => b.win_rate - a.win_rate)[0]
  const bestSynergy = synergy
    .filter((combo) => combo.total_matches >= 1000)
    .toSorted((a, b) => b.win_rate - a.win_rate)[0]
  const augmentNames = new Map(augments.map((augment) => [augment.id, augment.name]))
  const bestSynergyName = bestSynergy?.combo_key
    ?.match(/\d+/g)
    ?.map((augmentId) => augmentNames.get(Number(augmentId)) ?? `海克斯 #${augmentId}`)
    .join(" · ")
  return (
    <PageFrame>
      <article className="pb-28">
        <div className="pt-8">
          <ContextBar context={DATA_CONTEXT} />
        </div>
        <section className="grid grid-cols-[80px_1fr] gap-5 border-b border-border py-16 md:grid-cols-[120px_1fr_auto] md:items-center md:gap-7 md:py-24">
          <Image
            className="border border-primary"
            src={championIcon(champion.id)}
            alt={champion.name}
            width={120}
            height={120}
            priority
          />
          <div>
            <span className="font-mono text-[11px] tracking-[0.1em] text-primary">英雄摘要 / 16.13</span>
            <h1 className="my-2 text-[clamp(3rem,7vw,5.5rem)] font-black tracking-[-0.1em]">{champion.name}</h1>
            <p className="text-muted-foreground">{champion.alias} · 公开数据快照</p>
          </div>
          <dl className="col-span-full flex gap-7 md:col-auto">
            <div className="grid gap-1.5">
              <dt className="text-[10px] text-muted-foreground">胜率</dt>
              <dd>{percent(champion.winRate)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-[10px] text-muted-foreground">场次</dt>
              <dd>{number(champion.matches)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-[10px] text-muted-foreground">可信度</dt>
              <dd>{confidence(champion.matches)}</dd>
            </div>
          </dl>
        </section>
        <section className="py-16">
          <span className="font-mono text-[11px] tracking-[0.1em] text-primary">推荐方案</span>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">先看可执行结论</h2>
          {bestCombo ? (
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              <div className="grid min-h-40 content-center gap-3 bg-surface p-6">
                <small className="text-muted-foreground">最佳高样本组合</small>
                <strong className="text-4xl text-primary">{percent(bestCombo.win_rate)}</strong>
                <span className="text-sm text-muted-foreground">
                  {number(bestCombo.total_matches)} 场 · {comboLabel(bestCombo)}
                </span>
              </div>
              <div className="grid min-h-40 content-center gap-3 bg-surface p-6">
                <small className="text-muted-foreground">海克斯协同参考</small>
                <strong className="text-4xl text-primary">
                  {bestSynergy ? percent(bestSynergy.win_rate) : "暂无数据"}
                </strong>
                <span className="text-sm text-muted-foreground">
                  {bestSynergy ? `${number(bestSynergy.total_matches)} 场 · ${bestSynergyName}` : "暂无可信协同数据"}
                </span>
              </div>
            </div>
          ) : (
            <p className="py-8 text-muted-foreground">该英雄暂无可用组合推荐，请先参考基础胜率与场次。</p>
          )}
        </section>
        <section>
          <span className="font-mono text-[11px] tracking-[0.1em] text-primary">深入数据 / 综合搭配</span>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">高胜率组合</h2>
          {combos.slice(0, 10).map((combo, index) => (
            <div
              className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-4 border-b border-border text-sm"
              key={`${combo.combo_type ?? "combo"}-${combo.combo_key ?? "default"}-${combo.tier_signature ?? "tier"}-${index}`}
            >
              <span>{comboLabel(combo)}</span>
              <strong>{percent(combo.win_rate)}</strong>
              <span>{number(combo.total_matches)} 场</span>
              <span>{confidence(combo.total_matches)}</span>
            </div>
          ))}
        </section>
      </article>
    </PageFrame>
  )
}
