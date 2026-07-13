"use client"

import { MetricValue } from "@/components/display/metric-value"
import { SampleConfidence } from "@/components/display/sample-confidence"
import { DataFreshness } from "@/components/display/data-freshness"
import { ItemIdentity } from "@/components/identity/item-identity"
import { useTranslation } from "@/components/locale-provider"

interface ItemData {
  id: number
  name: string
  description: string
  winRate?: number
  pickRate?: number
  matches?: number
  updatedAt?: string
}

export function ItemDetailView({ item }: { item: ItemData }) {
  const translate = useTranslation()
  const matches = item.matches ?? 0
  return (
    <section className="mt-8 grid gap-6 pb-28 md:grid-cols-3">
      <div className="rounded border border-border bg-surface p-5">
        <ItemIdentity name={item.name} size={48} />
        <div className="mt-4 grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{translate("winRate")}</span>
            <MetricValue value={item.winRate ?? 0} type="percent" className="font-bold text-positive" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{translate("pickRate")}</span>
            <MetricValue value={item.pickRate ?? 0} type="percent" />
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">{translate("matches")}</span>
            <MetricValue value={matches} type="number" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <SampleConfidence matches={matches} />
          <DataFreshness updatedAt={item.updatedAt} />
        </div>
      </div>
    </section>
  )
}
