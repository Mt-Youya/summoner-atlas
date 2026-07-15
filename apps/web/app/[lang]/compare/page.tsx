"use client"

import { useState, useCallback } from "react"
import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge, Skeleton } from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import type { ChampionDetail } from "@/lib/data-service"

export default function ComparePage() {
  const { t } = useTranslation()

  const [champions, setChampions] = useState<{ id: string; nameZh: string; name: string }[]>([])
  const [initialized, setInitialized] = useState(false)
  const [champAId, setChampAId] = useState<string>("")
  const [champBId, setChampBId] = useState<string>("")
  const [detailA, setDetailA] = useState<ChampionDetail | null>(null)
  const [detailB, setDetailB] = useState<ChampionDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Load champion list on mount
  if (!initialized) {
    setInitialized(true)
    mockDataService.getTopChampions({ mode: "aram", region: "cn", limit: 50 }).then((data) => {
      setChampions(data.map((d) => ({ id: d.champion.id, nameZh: d.champion.nameZh, name: d.champion.name })))
    })
  }

  const compare = useCallback(async () => {
    if (!champAId || !champBId) return
    setLoading(true)
    setError(false)
    try {
      const [a, b] = await Promise.all([
        mockDataService.getChampionDetail({ id: champAId, mode: "aram" }),
        mockDataService.getChampionDetail({ id: champBId, mode: "aram" }),
      ])
      setDetailA(a)
      setDetailB(b)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [champAId, champBId])

  const selectClasses =
    "w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowError")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("championCompare")}</h1>
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <select className={selectClasses} value={champAId} onChange={(e) => setChampAId(e.target.value)}>
          <option value="">{t("championOne")}</option>
          {champions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameZh} — {c.name}
            </option>
          ))}
        </select>
        <span className="text-muted-foreground font-bold text-sm">{t("vs")}</span>
        <select className={selectClasses} value={champBId} onChange={(e) => setChampBId(e.target.value)}>
          <option value="">{t("championTwo")}</option>
          {champions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameZh} — {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={compare}
          disabled={!champAId || !champBId || loading}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-[var(--glow-mid)]"
        >
          {t("startCompare")}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <HugeiconsIcon icon={SparklesIcon} className="size-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{t("error")}</p>
        </div>
      )}

      {detailA && detailB && !loading && (
        <div className="space-y-8">
          {/* Side-by-side stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-2xl card-glow bg-card p-6 text-center">
              <div
                className="size-12 rounded-xl bg-cover bg-center mx-auto mb-3"
                style={
                  detailA.champion.splashUrl ? { backgroundImage: `url(${detailA.champion.splashUrl})` } : undefined
                }
              />
              <h3 className="font-bold text-foreground">{detailA.champion.nameZh}</h3>
              <p className="text-xs text-muted-foreground mb-4">{detailA.champion.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-extrabold glow-mid">{detailA.winRate.toFixed(1)}%</p>
                  <p className="text-[10px] text-muted-foreground">{t("winRate")}</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold glow-mid">{detailA.pickRate.toFixed(1)}%</p>
                  <p className="text-[10px] text-muted-foreground">{t("pickRate")}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl card-glow bg-card p-6 text-center">
              <div
                className="size-12 rounded-xl bg-cover bg-center mx-auto mb-3"
                style={
                  detailB.champion.splashUrl ? { backgroundImage: `url(${detailB.champion.splashUrl})` } : undefined
                }
              />
              <h3 className="font-bold text-foreground">{detailB.champion.nameZh}</h3>
              <p className="text-xs text-muted-foreground mb-4">{detailB.champion.name}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-extrabold glow-mid">{detailB.winRate.toFixed(1)}%</p>
                  <p className="text-[10px] text-muted-foreground">{t("winRate")}</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold glow-mid">{detailB.pickRate.toFixed(1)}%</p>
                  <p className="text-[10px] text-muted-foreground">{t("pickRate")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Build comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[detailA, detailB].map((d, di) => (
              <div key={di} className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  {d.champion.nameZh} {t("recommendedBuild")}
                </h4>
                <div className="rounded-2xl card-glow bg-card p-4">
                  <p className="text-[10px] text-muted-foreground uppercase mb-2">{t("skillOrder")}</p>
                  <div className="flex flex-wrap gap-1">
                    {d.build.skillOrder.slice(0, 6).map((s, i) => (
                      <Badge
                        key={i}
                        variant={s === "R" ? "default" : "secondary"}
                        className="text-xs font-mono size-6 flex items-center justify-center p-0"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl card-glow bg-card p-4">
                  <p className="text-[10px] text-muted-foreground uppercase mb-2">{t("runes")}</p>
                  <Badge variant="default" className="text-xs">
                    {d.build.runes.keystone}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-2">
                    {d.build.runes.primaryPath} / {d.build.runes.secondaryPath}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!detailA && !detailB && !loading && !error && (
        <div className="text-center py-20">
          <HugeiconsIcon icon={SparklesIcon} className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">{t("noCompareData")}</p>
        </div>
      )}
    </div>
  )
}
