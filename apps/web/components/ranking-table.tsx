import Link from "next/link"
import { TierMark } from "@/components/tier-mark"
import { MetricValue } from "@/components/metric-value"
import { SampleConfidence } from "@/components/sample-confidence"
import { RankChange } from "@/components/rank-change"
import { ChampionIdentity } from "@/components/champion-identity"
import { useTranslation } from "@/components/locale-provider"

export interface RankingEntry {
  id: number
  name: string
  alias?: string
  description?: string
  quality?: string
  tier?: string
  winRate: number
  pickRate: number
  matches: number
  previousPatchDelta?: number
}

export function RankingTable({
  entries,
  type,
  detailHref,
}: {
  entries: RankingEntry[]
  type: "champion" | "augment" | "item" | "rune"
  detailHref: (id: number) => string
}) {
  const translate = useTranslation()
  return (
    <div className="border-t-2 border-foreground">
      <div className="hidden min-h-11 grid-cols-[2fr_.6fr_.6fr_.5fr_.6fr_.6fr] items-center gap-3 border-b border-border font-mono text-[10px] tracking-[.08em] text-muted-foreground md:grid">
        <span>{translate("rankName")}</span>
        <span>Tier</span>
        <span>{translate("winRate")}</span>
        <span>{translate("pickRate")}</span>
        <span>{translate("matches")}</span>
        <span>{translate("confidence")}</span>
      </div>
      {entries.map((entry, index) => (
        <Link
          href={detailHref(entry.id)}
          className="grid min-h-[76px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-border py-4 transition-colors hover:bg-surface md:grid-cols-[2fr_.6fr_.6fr_.5fr_.6fr_.6fr] md:gap-3 md:py-0 md:hover:px-3"
          key={entry.id}
        >
          <span className="row-span-2 grid grid-cols-[28px_1fr] items-center gap-x-3 md:row-auto">
            <b className="row-span-2 self-center font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </b>
            {type === "champion" ? (
              <ChampionIdentity name={entry.name} alias={entry.alias} />
            ) : (
              <span className="grid">
                <strong className="truncate text-sm">{entry.name}</strong>
                {(entry.description || entry.quality) && (
                  <small className="truncate text-[11px] text-muted-foreground">
                    {entry.description ?? entry.quality}
                  </small>
                )}
              </span>
            )}
          </span>
          <span className="hidden md:inline-flex">
            <TierMark tier={entry.tier ?? classifyTier(entry.winRate, entry.pickRate)} size="sm" />
          </span>
          <span>
            <MetricValue value={entry.winRate} type="percent" className="text-positive" />
            {entry.previousPatchDelta !== undefined && (
              <RankChange delta={entry.previousPatchDelta} className="ml-1 hidden md:inline-flex" />
            )}
          </span>
          <MetricValue value={entry.pickRate} type="percent" className="hidden text-xs text-muted-foreground md:inline" />
          <span className="text-xs text-muted-foreground md:text-sm md:text-foreground">
            <MetricValue value={entry.matches} type="number" />
          </span>
          <SampleConfidence matches={entry.matches} className="hidden md:inline-flex" />
        </Link>
      ))}
    </div>
  )
}

function classifyTier(winRate: number, pickRate: number): string {
  const score = winRate * 0.7 + pickRate * 0.3
  if (score >= 0.55) return "S"
  if (score >= 0.52) return "A"
  if (score >= 0.49) return "B"
  if (score >= 0.46) return "C"
  return "D"
}
