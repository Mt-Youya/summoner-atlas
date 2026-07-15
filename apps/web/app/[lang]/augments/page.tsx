"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { Search01Icon, ArrowUp01Icon, ArrowDown01Icon, ArrowUpDownIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import {
  Skeleton,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  Card,
  CardContent,
  CardHeader,
} from "@summoner-atlas/ui"
import { Input } from "@summoner-atlas/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@summoner-atlas/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@summoner-atlas/ui/table"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import type { AugmentRank, GameMode } from "@/lib/data-service"

type SortField = "winRate" | "matches" | "name"
type SortOrder = "asc" | "desc"

const MODES: { value: GameMode; i18nKey: string }[] = [
  { value: "aram", i18nKey: "aram" },
  { value: "summonersRift", i18nKey: "summonersRift" },
  { value: "arena", i18nKey: "arena" },
]

const MIN_MATCHES = [
  { value: 0, i18nKey: "allSamples" },
  { value: 1000, i18nKey: "atLeast1000" },
  { value: 5000, i18nKey: "atLeast5000" },
]

export default function AugmentsPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<AugmentRank[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [mode, setMode] = useState<GameMode>("aram")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("winRate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [minMatches, setMinMatches] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await mockDataService.getTopAugments({ mode, limit: 50 })
      setData(result)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [mode])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    let list = [...data]
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter((a) => a.augment.name.toLowerCase().includes(q) || a.augment.nameZh.includes(q))
    }
    if (minMatches > 0) list = list.filter((a) => a.matches >= minMatches)
    list.sort((a, b) => {
      let va: number, vb: number
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.augment.nameZh.localeCompare(b.augment.nameZh)
          : b.augment.nameZh.localeCompare(a.augment.nameZh)
      }
      va = sortField === "winRate" ? a.winRate : a.matches
      vb = sortField === "winRate" ? b.winRate : b.matches
      return sortOrder === "asc" ? va - vb : vb - va
    })
    return list
  }, [data, debouncedSearch, minMatches, sortField, sortOrder])

  function handleSort(field: SortField) {
    if (sortField === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
    else {
      setSortField(field)
      setSortOrder("desc")
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    )
  }

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowError")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("augmentRanking")}</h1>
      </div>

      <Card className="hidden md:block rounded-2xl card-glow bg-card overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              />
              <Input
                placeholder={t("rankingSearchAugment")}
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
              {filtered.length} {t("augments")}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <HugeiconsIcon icon={SparklesIcon} className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t("rankingEmpty")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                    <span className="inline-flex items-center gap-1">
                      {t("augment")} <SortIcon field="name" />
                    </span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("winRate")}>
                    <span className="inline-flex items-center gap-1">
                      {t("winRate")} <SortIcon field="winRate" />
                    </span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("matches")}>
                    <span className="inline-flex items-center gap-1">
                      {t("matches")} <SortIcon field="matches" />
                    </span>
                  </TableHead>
                  <TableHead>{t("suitableChampions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item, i) => (
                  <TableRow key={item.augment.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-muted-foreground text-sm">{i + 1}</TableCell>
                    <TableCell>
                      <Link
                        href={`/augments/${item.augment.id}`}
                        className="flex items-center gap-3 hover:text-primary transition-colors"
                      >
                        <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                          <HugeiconsIcon icon={SparklesIcon} className="size-4 text-hextech-blue" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{item.augment.nameZh}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.augment.name}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-sm">
                      {item.winRate.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                      {item.matches.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <AvatarGroup>
                        {item.suitableChampions.slice(0, 3).map((c) => (
                          <Avatar key={c.id} size="sm">
                            <AvatarImage src={c.avatarUrl} alt={c.name} />
                            <AvatarFallback>{c.nameZh.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Mobile list */}
      <div className="md:hidden space-y-3">
        {filtered.map((item, i) => (
          <Link
            key={item.augment.id}
            href={`/augments/${item.augment.id}`}
            className="flex items-center gap-4 rounded-2xl card-glow bg-card p-4 hover:shadow-[var(--glow-mid)] transition-all"
          >
            <span className="font-mono text-sm text-muted-foreground w-6 text-right">{i + 1}</span>
            <div className="size-10 rounded-xl bg-muted flex items-center justify-center">
              <HugeiconsIcon icon={SparklesIcon} className="size-5 text-hextech-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{item.augment.nameZh}</p>
              <p className="text-xs text-muted-foreground truncate">{item.augment.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm tabular-nums glow-mid">{item.winRate.toFixed(1)}%</p>
              <p className="text-[10px] text-muted-foreground">
                {item.matches.toLocaleString()} {t("games")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
