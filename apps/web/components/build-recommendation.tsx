"use client"

import { MetricValue } from "@/components/display/metric-value"
import { SampleConfidence } from "@/components/display/sample-confidence"
import { ItemIdentity } from "@/components/identity/item-identity"
import { RuneIdentity } from "@/components/identity/rune-identity"
import { useTranslation } from "@/components/locale-provider"

export interface BuildSlot {
  id: number
  name: string
  imageUrl?: string
  winRate: number
  pickRate: number
  matches: number
}

export interface BuildRecommendationData {
  label: string
  items: BuildSlot[]
  runes?: BuildSlot[]
  summonerSpells?: BuildSlot[]
  skillOrder?: string[]
}

export function BuildRecommendation({ build }: { build: BuildRecommendationData }) {
  const translate = useTranslation()
  return (
    <section className="border border-border bg-surface p-5">
      <h3 className="mb-4 font-mono text-xs tracking-[.08em] text-muted-foreground uppercase">{build.label}</h3>
      {build.items.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-[11px] text-muted-foreground">{translate("coreItems")}</h4>
          <div className="flex flex-wrap gap-2">
            {build.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 rounded border border-border bg-surface-raised px-2 py-1.5"
              >
                <ItemIdentity name={item.name} imageUrl={item.imageUrl} size={28} />
                <span className="grid text-right">
                  <MetricValue value={item.winRate} type="percent" className="text-xs text-positive" />
                  <MetricValue value={item.pickRate} type="percent" className="text-[10px] text-muted-foreground" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {build.runes && build.runes.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-[11px] text-muted-foreground">{translate("recommendedRunes")}</h4>
          <div className="flex flex-wrap gap-2">
            {build.runes.map((rune) => (
              <div
                key={rune.id}
                className="flex items-center gap-1.5 rounded border border-border bg-surface-raised px-2 py-1.5"
              >
                <RuneIdentity name={rune.name} imageUrl={rune.imageUrl} size={24} />
                <MetricValue value={rune.winRate} type="percent" className="text-xs text-positive" />
              </div>
            ))}
          </div>
        </div>
      )}
      {build.skillOrder && build.skillOrder.length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] text-muted-foreground">{translate("skillOrder")}</h4>
          <span className="font-mono text-sm tracking-wider tabular-nums">{build.skillOrder.join(" > ")}</span>
        </div>
      )}
      <SampleConfidence matches={build.items[0]?.matches ?? 0} className="mt-3" />
    </section>
  )
}
