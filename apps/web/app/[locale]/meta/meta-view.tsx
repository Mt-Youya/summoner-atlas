"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MetricValue } from "@/components/display/metric-value"
import { RankChange } from "@/components/display/rank-change"
import { ContextSelector } from "@/components/selector/context-selector"
import { DATA_CONTEXT, type DataContext } from "@/lib/context"
import { AVAILABLE_PATCHES } from "@/lib/data"
import { useTranslation, useLocale } from "@/components/locale-provider"
import { localizePath } from "@summoner-atlas/i18n"

interface MetaEntry {
  id: number
  name: string
  alias: string
  winRate: number
  pickRate: number
  matches: number
  previousPatchDelta?: number
}

export function MetaView() {
  const translate = useTranslation()
  const locale = useLocale()
  const [context, setContext] = useState<DataContext>(DATA_CONTEXT)
  const [trendingUp, setTrendingUp] = useState<MetaEntry[]>([])
  const [trendingDown, setTrendingDown] = useState<MetaEntry[]>([])
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(true)
    const params = new URLSearchParams({ region: context.region, mode: context.mode, patch: context.patch })
    fetch(`/api/meta?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Request failed"))))
      .then((data) => {
        setTrendingUp(data.trendingUp ?? [])
        setTrendingDown(data.trendingDown ?? [])
      })
      .catch(() => {})
      .finally(() => setPending(false))
  }, [context])

  return (
    <>
      <ContextSelector context={context} patches={AVAILABLE_PATCHES} onContextChange={setContext} />
      {pending ? (
        <p className="py-16 text-center text-muted-foreground">{translate("loadingRanking")}</p>
      ) : (
        <div className="mt-8 grid gap-6 pb-28 md:grid-cols-2">
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
            <h3 className="mb-5 font-mono text-[11px] font-semibold tracking-[0.12em] text-positive uppercase">
              {translate("trendingUp")}
            </h3>
            <div className="divide-y divide-white/[0.04]">
              {trendingUp.slice(0, 10).map((entry) => (
                <Link
                  key={entry.id}
                  href={localizePath(`/zh/champions/${entry.id}`, locale)}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-white/[0.03] -mx-2 px-2 rounded-lg"
                >
                  <span className="grid">
                    <strong className="text-sm">{entry.name}</strong>
                    <span className="text-[11px] text-muted-foreground">{entry.alias}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <MetricValue value={entry.winRate} type="percent" className="font-semibold text-positive tabular-nums" />
                    <RankChange delta={entry.previousPatchDelta} />
                  </span>
                </Link>
              ))}
              {trendingUp.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">{translate("noTrendingUp")}</p>
              )}
            </div>
          </section>
          <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
            <h3 className="mb-5 font-mono text-[11px] font-semibold tracking-[0.12em] text-negative uppercase">
              {translate("trendingDown")}
            </h3>
            <div className="divide-y divide-white/[0.04]">
              {trendingDown.slice(0, 10).map((entry) => (
                <Link
                  key={entry.id}
                  href={localizePath(`/zh/champions/${entry.id}`, locale)}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-white/[0.03] -mx-2 px-2 rounded-lg"
                >
                  <span className="grid">
                    <strong className="text-sm">{entry.name}</strong>
                    <span className="text-[11px] text-muted-foreground">{entry.alias}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <MetricValue value={entry.winRate} type="percent" className="font-semibold text-negative tabular-nums" />
                    <RankChange delta={entry.previousPatchDelta} />
                  </span>
                </Link>
              ))}
              {trendingDown.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">{translate("noTrendingDown")}</p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
