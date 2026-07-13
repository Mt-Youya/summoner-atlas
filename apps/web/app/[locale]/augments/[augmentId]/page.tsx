import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ContextBar } from "@/components/context-bar"
import { PageFrame } from "@/components/page-frame"
import { DATA_CONTEXT, DATA_VERSION, getAugment, getChampions, number, percent } from "@/lib/data"
import { canonical } from "@/lib/site"
import { getLocale } from "@/lib/i18n-server"
import { t, translateChampionName } from "@summoner-atlas/i18n"

function cl(locale: string, matches: number) {
  return matches >= 5000
    ? t(locale as "zh" | "en" | "ko", "high")
    : matches >= 1000
      ? t(locale as "zh" | "en" | "ko", "medium")
      : t(locale as "zh" | "en" | "ko", "low")
}

export async function generateMetadata({ params }: { params: Promise<{ augmentId: string }> }): Promise<Metadata> {
  const augment = await getAugment(Number((await params).augmentId))
  if (!augment) return { title: "Augment not found" }
  const path = `/zh/augments/${augment.id}`
  return {
    title: `${augment.name} augment data`,
    description: `${augment.name} win rate, matches, and confidence on patch ${DATA_VERSION}.`,
    alternates: { canonical: path },
    openGraph: {
      title: `${augment.name} | Augment data`,
      description: `${percent(augment.winRate)} WR · ${number(augment.matches)} games`,
      url: canonical(path),
    },
  }
}

export default async function AugmentDetail({ params }: { params: Promise<{ augmentId: string }> }) {
  const locale = await getLocale()
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
            <span className="font-mono text-xs tracking-widest text-primary">
              {t(locale, "augmentSummary")} / {DATA_VERSION}
            </span>
            <h1 className="my-2 text-[clamp(3rem,7vw,5.5rem)] font-black -tracking-widest">{augment.name}</h1>
            <p className="text-muted-foreground">{augment.description || t(locale, "noDescription")}</p>
          </div>
          <dl className="flex gap-7">
            <div className="grid gap-1.5">
              <dt className="text-xs text-muted-foreground">{t(locale, "winRate")}</dt>
              <dd className="m-0 font-mono">{percent(augment.winRate)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-xs text-muted-foreground">{t(locale, "matches")}</dt>
              <dd className="m-0 font-mono">{number(augment.matches)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-xs text-muted-foreground">{t(locale, "confidence")}</dt>
              <dd className="m-0 font-mono">{cl(locale, augment.matches)}</dd>
            </div>
          </dl>
        </section>
        <section className="border-b border-border py-16">
          <span className="font-mono text-xs tracking-widest text-primary">{t(locale, "suitableChampions")}</span>
          <h2 className="my-3 text-4xl font-black tracking-[-.06em]">{t(locale, "verifyWithStrong")}</h2>
          <p className="max-w-[64ch] leading-8 text-muted-foreground">{t(locale, "augmentCrosstableHint")}</p>
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
                  <strong className="text-2xl text-primary">{translateChampionName(champion.name, locale)}</strong>
                  <span className="text-xs text-muted-foreground">
                    {percent(champion.winRate)} · {number(champion.matches)} {t(locale, "games")}
                  </span>
                </a>
              ))}
          </div>
        </section>
      </article>
    </PageFrame>
  )
}
