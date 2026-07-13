"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { number, percent, type AugmentRank, type ChampionRank } from "@/lib/data"
import { Button } from "@summoner-atlas/ui/button"
import { Input } from "@summoner-atlas/ui/input"
import { Spinner } from "@summoner-atlas/ui/spinner"
import { NativeSelect, NativeSelectOption } from "@summoner-atlas/ui/native-select"
import { ContextBar } from "@/components/context-bar"
import { DATA_CONTEXT } from "@/lib/data"
import { translateChampionName, translateAugmentName } from "@summoner-atlas/i18n"
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
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("榜单请求失败"))))
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
  const href = (id: number) => (type === "champion" ? `/zh/champions/${id}` : `/zh/augments/${id}`)
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
        <NativeSelect value={sort} onChange={(event) => update("sort", event.target.value)} aria-label={translate("sort")} className="[&>select]:min-h-11 [&>select]:border-border [&>select]:bg-surface [&>select]:text-sm">
          <NativeSelectOption value="winRate">{translate("sortWinRate")}</NativeSelectOption>
          <NativeSelectOption value="matches">{translate("sortMatches")}</NativeSelectOption>
        </NativeSelect>
        <NativeSelect value={minimumMatches} onChange={(event) => update("minMatches", event.target.value === "0" ? "" : event.target.value)} aria-label={translate("sample")} className="[&>select]:min-h-11 [&>select]:border-border [&>select]:bg-surface [&>select]:text-sm">
          <NativeSelectOption value="0">{translate("allSamples")}</NativeSelectOption>
          <NativeSelectOption value="1000">{translate("atLeast1000")}</NativeSelectOption>
          <NativeSelectOption value="5000">{translate("atLeast5000")}</NativeSelectOption>
        </NativeSelect>
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
        <div className="hidden min-h-11 grid-cols-[1.8fr_.65fr_.65fr_.6fr] items-center gap-4 border-b border-border font-mono text-[10px] tracking-[.08em] text-muted-foreground md:grid">
          <span>{translate("rankName")}</span>
          <span>{translate("winRate")}</span>
          <span>{translate("matches")}</span>
          <span>{translate("confidence")}</span>
        </div>
        {filtered.map((entry, index) => (
          <Link
            href={href(entry.id)}
            className="grid min-h-[76px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-border py-4 transition-colors hover:bg-surface md:grid-cols-[1.8fr_.65fr_.65fr_.6fr] md:gap-4 md:py-0 md:hover:px-3"
            key={entry.id}
          >
            <span className="row-span-2 grid grid-cols-[32px_1fr] gap-x-3.5 gap-y-1 md:row-auto">
              <b className="row-span-2 self-center font-mono text-[11px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </b>
              <strong>{type === "champion" ? translateChampionName(entry.name, locale) : translateAugmentName(entry.name, locale)}</strong>
              <small className="truncate text-[11px] text-muted-foreground">
                {"description" in entry ? entry.description : entry.alias}
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
