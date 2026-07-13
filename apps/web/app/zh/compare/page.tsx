import Link from "next/link"
import { ContextBar } from "@/components/context-bar"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { DATA_CONTEXT, getChampions, number, percent } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

type ComparePageProps = { searchParams: Promise<{ left?: string; right?: string }> }

function cl(locale: string, matches: number) {
  return matches >= 5000
    ? t(locale as "zh" | "en" | "ko", "high")
    : matches >= 1000
      ? t(locale as "zh" | "en" | "ko", "medium")
      : t(locale as "zh" | "en" | "ko", "low")
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const locale = await getLocale()
  const [params, champions] = await Promise.all([searchParams, getChampions()])
  const left = champions.find((c) => c.id === Number(params.left)) ?? champions[0]
  const right = champions.find((c) => c.id === Number(params.right)) ?? champions[1]
  const selected = [left, right].filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "championCompare")}
        title={t(locale, "compareTitle")}
        description={t(locale, "compareDesc")}
      />
      <ContextBar context={DATA_CONTEXT} />
      <form className="my-8 grid gap-3 border-b border-border pb-8 sm:grid-cols-[1fr_1fr_auto]" method="get">
        <label className="grid gap-2 text-sm">
          {t(locale, "championOne")}
          <select className="min-h-11 border border-border bg-surface px-3" defaultValue={left?.id} name="left">
            {champions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          {t(locale, "championTwo")}
          <select className="min-h-11 border border-border bg-surface px-3" defaultValue={right?.id} name="right">
            {champions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="min-h-11 self-end border border-primary bg-primary px-4 text-sm font-medium text-primary-foreground"
          type="submit"
        >
          {t(locale, "startCompare")}
        </button>
      </form>
      {selected.length === 2 ? (
        <section className="grid gap-4 pb-28 md:grid-cols-2">
          {selected.map((champion) => (
            <article className="border border-border bg-surface p-6" key={champion.id}>
              <p className="font-mono text-xs text-primary">{t(locale, "champion")}</p>
              <h2 className="my-3 text-4xl font-black tracking-[-.06em]">{champion.name}</h2>
              <p className="text-sm text-muted-foreground">{champion.alias}</p>
              <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-5">
                <div>
                  <dt className="text-xs text-muted-foreground">{t(locale, "winRate")}</dt>
                  <dd className="m-0 mt-1 font-mono text-xl text-positive">{percent(champion.winRate)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t(locale, "matches")}</dt>
                  <dd className="m-0 mt-1 font-mono text-xl">{number(champion.matches)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{t(locale, "confidence")}</dt>
                  <dd className="m-0 mt-1 text-sm">{cl(locale, champion.matches)}</dd>
                </div>
              </dl>
              <Link
                className="mt-8 inline-flex min-h-11 items-center text-sm text-primary"
                href={`/zh/champions/${champion.id}`}
              >
                {t(locale, "viewFullCombos")}
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <p className="pb-28 text-muted-foreground">{t(locale, "noCompareData")}</p>
      )}
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "championCompare")} | Summoner Atlas`,
    description: t(locale, "compareDesc"),
    alternates: { canonical: canonical("/zh/compare") },
  }
}
