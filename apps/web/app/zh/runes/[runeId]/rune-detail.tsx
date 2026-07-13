"use client"

import { useEffect, useState } from "react"
import { MetricValue } from "@/components/metric-value"
import { SampleConfidence } from "@/components/sample-confidence"
import { DataFreshness } from "@/components/data-freshness"
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
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("请求失败"))))
      .then(setRune)
      .catch(() => setError(true))
  }, [id])

  if (error) return <p className="py-8 text-negative">{translate("rankingError")}</p>
  if (!rune) return <p className="py-8 text-muted-foreground">{translate("loading")}</p>

  return (
    <section className="mt-8 grid gap-6 pb-28 md:grid-cols-3">
      <div className="rounded border border-border bg-surface p-5">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{translate("winRate")}</span>
            <MetricValue value={rune.winRate} type="percent" className="font-bold text-positive" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{translate("pickRate")}</span>
            <MetricValue value={rune.pickRate} type="percent" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{translate("matches")}</span>
            <MetricValue value={rune.matches} type="number" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <SampleConfidence matches={rune.matches} />
          <DataFreshness updatedAt={rune.updatedAt} />
        </div>
      </div>
    </section>
  )
}
