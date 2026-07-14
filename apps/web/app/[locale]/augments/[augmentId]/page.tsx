import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PageFrame } from "@/components/layout/page-frame"
import { DataContextBar } from "@/components/home/data-context-bar"
import { AugmentHeroClient } from "./hero-client"
import { DATA_VERSION, getAugment, getChampions, number, percent } from "@/lib/data"
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
  if (!augment) return { title: "Augment not found / 海克斯未找到" }
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
        <div className="pt-6">
          <DataContextBar />
        </div>

        <AugmentHeroClient
          augmentName={augment.name}
          description={augment.description || t(locale, "noDescription")}
          winRate={percent(augment.winRate)}
          matches={number(augment.matches)}
          confidence={cl(locale, augment.matches)}
          summaryLabel={t(locale, "augmentSummary")}
          winRateLabel={t(locale, "winRate")}
          matchesLabel={t(locale, "matches")}
          confidenceLabel={t(locale, "confidence")}
          dataVersion={DATA_VERSION}
        />

        <section className="border-b border-white/[0.06] py-16">
          <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
            {t(locale, "suitableChampions")}
          </span>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-black leading-[0.94] tracking-[-0.05em]">
            {t(locale, "verifyWithStrong")}
          </h2>
          <p className="mt-3 max-w-[52ch] text-sm leading-6 text-muted-foreground">
            {t(locale, "augmentCrosstableHint")}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {champions
              .toSorted((a, b) => b.winRate - a.winRate)
              .slice(0, 4)
              .map((champion) => (
                <a
                  className="group flex min-h-[120px] flex-col justify-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white/[0.04]"
                  href={`/zh/champions/${champion.id}`}
                  key={champion.id}
                >
                  <strong className="text-xl font-bold tracking-[-0.02em] text-primary transition-colors group-hover:text-primary/80">
                    {translateChampionName(champion.name, locale)}
                  </strong>
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
