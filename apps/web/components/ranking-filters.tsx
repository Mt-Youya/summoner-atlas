"use client"

import { useTranslation } from "@/components/locale-provider"
import { Input } from "@summoner-atlas/ui/input"
import { Button } from "@summoner-atlas/ui/button"
import { NativeSelect, NativeSelectOption } from "@summoner-atlas/ui/native-select"

export interface RankingFiltersState {
  query: string
  sort: "winRate" | "pickRate" | "matches"
  minMatches: number
}

export function RankingFilters({
  filters, onChange, showClear, onClear,
}: {
  filters: RankingFiltersState
  onChange: (next: RankingFiltersState) => void
  showClear: boolean
  onClear: () => void
}) {
  const translate = useTranslation()
  const update = <K extends keyof RankingFiltersState>(key: K, value: RankingFiltersState[K]) => { onChange({ ...filters, [key]: value }) }
  return (
    <div className="flex flex-wrap gap-2">
      <Input
        className="min-h-11 min-w-[min(100%,20rem)] flex-1 border border-border bg-surface px-3 text-sm"
        value={filters.query} onChange={(e) => update("query", e.target.value)}
        placeholder={translate("rankingSearch")} aria-label={translate("rankingSearch")}
      />
      <NativeSelect
        value={filters.sort} onChange={(e) => update("sort", e.target.value as RankingFiltersState["sort"])}
        aria-label={translate("sort")}
        className="[&>select]:min-h-11 [&>select]:border-border [&>select]:bg-surface [&>select]:text-sm"
      >
        <NativeSelectOption value="winRate">{translate("sortWinRate")}</NativeSelectOption>
        <NativeSelectOption value="pickRate">{translate("sortPickRate")}</NativeSelectOption>
        <NativeSelectOption value="matches">{translate("sortMatches")}</NativeSelectOption>
      </NativeSelect>
      <NativeSelect
        value={filters.minMatches} onChange={(e) => update("minMatches", Number(e.target.value))}
        aria-label={translate("sample")}
        className="[&>select]:min-h-11 [&>select]:border-border [&>select]:bg-surface [&>select]:text-sm"
      >
        <NativeSelectOption value="0">{translate("allSamples")}</NativeSelectOption>
        <NativeSelectOption value="1000">{translate("atLeast1000")}</NativeSelectOption>
        <NativeSelectOption value="5000">{translate("atLeast5000")}</NativeSelectOption>
      </NativeSelect>
      {showClear && (
        <Button className="min-h-11 border border-border bg-surface px-3 text-sm hover:bg-surface-raised" variant="outline" type="button" onClick={onClear}>
          {translate("clear")}
        </Button>
      )}
    </div>
  )
}
