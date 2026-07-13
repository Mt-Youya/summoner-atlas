"use client"

import { useTranslation } from "@/components/locale-provider"
import { Input } from "@summoner-atlas/ui/input"
import { Button } from "@summoner-atlas/ui/button"

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
  const searchPlaceholder = translate("rankingSearch")
  return (
    <div className="flex flex-wrap gap-2">
      <Input
        className="min-h-11 min-w-[min(100%,20rem)] flex-1 border border-border bg-surface px-3 text-sm"
        value={filters.query}
        onChange={(e) => update("query", e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={translate("rankingSearch")}
      />
      <select
        className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
        value={filters.sort}
        onChange={(e) => update("sort", e.target.value as RankingFiltersState["sort"])}
        aria-label={translate("sort")}
      >
        <option value="winRate">{translate("sortWinRate")}</option>
        <option value="pickRate">{translate("sortPickRate")}</option>
        <option value="matches">{translate("sortMatches")}</option>
      </select>
      <select
        className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm"
        value={filters.minMatches}
        onChange={(e) => update("minMatches", Number(e.target.value))}
        aria-label={translate("sample")}
      >
        <option value="0">{translate("allSamples")}</option>
        <option value="1000">{translate("atLeast1000")}</option>
        <option value="5000">{translate("atLeast5000")}</option>
      </select>
      {showClear && (
        <Button
          className="min-h-11 border border-border bg-surface px-3 text-sm hover:bg-surface-raised"
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
