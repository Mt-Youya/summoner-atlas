"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { number, percent, type AugmentRank, type ChampionRank } from "@/lib/data"
import { Button } from "@summoner-atlas/ui/button"
import { Input } from "@summoner-atlas/ui/input"
import { Spinner } from "@summoner-atlas/ui/spinner"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@summoner-atlas/ui/select"
import { ContextBar } from "@/components/context-bar"
import { DATA_CONTEXT } from "@/lib/data"
import { translateChampionName, translateAugmentName, translateAugmentDesc, localizePath } from "@summoner-atlas/i18n"
import { filterRankings } from "@/lib/ranking"
import { useTranslation, useLocale } from "@/components/locale-provider"

type Entry = ChampionRank | AugmentRank
type Props = { type: "champion" | "augment" }

export function RankingExplorer({ type }: Props) {
  const translate = useTranslation()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, setPending] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [error, setError] = useState(false)
  const query = params.get("q") ?? ""
  const sort = params.get("sort") ?? "winRate"
  const minimumMatches = Number(params.get("minMatches") ?? "0")
  useEffect(() => {
    const controller = new AbortController()
    setPending(true)
    setError(false)
    fetch(type === "champion" ? "/api/champions" : "/api/augments", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Ranking request failed"))))
      .then((data: Entry[]) => setEntries(data))
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(true)
      })
      .finally(() => setPending(false))
    return () => controller.abort()
  }, [type])
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setPending(true)
    router.replace(`${pathname}?${next}`)
    queueMicrotask(() => setPending(false))
  }
  const filtered = useMemo(
    () => filterRankings(entries, query, sort === "matches" ? "matches" : "winRate", minimumMatches),
    [entries, query, sort, minimumMatches]
  )
  const clear = () => router.replace(pathname)
  const href = (id: number) => localizePath(type === "champion" ? `/zh/champions/${id}` : `/zh/augments/${id}`, locale)
  return (
    <section className="py-8 pb-28" aria-busy={pending}>
      <ContextBar context={DATA_CONTEXT} />
      <div className="mb-6 mt-6 flex flex-wrap gap-2">
        <Input
          className="min-h-11 min-w-[min(100%,20rem)] flex-1 border border-border bg-surface px-3 text-sm"
          value={query}
          onChange={(event) => update("q", event.target.value)}
          placeholder={type === "champion" ? translate("rankingSearchChampion") : translate("rankingSearchAugment")}
          aria-label={translate("rankingSearch")}
        />
        {(() => {
          const sortItems = [
            { label: translate("sortWinRate"), value: "winRate" },
            { label: translate("sortMatches"), value: "matches" },
          ]
          return (
            <Select value={sort} items={sortItems} onValueChange={(v) => update("sort", v ?? "winRate")}>
              <SelectTrigger
                className="min-h-11 min-w-30 border-border bg-surface text-sm"
                aria-label={translate("sort")}
              >
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
          )
        })()}
        {(() => {
          const sampleItems = [
            { label: translate("allSamples"), value: "0" },
            { label: translate("atLeast1000"), value: "1000" },
            { label: translate("atLeast5000"), value: "5000" },
          ]
          return (
            <Select
              value={String(minimumMatches)}
              items={sampleItems}
              onValueChange={(v) => update("minMatches", (v ?? "0") === "0" ? "" : (v ?? "0"))}
            >
              <SelectTrigger
                className="min-h-11 min-w-35 border-border bg-surface text-sm"
                aria-label={translate("sample")}
              >
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
          )
        })()}
        {(query || sort !== "winRate" || minimumMatches > 0) && (
          <Button
            className="min-h-11 border border-border bg-surface px-3 text-sm hover:bg-surface-raised"
            variant="outline"
            type="button"
            onClick={clear}
          >
            {translate("clear")}
          </Button>
        )}
      </div>
      <div className="border-t-2 border-foreground">
        <div className="hidden min-h-11 grid-cols-[1.8fr_.65fr_.65fr_.6fr] items-center gap-4 border-b border-border font-mono text-lg tracking-[.08em] text-muted-foreground md:grid">
          <span>{translate("rankName")}</span>
          <span>{translate("winRate")}</span>
          <span>{translate("matches")}</span>
          <span>{translate("confidence")}</span>
        </div>
        {filtered.map((entry, index) => (
          <Link
            href={href(entry.id)}
            className="grid min-h-19 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-border py-4 transition-colors hover:bg-surface md:grid-cols-[1.8fr_.65fr_.65fr_.6fr] md:gap-4 md:py-0 md:hover:px-3"
            key={entry.id}
          >
            <span className="row-span-2 grid grid-cols-[32px_1fr] gap-x-3.5 gap-y-1 md:row-auto">
              <b className="row-span-2 self-center font-mono text-[11px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </b>
              <strong>
                {type === "champion"
                  ? translateChampionName(entry.name, locale)
                  : translateAugmentName(entry.name, locale)}
              </strong>
              <small className="truncate text-[11px] text-muted-foreground">
                {"description" in entry ? translateAugmentDesc(entry.description, locale) : entry.alias}
              </small>
            </span>
            <strong className="font-mono text-positive">{percent(entry.winRate)}</strong>
            <span className="text-xs text-muted-foreground md:text-base md:text-foreground">
              {number(entry.matches)}
            </span>
            <span className="hidden md:block">
              {entry.matches >= 5000
                ? translate("high")
                : entry.matches >= 1000
                  ? translate("medium")
                  : translate("low")}
            </span>
          </Link>
        ))}
        {pending && (
          <div className="flex items-center gap-3 py-8 text-muted-foreground">
            <Spinner /> {translate("loadingRanking")}
          </div>
        )}
        {!pending && error && <p className="py-8 text-negative">{translate("rankingError")}</p>}
        {!pending && !error && filtered.length === 0 && (
          <p className="py-8 text-muted-foreground">{translate("rankingEmpty")}</p>
        )}
      </div>
    </section>
  )
}
