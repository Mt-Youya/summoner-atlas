import Link from "next/link"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@summoner-atlas/ui/table"
import { localizePath, type Locale } from "@summoner-atlas/i18n"
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
  locale,
}: {
  entries: RankingEntry[]
  type: "champion" | "augment" | "item" | "rune"
  detailHref: (id: number) => string
  locale: Locale
}) {
  const translate = useTranslation()
  return (
    <div className="border-t-2 border-foreground">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>{translate("rankName")}</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">{translate("winRate")}</TableHead>
              <TableHead className="text-right">{translate("pickRate")}</TableHead>
              <TableHead className="text-right">{translate("matches")}</TableHead>
              <TableHead>{translate("confidence")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell>
                  <Link href={localizePath(detailHref(entry.id), locale)} className="block">
                    {type === "champion" ? (
                      <ChampionIdentity name={entry.name} alias={entry.alias} />
                    ) : (
                      <strong>{entry.name}</strong>
                    )}
                    {(entry.description || entry.quality) && (
                      <small className="block truncate text-xs text-muted-foreground">
                        {entry.description ?? entry.quality}
                      </small>
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  <TierMark tier={entry.tier ?? classifyTier(entry.winRate, entry.pickRate)} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <MetricValue value={entry.winRate} type="percent" className="text-positive" />
                  {entry.previousPatchDelta !== undefined && (
                    <RankChange delta={entry.previousPatchDelta} className="ml-1" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <MetricValue value={entry.pickRate} type="percent" className="text-muted-foreground" />
                </TableCell>
                <TableCell className="text-right">
                  <MetricValue value={entry.matches} type="number" />
                </TableCell>
                <TableCell>
                  <SampleConfidence matches={entry.matches} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden">
        {entries.map((entry, index) => (
          <Link
            href={localizePath(detailHref(entry.id), locale)}
            key={entry.id}
            className="flex items-center gap-3 border-b border-border py-3"
          >
            <b className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</b>
            <span className="min-w-0 flex-1">
              {type === "champion" ? (
                <ChampionIdentity name={entry.name} alias={entry.alias} size={32} />
              ) : (
                <strong className="truncate text-sm">{entry.name}</strong>
              )}
            </span>
            <span className="text-right">
              <MetricValue value={entry.winRate} type="percent" className="font-bold text-positive" />
              <br />
              <MetricValue value={entry.matches} type="number" className="text-xs text-muted-foreground" />
            </span>
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
