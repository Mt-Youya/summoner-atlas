"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Search01Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { Badge, Skeleton, Tabs, TabsList, TabsTrigger, Avatar, AvatarImage, AvatarFallback } from "@summoner-atlas/ui"
import { Input } from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import type { ChampionSearchResult, AugmentRank, GameMode } from "@/lib/data-service"

export default function SearchPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [champions, setChampions] = useState<ChampionSearchResult[]>([])
  const [augments, setAugments] = useState<AugmentRank[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"champions" | "augments">("champions")
  const [mode] = useState<GameMode>("aram")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setChampions([])
      setAugments([])
      return
    }
    setLoading(true)
    Promise.all([
      mockDataService.searchChampions({ query: debouncedQuery, mode }),
      mockDataService.getTopAugments({ mode, limit: 50 }),
    ])
      .then(([champResults, augResults]) => {
        setChampions(champResults)
        setAugments(
          augResults.filter(
            (a) =>
              a.augment.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              a.augment.nameZh.includes(debouncedQuery)
          )
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [debouncedQuery, mode])

  const hasResults = champions.length > 0 || augments.length > 0

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{t("eyebrowError")}</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{t("search")}</h1>
      </div>

      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-12 text-base"
          autoFocus
        />
      </div>

      {/* Tabs */}
      {debouncedQuery.trim() && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as "champions" | "augments")}>
          <TabsList className="w-full justify-start gap-0 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="champions"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[selected]:border-primary data-[selected]:text-primary data-[selected]:shadow-none data-[selected]:bg-transparent"
            >
              {t("champions")} ({champions.length})
            </TabsTrigger>
            <TabsTrigger
              value="augments"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[selected]:border-primary data-[selected]:text-primary data-[selected]:shadow-none data-[selected]:bg-transparent"
            >
              {t("augments")} ({augments.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !debouncedQuery.trim() ? (
        <div className="text-center py-16">
          <HugeiconsIcon icon={Search01Icon} className="size-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground">{t("searchHelp")}</p>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-16">
          <HugeiconsIcon icon={SparklesIcon} className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">{t("searchEmpty")}</p>
        </div>
      ) : tab === "champions" ? (
        <div className="space-y-2">
          {champions.map((item) => (
            <Link
              key={item.champion.id}
              href={`/champions/${item.champion.id}`}
              className="flex items-center gap-4 rounded-xl card-glow bg-card p-4 hover:shadow-[var(--glow-mid)] transition-all"
            >
              <Avatar size="lg">
                <AvatarImage src={item.champion.avatarUrl} alt={item.champion.name} />
                <AvatarFallback>{item.champion.nameZh.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{item.champion.nameZh}</p>
                <p className="text-xs text-muted-foreground">{item.champion.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm tabular-nums">{item.winRate.toFixed(1)}%</p>
                <Badge variant="secondary" className="text-[10px]">
                  {item.matches.toLocaleString()} {t("games")}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {augments.map((item) => (
            <Link
              key={item.augment.id}
              href={`/augments/${item.augment.id}`}
              className="flex items-center gap-4 rounded-xl card-glow bg-card p-4 hover:shadow-[var(--glow-mid)] transition-all"
            >
              <div className="size-10 overflow-hidden rounded-xl bg-muted">
                {item.augment.iconUrl ? (
                  <img src={item.augment.iconUrl} alt={item.augment.nameZh} className="size-full object-cover" />
                ) : (
                  <HugeiconsIcon icon={SparklesIcon} className="m-2.5 size-5 text-hextech-blue" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{item.augment.nameZh}</p>
                <p className="truncate text-xs text-muted-foreground">{item.augment.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm tabular-nums">{item.winRate.toFixed(1)}%</p>
                <Badge variant="secondary" className="text-[10px]">
                  {item.matches.toLocaleString()} {t("games")}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
