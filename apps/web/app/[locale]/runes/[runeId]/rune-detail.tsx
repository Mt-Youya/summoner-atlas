"use client"

import { useEffect, useState } from "react"
import { MetricValue } from "@/components/display/metric-value"
import { SampleConfidence } from "@/components/display/sample-confidence"
import { DataFreshness } from "@/components/display/data-freshness"
import { useTranslation } from "@/components/locale-provider"

interface RuneData {
  id: number
  name: string
  description: string
  path: string
  winRate: number
  pickRate: number
  matches: number
  updatedAt?: string
}

export function RuneDetailView({ id }: { id: number }) {
  const translate = useTranslation()
  const [rune, setRune] = useState<RuneData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/runes/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Request failed"))))
      .then(setRune)
      .catch(() => setError(true))
  }, [id])

  if (error) return <p className="py-16 text-center text-negative">{translate("rankingError")}</p>
  if (!rune) return <p className="py-16 text-center text-muted-foreground">{translate("loading")}</p>

  return (
    <section className="mt-8 pb-28">
      <div className="max-w-lg rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
        <div className="mb-2 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
          {rune.path}
        </div>
        <h2 className="text-2xl font-bold tracking-[-0.03em]">{rune.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{rune.description}</p>
        <div className="mt-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{translate("winRate")}</span>
            <MetricValue value={rune.winRate} type="percent" className="font-semibold text-positive tabular-nums" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{translate("pickRate")}</span>
            <MetricValue value={rune.pickRate} type="percent" className="tabular-nums" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{translate("matches")}</span>
            <MetricValue value={rune.matches} type="number" className="tabular-nums" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
          <SampleConfidence matches={rune.matches} />
          <DataFreshness updatedAt={rune.updatedAt} />
        </div>
      </div>
    </section>
  )
}
