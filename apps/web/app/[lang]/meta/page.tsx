"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SparklesIcon } from "hugeicons-react"
import { Badge, Skeleton } from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { PatchTrendChart } from "@/components/charts/patch-trend-chart"
import type { ChampionRank, AugmentRank, PatchSummary } from "@/lib/data-service"

export default function MetaPage() {
  const { t } = useTranslation()
  const [topChampions, setTopChampions] = useState<ChampionRank[]>([])
  const [topAugments, setTopAugments] = useState<AugmentRank[]>([])
  const [summary, setSummary] = useState<PatchSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [champs, augs, summ] = await Promise.all([
        mockDataService.getTopChampions({ mode: "aram", region: "cn", limit: 10 }),
        mockDataService.getTopAugments({ mode: "aram", limit: 6 }),
        mockDataService.getPatchSummary(),
      ])
      setTopChampions(champs)
      setTopAugments(augs)
      setSummary(summ)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-24 rounded-2xl" />))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowMeta")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("metaTitle")}</h1>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl card-glow bg-card p-5 text-center">
            <p className="text-3xl font-extrabold glow-high">{summary.version}</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t("version")}</p>
          </div>
          <div className="rounded-2xl card-glow bg-card p-5 text-center">
            <p className="text-3xl font-extrabold glow-high">{(summary.totalSamples / 10000).toFixed(0)}万</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t("globalSample")}</p>
          </div>
          <div className="rounded-2xl card-glow bg-card p-5 text-center">
            <p className="text-3xl font-extrabold glow-high">{topChampions.length}</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t("champions")}</p>
          </div>
        </div>
      )}

      {/* Top champions mini table */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">{t("stablePicks")}</h2>
        <div className="rounded-2xl card-glow bg-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {topChampions.map((item) => (
              <Link key={item.champion.id} href={`/champions/${item.champion.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors">
                <span className="font-mono text-sm text-muted-foreground w-6">#{item.rank}</span>
                <div className="size-8 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${item.champion.avatarUrl})` }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{item.champion.nameZh}</p>
                </div>
                <Badge variant="default" className="text-xs">{item.winRate.toFixed(1)}%</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top augments mini table */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">{t("researchAugments")}</h2>
        <div className="rounded-2xl card-glow bg-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {topAugments.map((item, i) => (
              <Link key={item.augment.id} href={`/augments/${item.augment.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors">
                <span className="font-mono text-sm text-muted-foreground w-6">#{i + 1}</span>
                <SparklesIcon className="size-4 text-hextech-blue" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{item.augment.nameZh}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{item.winRate.toFixed(1)}%</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
