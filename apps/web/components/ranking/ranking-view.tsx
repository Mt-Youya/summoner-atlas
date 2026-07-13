"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ContextBar } from "@/components/layout/context-bar"
import { RankingFilters } from "@/components/ranking/ranking-filters"
import { RankingTable, type RankingEntry } from "@/components/ranking/ranking-table"
import { DATA_CONTEXT } from "@/lib/context"
import { useTranslation, useLocale } from "@/components/locale-provider"
import { localizePath } from "@summoner-atlas/i18n"
import { Spinner } from "@summoner-atlas/ui/spinner"

export type RankingType = "champion" | "augment" | "item" | "rune"

const typePathMap: Record<RankingType, string> = {
  champion: "champions",
  augment: "augments",
  item: "items",
  rune: "runes",
}

export function RankingView({ type, api }: { type: RankingType; api: string }) {
  const translate = useTranslation()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, setPending] = useState(false)
  const [entries, setEntries] = useState<RankingEntry[]>([])
  const [error, setError] = useState(false)
  const query = params.get("q") ?? ""
  const sort = (params.get("sort") ?? "winRate") as "winRate" | "pickRate" | "matches"
  const minMatches = Number(params.get("minMatches") ?? "0")

  useEffect(() => {
    const controller = new AbortController()
    setPending(true)
    setError(false)
    fetch(api, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Request failed"))))
      .then(setEntries)
      .catch((reason) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(true)
      })
      .finally(() => setPending(false))
    return () => controller.abort()
  }, [api])

  const filters = { query, sort, minMatches }
  const update = (next: typeof filters) => {
    const p = new URLSearchParams()
    if (next.query) p.set("q", next.query)
    if (next.sort !== "winRate") p.set("sort", next.sort)
    if (next.minMatches > 0) p.set("minMatches", String(next.minMatches))
    router.replace(`${pathname}?${p}`)
    queueMicrotask(() => setPending(false))
  }
  const clear = () => router.replace(pathname)

  const filtered = useMemo(() => {
    let list = entries
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.description ?? "").toLowerCase().includes(q) ||
          (e.alias ?? "").toLowerCase().includes(q)
      )
    }
    if (minMatches > 0) list = list.filter((e) => e.matches >= minMatches)
    list = [...list].sort((a, b) => {
      if (sort === "matches") return b.matches - a.matches
      if (sort === "pickRate") return b.pickRate - a.pickRate
      return b.winRate - a.winRate
    })
    return list
  }, [entries, query, sort, minMatches])

  return (
    <>
      <ContextBar context={DATA_CONTEXT} />
      <div className="mb-6 mt-6">
        <RankingFilters
          filters={filters}
          onChange={update}
          showClear={Boolean(query || sort !== "winRate" || minMatches > 0)}
          onClear={clear}
        />
      </div>
      <section aria-busy={pending} className="pb-28">
        <RankingTable
          entries={filtered}
          type={type}
          detailHref={(id) => localizePath(`/zh/${typePathMap[type]}/${id}`, locale)}
          locale={locale}
        />
        {pending && (
          <div className="flex items-center gap-3 py-8 text-muted-foreground">
            <Spinner /> {translate("loadingRanking")}
          </div>
        )}
        {!pending && error && <p className="py-8 text-negative">{translate("rankingError")}</p>}
        {!pending && !error && filtered.length === 0 && (
          <p className="py-8 text-muted-foreground">{translate("rankingEmpty")}</p>
        )}
      </section>
    </>
  )
}
