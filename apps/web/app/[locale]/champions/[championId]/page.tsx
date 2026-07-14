import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageFrame } from "@/components/layout/page-frame"
import { DataContextBar } from "@/components/home/data-context-bar"
import { ChampionHeroClient } from "./hero-client"
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
import { t, translateChampionName, translateAugmentName } from "@summoner-atlas/i18n"

function confidenceLabel(locale: string, matches: number): string {
  return matches >= 5000
    ? t(locale as "zh" | "en" | "ko", "high")
    : matches >= 1000
      ? t(locale as "zh" | "en" | "ko", "medium")
      : t(locale as "zh" | "en" | "ko", "low")
}

export async function generateMetadata({ params }: { params: Promise<{ championId: string }> }): Promise<Metadata> {
  const champion = await getChampion(Number((await params).championId))
  if (!champion) return { title: "Champion not found / 英雄未找到" }
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

  const bestCombo = combos.filter((c) => c.total_matches >= 5000).toSorted((a, b) => b.win_rate - a.win_rate)[0]
  const bestSynergy = synergy
    .filter((c) => c.total_matches >= 1000)
    .toSorted((a, b) => b.win_rate - a.win_rate)[0]
  const augmentNames = new Map(augments.map((a) => [a.id, translateAugmentName(a.name, locale)]))
  const bestSynergyName = bestSynergy?.combo_key
    ?.match(/\d+/g)
    ?.map((augId) => augmentNames.get(Number(augId)) ?? `Augment #${augId}`)
    .join(" · ")

  return (
    <PageFrame>
      <article className="pb-28">
        <div className="pt-6">
          <DataContextBar />
        </div>

        {/* Hero */}
        <ChampionHeroClient
          championName={translateChampionName(champion.name, locale)}
          alias={champion.alias}
          winRate={percent(champion.winRate)}
          matches={number(champion.matches)}
          confidence={confidenceLabel(locale, champion.matches)}
          summaryLabel={t(locale, "championSummary")}
          winRateLabel={t(locale, "winRate")}
          matchesLabel={t(locale, "matches")}
          confidenceLabel={t(locale, "confidence")}
          publicSnapshotLabel={t(locale, "publicSnapshot")}
          dataVersion={DATA_VERSION}
        >
          <Image
            src={championIcon(champion.id)}
            alt={translateChampionName(champion.name, locale)}
            width={140}
            height={140}
            className="rounded-2xl border border-white/[0.08]"
            priority
          />
        </ChampionHeroClient>

        {/* Best Combo + Synergy */}
        <section className="py-16">
          <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
            {t(locale, "recommendedBuild")}
          </span>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-black leading-[0.94] tracking-[-0.05em]">
            {t(locale, "actionableFirst")}
          </h2>
          {bestCombo ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                <span className="text-xs text-muted-foreground">{t(locale, "bestComboHighSample")}</span>
                <strong className="text-[clamp(2.5rem,4vw,3.5rem)] font-black leading-none text-primary">
                  {percent(bestCombo.win_rate)}
                </strong>
                <span className="text-sm text-muted-foreground">
                  {number(bestCombo.total_matches)} {t(locale, "games")} · {comboLabel(bestCombo, locale)}
                </span>
              </div>
              <div className="flex flex-col justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                <span className="text-xs text-muted-foreground">{t(locale, "augmentSynergyRef")}</span>
                <strong className="text-[clamp(2.5rem,4vw,3.5rem)] font-black leading-none text-primary">
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
            <p className="py-12 text-muted-foreground">{t(locale, "noComboAvailable")}</p>
          )}
        </section>

        {/* Full Combo List */}
        <section>
          <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
            {t(locale, "deepDataCombo")}
          </span>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-black leading-[0.94] tracking-[-0.05em]">
            {t(locale, "topWinRateCombos")}
          </h2>
          <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.06]">
            {combos.slice(0, 10).map((combo, index) => (
              <div
                className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-4 border-b border-white/[0.03] px-5 py-4 text-sm last:border-b-0 transition-colors hover:bg-white/[0.02]"
                key={`${combo.combo_type ?? "combo"}-${combo.combo_key ?? "default"}-${combo.tier_signature ?? "tier"}-${index}`}
              >
                <span className="truncate">{comboLabel(combo, locale)}</span>
                <strong className="font-mono tabular-nums text-positive">{percent(combo.win_rate)}</strong>
                <span className="font-mono tabular-nums text-xs text-muted-foreground">
                  {number(combo.total_matches)} {t(locale, "games")}
                </span>
                <span className="text-xs text-muted-foreground">{confidenceLabel(locale, combo.total_matches)}</span>
              </div>
            ))}
          </div>
        </section>
      </article>
    </PageFrame>
  )
}
