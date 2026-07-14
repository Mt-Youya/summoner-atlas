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
    <section className="mt-8 pb-28">
      <div className="max-w-lg rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
        <ItemIdentity name={item.name} size={48} />
        <div className="mt-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{translate("winRate")}</span>
            <MetricValue value={item.winRate ?? 0} type="percent" className="font-semibold text-positive tabular-nums" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{translate("pickRate")}</span>
            <MetricValue value={item.pickRate ?? 0} type="percent" className="tabular-nums" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{translate("matches")}</span>
            <MetricValue value={matches} type="number" className="tabular-nums" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
          <SampleConfidence matches={matches} />
          <DataFreshness updatedAt={item.updatedAt} />
        </div>
      </div>
    </section>
  )
}
