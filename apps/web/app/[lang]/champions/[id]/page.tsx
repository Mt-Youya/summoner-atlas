"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft01Icon, SparklesIcon, FireIcon } from "@hugeicons/core-free-icons"
import { Button, Badge, Skeleton, Separator, Progress } from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { MiniSparkline } from "@/components/charts/mini-sparkline"
import { PatchTrendChart } from "@/components/charts/patch-trend-chart"
import type { ChampionDetail } from "@/lib/data-service"
import { confidenceVariant } from "@/lib/utils"

/* ── Helpers ── */

function GlowStat({ value, label, unit = "%" }: { value: number; label: string; unit?: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold tabular-nums glow-high">
        {value.toFixed(1)}
        <span className="text-lg md:text-xl ml-0.5 text-muted-foreground font-medium">{unit}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{label}</p>
    </div>
  )
}

/* ── Build Flow ── */

function BuildFlow({ detail }: { detail: ChampionDetail }) {
  const { t } = useTranslation()
  const { build } = detail

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Skill order */}
      <div className="rounded-2xl card-glow bg-card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("skillOrder")}</h3>
        <div className="flex flex-wrap gap-1.5">
          {build.skillOrder.slice(0, 10).map((skill, i) => (
            <Badge
              key={i}
              variant={skill === "R" ? "default" : "secondary"}
              className="text-xs font-mono size-7 flex items-center justify-center p-0"
            >
              {skill}
            </Badge>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          {build.skillOrder.slice(0, 10).join(" → ")}
          {build.skillOrder.length > 10 ? "…" : ""}
        </p>
      </div>

      {/* Core items */}
      <div className="rounded-2xl card-glow bg-card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("coreItems")}</h3>
        <div className="flex items-center gap-3">
          {build.coreItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                <HugeiconsIcon icon={FireIcon} className="size-5 text-amber-400" />
              </div>
              <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[60px] truncate">
                {item.name}
              </span>
              {i < build.coreItems.length - 1 && (
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  className="size-3 text-muted-foreground/50 rotate-180 hidden md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Runes */}
      <div className="rounded-2xl card-glow bg-card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("runes")}</h3>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("primary")}</p>
            <Badge variant="default" className="text-xs">
              {build.runes.keystone}
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">{build.runes.primaryPath}</span>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("secondary")}</p>
            <span className="text-xs text-muted-foreground">{build.runes.secondaryPath}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Augment Combos ── */

function AugmentCombos({ detail }: { detail: ChampionDetail }) {
  const { t } = useTranslation()

  if (detail.topAugmentCombos.length === 0) {
    return (
      <div className="text-center py-16">
        <HugeiconsIcon icon={SparklesIcon} className="size-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">{t("noComboAvailable")}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {detail.topAugmentCombos.map((combo, i) => (
        <Link
          key={combo.augment.id}
          href={`/augments/${combo.augment.id}`}
          className="group rounded-2xl card-glow bg-card p-5 hover:shadow-[var(--glow-high)] transition-all duration-500"
        >
          <div className="flex items-start justify-between mb-3">
            <Badge variant={i === 0 ? "default" : "secondary"} className="text-[10px]">
              #{i + 1}
            </Badge>
            <span className="text-xs text-muted-foreground tabular-nums">
              {combo.matches.toLocaleString()} {t("games")}
            </span>
          </div>
          <h4 className="font-semibold text-foreground mb-1">{combo.augment.nameZh}</h4>
          <p className="text-xs text-muted-foreground mb-3">{combo.augment.name}</p>
          <div className="flex items-center gap-2">
            <Progress value={combo.synergyScore} className="flex-1 h-1.5 bg-hextech-blue/20" />
            <span className="text-xs font-bold tabular-nums text-hextech-blue glow-mid">
              {combo.synergyScore.toFixed(0)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

/* ── Main Page ── */

export default function ChampionDetailPage() {
  const { t } = useTranslation()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [detail, setDetail] = useState<ChampionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await mockDataService.getChampionDetail({ id, mode: "aram" })
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

  /* ── Loading Skeleton ── */
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
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    )
  }

  /* ── Error State ── */
  if (error || !detail) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-32 text-center">
        <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <HugeiconsIcon icon={SparklesIcon} className="size-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("dataUnavailable")}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("cannotLoadPage")}</p>
        <Button
          onClick={load}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          {t("reload")}
        </Button>
        <Link href="/" className="block mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
          {t("backToHome")}
        </Link>
      </div>
    )
  }

  /* ── Content ── */
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 -mx-6 px-6 py-4 bg-background/80 backdrop-blur-xl border-b">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="size-10 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5 text-muted-foreground" />
          </Link>
          <div
            className="size-12 rounded-xl bg-cover bg-center shrink-0"
            style={detail.champion.splashUrl ? { backgroundImage: `url(${detail.champion.splashUrl})` } : undefined}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{detail.champion.nameZh}</h1>
            <p className="text-sm text-muted-foreground">{detail.champion.name}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold tabular-nums glow-mid">{detail.winRate.toFixed(1)}%</span>
            <p className="text-[10px] text-muted-foreground">
              {detail.matches.toLocaleString()} {t("games")}
            </p>
          </div>
        </div>
      </div>

      {/* Core Stats Row */}
      <div className="grid grid-cols-3 gap-6 items-center">
        <GlowStat value={detail.winRate} label={t("winRate")} />
        <GlowStat value={detail.pickRate} label={t("pickRate")} />
        <div className="text-center">
          <Badge variant={confidenceVariant(detail.confidence)} className="text-sm px-4 py-1.5">
            {t(detail.confidence)}
          </Badge>
          <MiniSparkline data={detail.trendData} />
        </div>
      </div>

      <Separator />

      {/* Build Flow */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">{t("recommendedBuild")}</h2>
        <BuildFlow detail={detail} />
      </section>

      {/* Augment Combos */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t("bestComboHighSample")}</h2>
          <Link
            href={`/augments?champion=${detail.champion.id}`}
            className="text-sm font-medium text-hextech-blue hover:text-hextech-amber transition-colors flex items-center gap-1"
          >
            {t("viewFullCombos")} <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 rotate-180" />
          </Link>
        </div>
        <AugmentCombos detail={detail} />
      </section>

      <Separator />

      {/* Patch Trend */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">{t("trendingUpTitle")}</h2>
        <div className="rounded-2xl card-glow bg-card p-6">
          <PatchTrendChart data={detail.trendData} />
        </div>
      </section>
    </div>
  )
}
