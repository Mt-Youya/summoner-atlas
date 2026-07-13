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
    <div className="border-t-2 border-foreground">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>{translate("rankName")}</TableHead>
              <TableHead className="w-16">Tier</TableHead>
              <TableHead className="w-20">胜率</TableHead>
              <TableHead className="w-20">登场率</TableHead>
              <TableHead className="w-20">场次</TableHead>
              <TableHead className="w-20">可信度</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="max-w-80">
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
                      <strong className="block truncate">{entry.name}</strong>
                    )}
                    {entry.description && (
                      <small className="block truncate text-xs text-muted-foreground">
                        {entry.description}
                      </small>
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  <TierMark tier={entry.tier ?? classifyTier(entry.winRate, entry.pickRate ?? 0)} size="sm" />
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
                <ChampionIdentity name={entry.name} alias={entry.alias} imageUrl={entry.imageUrl} size={32} />
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
