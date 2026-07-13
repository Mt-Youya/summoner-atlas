import Link from "next/link"
import { TierMark } from "@/components/tier-mark"
import { MetricValue } from "@/components/metric-value"
import { ChampionIdentity } from "@/components/champion-identity"
import type { RankingEntry } from "@/components/ranking-table"

export function RankingMobileRow({
  entry,
  index,
  type,
  detailHref,
}: {
  entry: RankingEntry
  index: number
  type: "champion" | "augment" | "item" | "rune"
  detailHref: (id: number) => string
}) {
  return (
    <Link
      href={detailHref(entry.id)}
      className="grid min-h-[72px] grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border py-3 transition-colors hover:bg-surface"
    >
      <b className="font-mono text-[11px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</b>
      <span className="grid gap-0.5">
        {type === "champion" ? (
          <ChampionIdentity name={entry.name} alias={entry.alias} size={32} />
        ) : (
          <>
            <strong className="truncate text-sm">{entry.name}</strong>
            {entry.description && (
              <small className="truncate text-[11px] text-muted-foreground">{entry.description}</small>
            )}
          </>
        )}
      </span>
      <span className="grid gap-0.5 text-right">
        <MetricValue value={entry.winRate} type="percent" className="font-bold text-positive" />
        <MetricValue value={entry.matches} type="number" className="text-[11px] text-muted-foreground" />
        <TierMark tier={entry.tier ?? "B"} size="sm" />
      </span>
    </Link>
  )
}
