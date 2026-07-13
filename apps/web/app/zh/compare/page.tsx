import Link from "next/link"
import { ContextBar } from "@/components/context-bar"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { DATA_CONTEXT, confidence, getChampions, number, percent } from "@/lib/data"

type ComparePageProps = { searchParams: Promise<{ left?: string; right?: string }> }

export const metadata = {
  title: "英雄对比",
  description: "在同一大乱斗版本和公开样本范围内对比两名英雄。",
  alternates: { canonical: "/zh/compare" },
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const [params, champions] = await Promise.all([searchParams, getChampions()])
  const left = champions.find((champion) => champion.id === Number(params.left)) ?? champions[0]
  const right = champions.find((champion) => champion.id === Number(params.right)) ?? champions[1]
  const selected = [left, right].filter((champion): champion is NonNullable<typeof champion> => Boolean(champion))

  return (
    <PageFrame>
      <PageTitle
        eyebrow="英雄对比"
        title="在同一版本比较选择"
        description="所有指标均固定在当前公开样本和大乱斗版本中；不同模式或区域的数据不会被混合比较。"
      />
      <ContextBar context={DATA_CONTEXT} />
      <form className="my-8 grid gap-3 border-b border-border pb-8 sm:grid-cols-[1fr_1fr_auto]" method="get">
        <label className="grid gap-2 text-sm">
          英雄一
          <select className="min-h-11 border border-border bg-surface px-3" defaultValue={left?.id} name="left">
            {champions.map((champion) => (
              <option key={champion.id} value={champion.id}>
                {champion.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          英雄二
          <select className="min-h-11 border border-border bg-surface px-3" defaultValue={right?.id} name="right">
            {champions.map((champion) => (
              <option key={champion.id} value={champion.id}>
                {champion.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="min-h-11 self-end border border-primary bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          type="submit"
        >
          开始比较
        </button>
      </form>
      {selected.length === 2 ? (
        <section className="grid gap-4 pb-28 md:grid-cols-2">
          {selected.map((champion) => (
            <article className="border border-border bg-surface p-6" key={champion.id}>
              <p className="font-mono text-xs text-primary">英雄</p>
              <h2 className="my-3 text-4xl font-black tracking-[-.06em]">{champion.name}</h2>
              <p className="text-sm text-muted-foreground">{champion.alias}</p>
              <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-5">
                <div>
                  <dt className="text-xs text-muted-foreground">胜率</dt>
                  <dd className="m-0 mt-1 font-mono text-xl text-positive">{percent(champion.winRate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">场次</dt>
                  <dd className="m-0 mt-1 font-mono text-xl">{number(champion.matches)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">可信度</dt>
                  <dd className="m-0 mt-1 text-sm">{confidence(champion.matches)}</dd>
                </div>
              </dl>
              <Link
                className="mt-8 inline-flex min-h-11 items-center text-sm text-primary"
                href={`/zh/champions/${champion.id}`}
              >
                查看完整组合 →
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <p className="pb-28 text-muted-foreground">当前没有足够的英雄数据可供比较。</p>
      )}
    </PageFrame>
  )
}
