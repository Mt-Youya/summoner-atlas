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
  getChampion,
  getChampionCombos,
  getChampionSynergy,
  getAugments,
  number,
  percent,
} from "@/lib/data"
import { canonical } from "@/lib/site"
import { getLocale } from "@/lib/i18n-server"
import { t, translateChampionName, translateAugmentName, type MessageKey } from "@summoner-atlas/i18n"

function confidenceLabel(locale: string, matches: number): string {
  return matches >= 5000
    ? t(locale as "zh" | "en" | "ko", "high")
    : matches >= 1000
      ? t(locale as "zh" | "en" | "ko", "medium")
      : t(locale as "zh" | "en" | "ko", "low")
}

export async function generateMetadata({ params }: { params: Promise<{ championId: string }> }): Promise<Metadata> {
  const champion = await getChampion(Number((await params).championId))
  if (!champion) return { title: "Champion not found" }
  const path = `/zh/champions/${champion.id}`
  return {
    title: `${translateChampionName(champion.name, "en")} ARAM data`,
    description: `${translateChampionName(champion.name, "en")} win rate, matches, confidence, and combos on patch ${DATA_VERSION}.`,
    alternates: { canonical: path },
    openGraph: {
      title: `${translateChampionName(champion.name, "en")} | ARAM data`,
      description: `${percent(champion.winRate)} WR · ${number(champion.matches)} games`,
      url: canonical(path),
    },
  }
}

export default async function ChampionDetail({ params }: { params: Promise<{ championId: string }> }) {
  const locale = await getLocale()
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
  const augmentNames = new Map(augments.map((augment) => [augment.id, translateAugmentName(augment.name, locale)]))
  const bestSynergyName = bestSynergy?.combo_key
    ?.match(/\d+/g)
    ?.map((augmentId) => augmentNames.get(Number(augmentId)) ?? `Augment #${augmentId}`)
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
            alt={translateChampionName(champion.name, locale)}
            width={120}
            height={120}
            priority
          />
          <div>
            <span className="font-mono text-[11px] tracking-[0.1em] text-primary">
              {t(locale, "championSummary")} / {DATA_VERSION}
            </span>
            <h1 className="my-2 text-[clamp(3rem,7vw,5.5rem)] font-black tracking-[-0.1em]">
              {translateChampionName(champion.name, locale)}
            </h1>
            <p className="text-muted-foreground">
              {champion.alias} · {t(locale, "publicSnapshot")}
            </p>
          </div>
          <dl className="col-span-full flex gap-7 md:col-auto">
            <div className="grid gap-1.5">
              <dt className="text-[10px] text-muted-foreground">{t(locale, "winRate")}</dt>
              <dd>{percent(champion.winRate)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-[10px] text-muted-foreground">{t(locale, "matches")}</dt>
              <dd>{number(champion.matches)}</dd>
            </div>
            <div className="grid gap-1.5">
              <dt className="text-[10px] text-muted-foreground">{t(locale, "confidence")}</dt>
              <dd>{confidenceLabel(locale, champion.matches)}</dd>
            </div>
          </dl>
        </section>
        <section className="py-16">
          <span className="font-mono text-[11px] tracking-[0.1em] text-primary">{t(locale, "recommendedBuild")}</span>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">{t(locale, "actionableFirst")}</h2>
          {bestCombo ? (
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              <div className="grid min-h-40 content-center gap-3 bg-surface p-6">
                <small className="text-muted-foreground">{t(locale, "bestComboHighSample")}</small>
                <strong className="text-4xl text-primary">{percent(bestCombo.win_rate)}</strong>
                <span className="text-sm text-muted-foreground">
                  {number(bestCombo.total_matches)} {t(locale, "games")} · {comboLabel(bestCombo, locale)}
                </span>
              </div>
              <div className="grid min-h-40 content-center gap-3 bg-surface p-6">
                <small className="text-muted-foreground">{t(locale, "augmentSynergyRef")}</small>
                <strong className="text-4xl text-primary">
                  {bestSynergy ? percent(bestSynergy.win_rate) : t(locale, "noData")}
                </strong>
                <span className="text-sm text-muted-foreground">
                  {bestSynergy
                    ? `${number(bestSynergy.total_matches)} ${t(locale, "games")} · ${bestSynergyName}`
                    : t(locale, "noReliableSynergy")}
                </span>
              </div>
            </div>
          ) : (
            <p className="py-8 text-muted-foreground">{t(locale, "noComboAvailable")}</p>
          )}
        </section>
        <section>
          <span className="font-mono text-[11px] tracking-[0.1em] text-primary">{t(locale, "deepDataCombo")}</span>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">{t(locale, "topWinRateCombos")}</h2>
          {combos.slice(0, 10).map((combo, index) => (
            <div
              className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-4 border-b border-border text-sm"
              key={`${combo.combo_type ?? "combo"}-${combo.combo_key ?? "default"}-${combo.tier_signature ?? "tier"}-${index}`}
            >
              <span>{comboLabel(combo, locale)}</span>
              <strong>{percent(combo.win_rate)}</strong>
              <span>
                {number(combo.total_matches)} {t(locale, "games")}
              </span>
              <span>{confidenceLabel(locale, combo.total_matches)}</span>
            </div>
          ))}
        </section>
      </article>
    </PageFrame>
  )
}
