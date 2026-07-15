"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { Search01Icon, ArrowUp01Icon, ArrowDown01Icon, ArrowUpDownIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import { Badge, Skeleton, Avatar, AvatarImage, AvatarFallback } from "@summoner-atlas/ui"
import { Input } from "@summoner-atlas/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@summoner-atlas/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@summoner-atlas/ui/table"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { confidenceVariant } from "@/lib/utils"
import type { ChampionRank, GameMode, Region } from "@/lib/data-service"

type SortField = "winRate" | "pickRate" | "matches" | "name" | "rank"
type SortOrder = "asc" | "desc"

const MODES: { value: GameMode; i18nKey: string }[] = [
  { value: "aram", i18nKey: "aram" },
  { value: "summonersRift", i18nKey: "summonersRift" },
  { value: "arena", i18nKey: "arena" },
]

const REGIONS: { value: Region; label: string }[] = [
  { value: "cn", label: "CN" },
  { value: "kr", label: "KR" },
  { value: "global", label: "Global" },
]

const MIN_MATCHES = [
  { value: 0, i18nKey: "allSamples" },
  { value: 1000, i18nKey: "atLeast1000" },
  { value: 5000, i18nKey: "atLeast5000" },
]

export default function ChampionsPage() {
  const { t } = useTranslation()

  const [data, setData] = useState<ChampionRank[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [mode, setMode] = useState<GameMode>("aram")
  const [region, setRegion] = useState<Region>("cn")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("rank")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [minMatches, setMinMatches] = useState(0)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await mockDataService.getTopChampions({ mode, region, limit: 50 })
      setData(result)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [mode, region])

  useEffect(() => {
    load()
  }, [load])

  // Client-side filter + sort
  const filtered = useMemo(() => {
    let list = [...data]

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (c) =>
          c.champion.name.toLowerCase().includes(q) ||
          c.champion.nameZh.includes(q) ||
          c.champion.aliases.some((a) => a.toLowerCase().includes(q))
      )
    }

    if (minMatches > 0) {
      list = list.filter((c) => c.matches >= minMatches)
    }

    list.sort((a, b) => {
      let va: number, vb: number
      if (sortField === "name") {
        va = 0
        vb = 0
        return sortOrder === "asc"
          ? a.champion.nameZh.localeCompare(b.champion.nameZh)
          : b.champion.nameZh.localeCompare(a.champion.nameZh)
      }
      if (sortField === "rank") {
        va = a.rank
        vb = b.rank
      } else if (sortField === "winRate") {
        va = a.winRate
        vb = b.winRate
      } else if (sortField === "pickRate") {
        va = a.pickRate
        vb = b.pickRate
      } else {
        va = a.matches
        vb = b.matches
      }
      return sortOrder === "asc" ? va - vb : vb - va
    })

    return list
  }, [data, debouncedSearch, minMatches, sortField, sortOrder])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder(field === "rank" ? "asc" : "desc")
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <HugeiconsIcon icon={ArrowUpDownIcon} className="size-3.5 text-muted-foreground/50" />
    return sortOrder === "asc" ? (
      <HugeiconsIcon icon={ArrowUp01Icon} className="size-3.5" />
    ) : (
      <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5" />
    )
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6 shadow-[var(--glow-low)]">
          <HugeiconsIcon icon={SparklesIcon} className="size-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t("rankingError")}</h2>
        <p className="text-muted-foreground mb-8">{t("cannotLoadPage")}</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-[var(--glow-mid)]"
        >
          {t("reload")}
        </button>
      </div>
    )
  }

  /* ── Content ── */
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Page header */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowError")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("championRanking")}</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={mode} onValueChange={(v) => setMode(v as GameMode)}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODES.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {t(m.i18nKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
          <SelectTrigger size="sm" className="w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(minMatches)} onValueChange={(v) => setMinMatches(Number(v))}>
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MIN_MATCHES.map((m) => (
              <SelectItem key={m.value} value={String(m.value)}>
                {t(m.i18nKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} {t("champion").toLowerCase()}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && !loading ? (
        <div className="text-center py-20">
          <HugeiconsIcon icon={SparklesIcon} className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">{t("rankingEmpty")}</p>
          <button
            onClick={() => {
              setSearch("")
              setMinMatches(0)
              setMode("aram")
            }}
            className="mt-3 text-sm text-primary hover:underline"
          >
            {t("clear")}
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl card-glow bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 cursor-pointer select-none" onClick={() => handleSort("rank")}>
                    <span className="inline-flex items-center gap-1">
                      # <SortIcon field="rank" />
                    </span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                    <span className="inline-flex items-center gap-1">
                      {t("champion")} <SortIcon field="name" />
                    </span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("winRate")}>
                    <span className="inline-flex items-center gap-1">
                      {t("winRate")} <SortIcon field="winRate" />
                    </span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("pickRate")}>
                    <span className="inline-flex items-center gap-1">
                      {t("pickRate")} <SortIcon field="pickRate" />
                    </span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("matches")}>
                    <span className="inline-flex items-center gap-1">
                      {t("matches")} <SortIcon field="matches" />
                    </span>
                  </TableHead>
                  <TableHead className="text-right">{t("confidence")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.champion.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-muted-foreground text-sm">{item.rank}</TableCell>
                    <TableCell>
                      <Link
                        href={`/champions/${item.champion.id}`}
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        <Avatar size="sm">
                          <AvatarImage src={item.champion.avatarUrl} alt={item.champion.name} />
                          <AvatarFallback>{item.champion.nameZh.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{item.champion.nameZh}</p>
                          <p className="text-xs text-muted-foreground">{item.champion.name}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-sm">
                      {item.winRate.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                      {item.pickRate.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                      {item.matches.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={confidenceVariant(item.confidence)} className="text-[10px]">
                        {t(item.confidence)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {filtered.map((item) => (
              <Link
                key={item.champion.id}
                href={`/champions/${item.champion.id}`}
                className="flex items-center gap-4 rounded-2xl card-glow bg-card p-4 hover:shadow-[var(--glow-mid)] transition-all"
              >
                <span className="font-mono text-sm text-muted-foreground w-6 text-right">{item.rank}</span>
                <Avatar size="lg">
                  <AvatarImage src={item.champion.avatarUrl} alt={item.champion.name} />
                  <AvatarFallback>{item.champion.nameZh.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">{item.champion.nameZh}</p>
                  <p className="text-xs text-muted-foreground">{item.champion.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm tabular-nums glow-mid">{item.winRate.toFixed(1)}%</p>
                  <Badge variant={confidenceVariant(item.confidence)} className="text-[10px] mt-0.5">
                    {t(item.confidence)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
