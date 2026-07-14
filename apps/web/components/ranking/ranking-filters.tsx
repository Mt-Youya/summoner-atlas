"use client"

import { useTranslation } from "@/components/locale-provider"
import { Input } from "@summoner-atlas/ui/input"
import { Button } from "@summoner-atlas/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"

export interface RankingFiltersState {
  query: string
  sort: "winRate" | "pickRate" | "matches"
  minMatches: number
}

export function RankingFilters({
  filters,
  onChange,
  showClear,
  onClear,
}: {
  filters: RankingFiltersState
  onChange: (next: RankingFiltersState) => void
  showClear: boolean
  onClear: () => void
}) {
  const translate = useTranslation()
  const update = <K extends keyof RankingFiltersState>(key: K, value: RankingFiltersState[K]) => {
    onChange({ ...filters, [key]: value })
  }
  const sortItems = [
    { label: translate("sortWinRate"), value: "winRate" },
    { label: translate("sortPickRate"), value: "pickRate" },
    { label: translate("sortMatches"), value: "matches" },
  ]
  const sampleItems = [
    { label: translate("allSamples"), value: "0" },
    { label: translate("atLeast1000"), value: "1000" },
    { label: translate("atLeast5000"), value: "5000" },
  ]

  const glassInput = "min-h-11 border-white/[0.08] bg-white/[0.03] text-sm backdrop-blur-sm placeholder:text-white/20 focus:border-primary/40 focus:bg-white/[0.05]"
  const glassSelect = "min-h-11 border-white/[0.08] bg-white/[0.03] text-sm backdrop-blur-sm"

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        className={`min-w-[min(100%,18rem)] flex-1 ${glassInput}`}
        value={filters.query}
        onChange={(e) => update("query", e.target.value)}
        placeholder={translate("rankingSearch")}
        aria-label={translate("rankingSearch")}
      />
      <Select
        value={filters.sort}
        items={sortItems}
        onValueChange={(v) => update("sort", (v ?? "winRate") as RankingFiltersState["sort"])}
      >
        <SelectTrigger className={`min-w-[120px] ${glassSelect}`} aria-label={translate("sort")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(filters.minMatches)}
        items={sampleItems}
        onValueChange={(v) => update("minMatches", Number(v ?? "0"))}
      >
        <SelectTrigger className={`min-w-[140px] ${glassSelect}`} aria-label={translate("sample")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sampleItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showClear && (
        <Button
          className="min-h-11 border border-white/[0.08] bg-white/[0.03] px-4 text-sm backdrop-blur-sm hover:bg-white/[0.06] hover:text-foreground"
          variant="outline"
          type="button"
          onClick={onClear}
        >
          {translate("clear")}
        </Button>
      )}
    </div>
  )
}
