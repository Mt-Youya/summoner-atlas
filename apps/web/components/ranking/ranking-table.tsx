"use client"

import Link from "next/link"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@summoner-atlas/ui/table"
import { localizePath, type Locale } from "@summoner-atlas/i18n"
import { TierMark } from "@/components/display/tier-mark"
import { MetricValue } from "@/components/display/metric-value"
import { SampleConfidence } from "@/components/display/sample-confidence"
import { RankChange } from "@/components/display/rank-change"
import { ChampionIdentity } from "@/components/identity/champion-identity"
import { AugmentIdentity } from "@/components/identity/augment-identity"
import { ItemIdentity } from "@/components/identity/item-identity"
import { RuneIdentity } from "@/components/identity/rune-identity"
import { useTranslation } from "@/components/locale-provider"

export interface RankingEntry {
  id: number
  name: string
  alias?: string
  description?: string
  quality?: string
  tier?: string
  winRate: number
  pickRate?: number
  matches: number
  previousPatchDelta?: number
  imageUrl?: string
}

export function RankingTable({
  entries,
  type,
  detailHref,
  locale,
}: {
  entries: RankingEntry[]
  type: "champion" | "augment" | "item" | "rune"
  detailHref: (id: number) => string
  locale: Locale
}) {
  const translate = useTranslation()

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-white/[0.06] md:block">
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.02]">
                <TableHead className="sticky top-0 z-10 h-11 w-12 bg-white/[0.02] pl-5 font-mono text-xs font-medium text-muted-foreground">
                  #
                </TableHead>
                <TableHead className="sticky top-0 z-10 h-11 bg-white/[0.02] font-mono text-xs font-medium text-muted-foreground">
                  {translate("rankName")}
                </TableHead>
                <TableHead className="sticky top-0 z-10 h-11 w-16 bg-white/[0.02] font-mono text-xs font-medium text-muted-foreground">
                  Tier
                </TableHead>
                <TableHead className="sticky top-0 z-10 h-11 w-24 bg-white/[0.02] text-right font-mono text-xs font-medium text-muted-foreground">
                  {translate("winRate")}
                </TableHead>
                <TableHead className="sticky top-0 z-10 h-11 w-24 bg-white/[0.02] text-right font-mono text-xs font-medium text-muted-foreground">
                  {translate("pickRate")}
                </TableHead>
                <TableHead className="sticky top-0 z-10 h-11 w-24 bg-white/[0.02] text-right font-mono text-xs font-medium text-muted-foreground">
                  {translate("matches")}
                </TableHead>
                <TableHead className="sticky top-0 z-10 h-11 w-20 bg-white/[0.02] pr-5 font-mono text-xs font-medium text-muted-foreground">
                  {translate("confidence")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow
                  key={entry.id}
                  className="border-white/[0.03] transition-colors hover:bg-white/[0.03]"
                >
                  <TableCell className="pl-5 font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="max-w-72">
                    <Link href={localizePath(detailHref(entry.id), locale)} className="block">
                      {type === "champion" ? (
                        <ChampionIdentity name={entry.name} alias={entry.alias} imageUrl={entry.imageUrl} />
                      ) : type === "augment" ? (
                        <AugmentIdentity name={entry.name} quality={entry.quality} imageUrl={entry.imageUrl} />
                      ) : type === "item" ? (
                        <ItemIdentity name={entry.name} imageUrl={entry.imageUrl} />
                      ) : type === "rune" ? (
                        <RuneIdentity name={entry.name} imageUrl={entry.imageUrl} />
                      ) : (
                        <strong className="block truncate text-sm">{entry.name}</strong>
                      )}
                      {entry.description && (
                        <span className="block truncate text-xs text-muted-foreground">{entry.description}</span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <TierMark tier={entry.tier ?? classifyTier(entry.winRate, entry.pickRate ?? 0)} size="sm" />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="flex items-center justify-end gap-1">
                      <MetricValue value={entry.winRate} type="percent" className="text-sm font-semibold text-positive" />
                      {entry.previousPatchDelta !== undefined && (
                        <RankChange delta={entry.previousPatchDelta} />
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <MetricValue value={entry.pickRate} type="percent" className="text-sm text-muted-foreground tabular-nums" />
                  </TableCell>
                  <TableCell className="text-right">
                    <MetricValue value={entry.matches} type="number" className="text-sm tabular-nums" />
                  </TableCell>
                  <TableCell className="pr-5">
                    <SampleConfidence matches={entry.matches} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile card rows */}
      <div className="md:hidden">
        {entries.map((entry, index) => (
          <Link
            href={localizePath(detailHref(entry.id), locale)}
            key={entry.id}
            className="flex items-center gap-4 border-b border-white/[0.04] px-2 py-4 transition-colors hover:bg-white/[0.02]"
          >
            <b className="w-8 shrink-0 font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </b>
            <span className="min-w-0 flex-1">
              {type === "champion" ? (
                <ChampionIdentity name={entry.name} alias={entry.alias} imageUrl={entry.imageUrl} size={36} />
              ) : type === "augment" ? (
                <AugmentIdentity name={entry.name} quality={entry.quality} imageUrl={entry.imageUrl} size={28} />
              ) : type === "item" ? (
                <ItemIdentity name={entry.name} imageUrl={entry.imageUrl} size={28} />
              ) : type === "rune" ? (
                <RuneIdentity name={entry.name} imageUrl={entry.imageUrl} size={28} />
              ) : (
                <strong className="truncate text-sm">{entry.name}</strong>
              )}
            </span>
            <span className="shrink-0 text-right">
              <MetricValue value={entry.winRate} type="percent" className="block text-base font-bold text-positive" />
              <MetricValue value={entry.matches} type="number" className="text-xs text-muted-foreground" />
            </span>
            <span className="text-white/25" aria-hidden="true">&rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

const tiers = ["S", "A", "B", "C", "D"] as const
type Tier = (typeof tiers)[number]
function classifyTier(winRate: number, pickRate: number): Tier {
  const score = winRate * 0.7 + pickRate * 0.3
  if (score >= 0.55) return "S"
  if (score >= 0.52) return "A"
  if (score >= 0.49) return "B"
  if (score >= 0.46) return "C"
  return "D"
}
