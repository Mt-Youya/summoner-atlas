"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search01Icon, SparklesIcon, FireIcon } from "@hugeicons/core-free-icons"
import {
  Badge,
  Skeleton,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import type { ChampionDetail, GameMode } from "@/lib/data-service"

export default function BuildsPage() {
  const { t } = useTranslation()

  const [champions, setChampions] = useState<{ id: string; nameZh: string; name: string }[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<ChampionDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [mode] = useState<GameMode>("aram")

  useEffect(() => {
    mockDataService
      .getTopChampions({ mode, region: "cn", limit: 50 })
      .then((data) => {
        setChampions(data.map((d) => ({ id: d.champion.id, nameZh: d.champion.nameZh, name: d.champion.name })))
        setInitialLoading(false)
      })
      .catch(() => setInitialLoading(false))
  }, [mode])

  const loadBuild = useCallback(async (id: string) => {
    setSelectedId(id)
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
  }, [])

  const championList = champions

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowBuilds")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("buildResearch")}</h1>
      </div>

      {/* Champion selector */}
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10"
        />
        <Select value={selectedId ?? ""} onValueChange={(value) => value && loadBuild(value)}>
          <SelectTrigger className="w-full max-w-md pl-9">
            <SelectValue placeholder={t("selectChampion")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {championList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nameZh} — {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {!selectedId && !initialLoading && (
        <div className="text-center py-20">
          <HugeiconsIcon icon={SparklesIcon} className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">{t("searchBuildPrompt")}</p>
        </div>
      )}

      {initialLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{t("error")}</p>
          <button onClick={() => selectedId && loadBuild(selectedId)} className="text-sm text-primary hover:underline">
            {t("reload")}
          </button>
        </div>
      )}

      {detail && !loading && !error && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div
              className="size-12 rounded-xl bg-cover bg-center shrink-0"
              style={detail.champion.splashUrl ? { backgroundImage: `url(${detail.champion.splashUrl})` } : undefined}
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">{detail.champion.nameZh}</h2>
              <p className="text-sm text-muted-foreground">{detail.champion.name}</p>
            </div>
            <Badge variant="default" className="ml-auto">
              {detail.winRate.toFixed(1)}% WR
            </Badge>
          </div>

          <Separator />

          {/* Skill Order */}
          <div className="rounded-2xl card-glow bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t("skillOrder")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {detail.build.skillOrder.slice(0, 10).map((skill, i) => (
                <Badge
                  key={i}
                  variant={skill === "R" ? "default" : "secondary"}
                  className="text-xs font-mono size-7 flex items-center justify-center p-0"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">{detail.build.skillOrder.slice(0, 10).join(" → ")}</p>
          </div>

          {/* Core Items */}
          <div className="rounded-2xl card-glow bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t("coreItems")}
            </h3>
            <div className="flex items-center gap-4">
              {detail.build.coreItems.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center border border-border">
                    <HugeiconsIcon icon={FireIcon} className="size-5 text-amber-400" />
                  </div>
                  <span className="text-[10px] text-muted-foreground text-center max-w-[60px] truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Runes */}
          <div className="rounded-2xl card-glow bg-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("runes")}</h3>
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase mb-1">{t("primary")}</p>
                <Badge variant="default" className="text-xs">
                  {detail.build.runes.keystone}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">{detail.build.runes.primaryPath}</span>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase mb-1">{t("secondary")}</p>
                <span className="text-xs text-muted-foreground">{detail.build.runes.secondaryPath}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/champions/${detail.champion.id}`}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {t("details")} →
          </Link>
        </div>
      )}
    </div>
  )
}
