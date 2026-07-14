"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft01Icon, SparklesIcon } from "hugeicons-react"
import { Badge, Skeleton, Separator, Avatar, AvatarImage, AvatarFallback } from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { PatchTrendChart } from "@/components/charts/patch-trend-chart"
import type { AugmentDetail } from "@/lib/data-service"
import { confidenceVariant } from "@/lib/utils"

export default function AugmentDetailPage() {
  const { t } = useTranslation()
  const params = useParams<{ id: string }>()
  const id = params.id
  const [detail, setDetail] = useState<AugmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await mockDataService.getAugmentDetail({ id, mode: "aram" })
      setDetail(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-32 text-center">
        <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <SparklesIcon className="size-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("dataUnavailable")}</h2>
        <p className="text-muted-foreground mb-8">{t("cannotLoadPage")}</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          {t("reload")}
        </button>
        <Link href="/" className="block mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
          {t("backToHome")}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 -mx-6 px-6 py-4 bg-background/80 backdrop-blur-xl border-b">
        <div className="flex items-center gap-4">
          <Link
            href="/augments"
            className="size-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft01Icon className="size-5 text-muted-foreground" />
          </Link>
          <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
            <SparklesIcon className="size-6 text-hextech-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{detail.augment.nameZh}</h1>
            <p className="text-sm text-muted-foreground">{detail.augment.name}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold tabular-nums glow-mid">{detail.winRate.toFixed(1)}%</span>
            <p className="text-[10px] text-muted-foreground">
              {detail.matches.toLocaleString()} {t("games")}
            </p>
          </div>
        </div>
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-3 gap-6 items-center">
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-extrabold tabular-nums glow-high">
            {detail.winRate.toFixed(1)}
            <span className="text-lg md:text-xl ml-0.5 text-muted-foreground font-medium">%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{t("winRate")}</p>
        </div>
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-extrabold tabular-nums glow-high">
            {detail.pickRate.toFixed(1)}
            <span className="text-lg md:text-xl ml-0.5 text-muted-foreground font-medium">%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{t("pickRate")}</p>
        </div>
        <div className="text-center">
          <Badge variant={confidenceVariant(detail.confidence)} className="text-sm px-4 py-1.5">
            {t(detail.confidence)}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Description */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">{t("augmentSummary")}</h2>
        <div className="rounded-2xl card-glow bg-card p-6">
          <p className="text-muted-foreground leading-relaxed">{detail.augment.description}</p>
        </div>
      </section>

      {/* Suitable Champions */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">{t("suitableChampions")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {detail.suitableChampions.map((sc, i) => (
            <Link
              key={sc.champion.id}
              href={`/champions/${sc.champion.id}`}
              className="group rounded-2xl card-glow bg-card p-5 hover:shadow-[var(--glow-high)] transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar size="sm">
                  <AvatarImage src={sc.champion.avatarUrl} alt={sc.champion.name} />
                  <AvatarFallback>{sc.champion.nameZh.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-foreground">{sc.champion.nameZh}</p>
                  <p className="text-xs text-muted-foreground">{sc.champion.name}</p>
                </div>
                <Badge variant={i === 0 ? "default" : "secondary"} className="ml-auto text-[10px]">
                  #{i + 1}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-hextech-blue rounded-full transition-all duration-700"
                    style={{ width: `${sc.synergyScore}%` }}
                  />
                </div>
                <span className="text-xs font-bold tabular-nums text-hextech-blue glow-mid">
                  {sc.synergyScore.toFixed(0)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Separator />

      {/* Trend */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">{t("trendingUpTitle")}</h2>
        <div className="rounded-2xl card-glow bg-card p-6">
          <PatchTrendChart data={detail.trendData} />
        </div>
      </section>
    </div>
  )
}
