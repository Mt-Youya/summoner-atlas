"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  Search01Icon,
  AnalyticsUpIcon,
  AnalyticsDownIcon,
  ArrowRight01Icon,
  SparklesIcon,
  Clock01Icon,
  HashtagIcon,
  ZapIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"
import { Badge, Input, Skeleton, Progress } from "@summoner-atlas/ui"
import { mockDataService } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import type {
  PatchSummary,
  ChampionRank,
  ChampionTrend,
  AugmentRank,
  ChampionSearchResult,
  AtlasGraphData,
} from "@/lib/data-service"

gsap.registerPlugin(useGSAP, ScrollTrigger)

import { confidenceVariant, localizedName } from "@/lib/utils"

/* ── Helpers ── */

function GlowNumber({ value, unit = "%", size = "lg" }: { value: number; unit?: string; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-5xl md:text-7xl font-extrabold" : "text-3xl md:text-4xl font-bold"
  return (
    <span className={`${cls} tabular-nums tracking-tight ${size === "lg" ? "glow-high" : "glow-mid"}`}>
      {value.toFixed(1)}
      <span className="text-lg md:text-xl ml-0.5 text-[var(--text-secondary)] font-medium">{unit}</span>
    </span>
  )
}

/* ── Section 1: Hero ── */

function HeroSection({
  patch,
  onSearch,
  searchResults,
  searchVisible,
  hasSearchQuery,
  t,
}: {
  patch: PatchSummary | null
  onSearch: (q: string) => void
  searchResults: ChampionSearchResult[]
  searchVisible: boolean
  hasSearchQuery: boolean
  t: (key: string, fallback?: string) => string
}) {
  const [query, setQuery] = useState("")
  const starRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Star-field infinite drift
      gsap.to(starRef.current, {
        backgroundPosition: "50% 50%",
        duration: 60,
        repeat: -1,
        ease: "none",
      })
    },
    { scope: starRef }
  )

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div ref={starRef} className="absolute inset-0 bg-starfield opacity-70" style={{ backgroundPosition: "0% 0%" }} />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-80" />
      {/* Radial wash for text contrast */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-[var(--bg-page)]/60 to-[var(--bg-page)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32 md:py-48">
        {/* Version pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-glow)] bg-[var(--bg-elevated)]/80 backdrop-blur-sm mb-10">
          <div className="w-2 h-2 rounded-full bg-hextech-blue shadow-[var(--glow-high)] animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-hextech-blue">
            {t("homeKicker")} · {patch?.version ?? "---"}
          </span>
          <span className="text-muted-foreground text-xs">
            {patch ? `${(patch.totalSamples / 1_000_000).toFixed(1)}M` : "---"} samples
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight text-foreground mb-6">
          {t("homeTitleA")}
          <br />
          <span className="text-hextech-blue glow-high">{t("homeTitleB")}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-14 leading-relaxed">
          {t("homeDescription")}
        </p>

        {/* Search bar */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-0 bg-hextech-blue/10 rounded-2xl blur-xl group-hover:bg-hextech-blue/20 transition-all duration-500" />
          <div className="relative flex items-center bg-[var(--bg-elevated)] border border-[var(--border-glow)] rounded-2xl px-6 py-5 shadow-[var(--glow-mid)] group-hover:shadow-[var(--glow-high)] transition-shadow duration-500">
            <HugeiconsIcon icon={Search01Icon} className="size-5 text-muted-foreground mr-3 shrink-0" />
            <Input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                onSearch(e.target.value)
              }}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
            />
            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[10px] font-mono text-muted-foreground ml-3">
              <HugeiconsIcon icon={ZapIcon} className="size-3" /> Enter
            </kbd>
          </div>

          {/* Search dropdown */}
          <SearchDropdown results={searchResults} visible={searchVisible} hasQuery={hasSearchQuery} t={t} />
        </div>

        {/* Meta line */}
        <div className="flex items-center justify-center gap-8 mt-10 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
            {t("updatedAt")}{" "}
            {patch?.lastUpdated ? new Date(patch.lastUpdated).toLocaleDateString("zh-CN") : t("unknownTime")}
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={HashtagIcon} className="size-3.5" />
            {(patch?.totalSamples ?? 0).toLocaleString()} {t("globalSample")}
          </span>
        </div>
      </div>
    </section>
  )
}

/* ── Section 2: Strong Picks — Gapless Bento Grid ── */

function StrongPicksSection({
  champions,
  t,
}: {
  champions: ChampionRank[]
  t: (key: string, fallback?: string) => string
}) {
  const { locale } = useTranslation()
  const top5 = champions.slice(0, 5)

  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {t("patchSummary")}
              <span className="text-hextech-blue glow-mid"> {t("stablePicks")}</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-lg">{t("contextHelp")}</p>
          </div>
          <Link
            href="/champions"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-hextech-blue hover:text-hextech-amber transition-colors duration-300 group"
          >
            {t("allChampions")}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4 group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Bento Grid — grid-flow-dense, zero empty cells */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4 grid-flow-dense">
          {top5.map((item, i) => {
            const spans =
              i === 0
                ? "md:col-span-2 md:row-span-2 md:row-start-1"
                : i === 1
                  ? "md:col-span-2 md:row-span-1 md:col-start-3 md:row-start-1"
                  : `md:col-span-1 md:row-span-1 md:row-start-2 ${i === 2 ? "md:col-start-3" : ""}`

            return (
              <Link
                key={item.champion.id}
                href={`/champions/${item.champion.id}`}
                className={`${spans} group relative overflow-hidden rounded-2xl card-glow bg-card cursor-pointer`}
                data-card
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 ease-out"
                  style={item.champion.splashUrl ? { backgroundImage: `url(${item.champion.splashUrl})` } : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />

                <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hextech-blue mb-1">
                        #{item.rank} — {localizedName(item.champion, locale).primary}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.champion.name}</p>
                    </div>
                    <Badge variant={confidenceVariant(item.confidence)} className="text-[10px]">
                      {t(item.confidence)}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-baseline gap-3">
                    {i === 0 ? (
                      <GlowNumber value={item.winRate} size="lg" />
                    ) : (
                      <span className="text-2xl md:text-3xl font-bold tabular-nums glow-mid">
                        {item.winRate.toFixed(1)}
                        <span className="text-sm text-muted-foreground ml-0.5">%</span>
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {item.matches.toLocaleString()} {t("games")}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <Link
          href="/champions"
          className="md:hidden flex items-center justify-center gap-2 mt-8 text-sm font-medium text-hextech-blue"
        >
          {t("allChampions")} <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Link>
      </div>
    </section>
  )
}

/* ── Section 3: Trending — Dual Column Diverging ── */

function TrendEntry({ item, positive }: { item: ChampionTrend; positive: boolean }) {
  const { locale } = useTranslation()
  const change = item.winRateChange
  return (
    <Link
      href={`/champions/${item.champion.id}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-transparent hover:border-[var(--border-glow)] card-glow group transition-all duration-300"
      data-card
    >
      <div
        className="size-10 rounded-lg bg-cover bg-center shrink-0"
        style={item.champion.splashUrl ? { backgroundImage: `url(${item.champion.splashUrl})` } : undefined}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{localizedName(item.champion, locale).primary}</p>
        <p className="text-xs text-muted-foreground">{item.currentWinRate.toFixed(1)}%</p>
      </div>
      <div className="text-right">
        <span className={`font-bold text-lg tabular-nums ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? "+" : ""}
          {change.toFixed(1)}%
        </span>
        <Progress
          value={Math.min(Math.abs(change) * 20, 100)}
          className={`h-1 w-16 mt-1 ml-auto ${positive ? "bg-emerald-500/20 [&_[data-slot=progress-track]]:bg-emerald-400" : "bg-red-500/20 [&_[data-slot=progress-track]]:bg-red-400"}`}
        />
      </div>
    </Link>
  )
}

function TrendingSection({
  trending,
  t,
}: {
  trending: { up: ChampionTrend[]; down: ChampionTrend[] }
  t: (key: string, fallback?: string) => string
}) {
  return (
    <section className="py-32 md:py-48 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          {t("patchSummary")}
          <span className="text-hextech-blue glow-mid"> {t("trendingUpTitle")}</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-16 max-w-lg">{t("contextHelp")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <HugeiconsIcon icon={AnalyticsUpIcon} className="size-4 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">{t("trendingUp")}</span>
            </div>
            {trending.up.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">{t("noTrendingUp")}</p>
            ) : (
              trending.up.map((item) => <TrendEntry key={item.champion.id} item={item} positive />)
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <HugeiconsIcon icon={AnalyticsDownIcon} className="size-4 text-red-400" />
              </div>
              <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">{t("trendingDown")}</span>
            </div>
            {trending.down.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">{t("noTrendingDown")}</p>
            ) : (
              trending.down.map((item) => <TrendEntry key={item.champion.id} item={item} positive={false} />)
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 4: Augments — Horizontal Scroll ── */

function AugmentsSection({ augments, t }: { augments: AugmentRank[]; t: (key: string, fallback?: string) => string }) {
  const { locale } = useTranslation()
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {t("researchAugments")}
              <span className="text-hextech-purple glow-mid"> {t("augments")}</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-lg">{t("augmentDescription")}</p>
          </div>
          <Link
            href="/augments"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-hextech-purple hover:text-hextech-amber transition-colors duration-300 group shrink-0"
          >
            {t("openAugments")}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4 group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {augments.map((item) => (
            <Link
              key={item.augment.id}
              href={`/augments/${item.augment.id}`}
              className="group flex-shrink-0 w-[320px] snap-start rounded-2xl card-glow bg-card p-6 hover:shadow-[var(--glow-high)] transition-all duration-500"
              data-card
            >
              <div className="flex items-start justify-between mb-4">
                <div className="size-12 overflow-hidden rounded-xl bg-hextech-purple/15">
                  {item.augment.iconUrl ? (
                    <img
                      src={item.augment.iconUrl}
                      alt={localizedName(item.augment, locale).primary}
                      className="size-full object-cover"
                    />
                  ) : (
                    <HugeiconsIcon icon={SparklesIcon} className="m-3 size-6 text-hextech-purple" />
                  )}
                </div>
                <span className="text-2xl font-bold tabular-nums glow-mid">
                  {item.winRate.toFixed(1)}
                  <span className="text-sm text-muted-foreground ml-0.5">%</span>
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">
                {localizedName(item.augment, locale).primary}
              </h3>
              <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">{item.augment.description}</p>

              <div className="flex items-center gap-1">
                {item.suitableChampions.slice(0, 4).map((champ) => (
                  <div
                    key={champ.id}
                    className="size-7 rounded-full bg-cover bg-center border-2 border-card ring-1 ring-[var(--border-subtle)]"
                    style={champ.splashUrl ? { backgroundImage: `url(${champ.splashUrl})` } : undefined}
                    title={localizedName(champ, locale).primary}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground ml-2">
                  {item.matches.toLocaleString()} {t("games")}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/augments"
          className="md:hidden flex items-center justify-center gap-2 mt-8 text-sm font-medium text-hextech-purple"
        >
          {t("openAugments")} <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Link>
      </div>
    </section>
  )
}

/* ── Section 5: Atlas Preview — Star Chart ── */

function AtlasPreviewSection({
  atlasData,
  t,
}: {
  atlasData: AtlasGraphData | null
  t: (key: string, fallback?: string) => string
}) {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden card-glow bg-[var(--bg-card)]">
          {/* Background grid + star field */}
          <div className="absolute inset-0 bg-starfield opacity-40" />
          <div className="absolute inset-0 bg-grid opacity-60" />

          <div className="relative z-10 p-10 md:p-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {t("comboResearch")}
              <span className="text-hextech-blue glow-mid"> Atlas</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">{t("comboResearchDesc")}</p>

            {/* SVG star chart — static preview */}
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/8] mb-12">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={i * 12}
                    x2={100}
                    y2={i * 12}
                    stroke="rgba(0,212,255,0.06)"
                    strokeWidth={0.1}
                  />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 14.2}
                    y1={0}
                    x2={i * 14.2}
                    y2={60}
                    stroke="rgba(0,212,255,0.06)"
                    strokeWidth={0.1}
                  />
                ))}
                {atlasData?.links.map((link, i) => {
                  const source = atlasData.nodes.find((n) => n.id === link.source)
                  const target = atlasData.nodes.find((n) => n.id === link.target)
                  if (!source || !target) return null
                  return (
                    <line
                      key={`link-${i}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="rgba(0,212,255,0.15)"
                      strokeWidth={link.strength * 0.5}
                    />
                  )
                })}
                {atlasData?.nodes.map((node, i) => {
                  const isChampion = node.type === "champion"
                  const fill = isChampion ? "rgba(0,212,255,0.8)" : "rgba(123,47,190,0.7)"
                  const r = node.size * 0.8
                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 0.8}
                        fill={fill}
                        opacity={0.15}
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s`, animationDuration: "3s" }}
                      />
                      <circle cx={node.x} cy={node.y} r={r} fill={fill} />
                      <text
                        x={node.x}
                        y={node.y + r + 1.8}
                        textAnchor="middle"
                        fill="var(--text-secondary)"
                        fontSize={1.2}
                        fontFamily="Outfit, sans-serif"
                      >
                        {node.name}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            <Link
              href="/atlas"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-hextech-blue text-[var(--bg-page)] font-bold text-sm uppercase tracking-wider shadow-[var(--glow-high)] hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] hover:scale-105 transition-all duration-500"
            >
              {t("openAtlas")}
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 6: Mode Entries ── */

function ModeEntriesSection({ t }: { t: (key: string, fallback?: string) => string }) {
  const modes = [
    {
      href: "/champions?mode=summonersRift",
      titleKey: "summonersRift",
      descKey: "summonersRiftDesc",
      available: false,
      seed: "summoners-rift",
    },
    {
      href: "/champions?mode=tft",
      titleKey: "tft" as const,
      descKey: "tftDesc" as const,
      available: false,
      seed: "tft",
    },
    { href: "/champions?mode=arena", titleKey: "arena", descKey: "arenaDesc", available: false, seed: "arena" },
  ]

  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          {t("moreEntries")}
          <span className="text-hextech-blue glow-mid"> {t("mode")}</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-16 max-w-lg">{t("aramOnlyData")}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((mode) => (
            <div
              key={mode.seed}
              className="group relative overflow-hidden rounded-2xl card-glow bg-card p-8 cursor-pointer hover:shadow-[var(--glow-high)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-muted/40 opacity-15 group-hover:opacity-30 transition-opacity duration-700" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-foreground mb-2">{t(mode.titleKey)}</h3>
                <p className="text-sm text-muted-foreground mb-6">{t(mode.descKey)}</p>
                {mode.available ? (
                  <Link
                    href={mode.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-hextech-blue hover:text-hextech-amber transition-colors duration-300"
                  >
                    {t("details")} <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Link>
                ) : (
                  <Badge variant="outline">{t("pending")}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Search Results Dropdown ── */

function SearchDropdown({
  results,
  visible,
  hasQuery,
  t,
}: {
  results: ChampionSearchResult[]
  visible: boolean
  hasQuery: boolean
  t: (key: string, fallback?: string) => string
}) {
  const { locale } = useTranslation()
  if (!visible) return null

  if (hasQuery && results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-3 bg-popover border rounded-2xl shadow-[var(--glow-mid)] p-8 text-center z-50">
        <HugeiconsIcon icon={Cancel01Icon} className="size-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">{t("searchEmpty")}</p>
      </div>
    )
  }

  if (results.length === 0) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-3 bg-popover border rounded-2xl shadow-[var(--glow-mid)] overflow-hidden z-50">
      {results.slice(0, 8).map((item) => (
        <Link
          key={item.champion.id}
          href={`/champions/${item.champion.id}`}
          className="flex items-center gap-4 px-5 py-3 hover:bg-muted transition-colors duration-200 group"
        >
          <div
            className="size-10 rounded-lg bg-cover bg-center shrink-0"
            style={item.champion.splashUrl ? { backgroundImage: `url(${item.champion.splashUrl})` } : undefined}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground group-hover:text-hextech-blue transition-colors">
              {localizedName(item.champion, locale).primary}
            </p>
            <p className="text-xs text-muted-foreground">{item.champion.name}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <span className="text-sm font-bold tabular-nums text-foreground">{item.winRate.toFixed(1)}%</span>
            <Badge variant={confidenceVariant(item.confidence)} className="text-[10px]">
              {t(item.confidence)}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  )
}

/* ── Home Skeleton ── */

function HomeSkeleton() {
  return (
    <div className="space-y-0">
      {/* Hero skeleton */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <Skeleton className="h-8 w-48 mx-auto rounded-full" />
          <Skeleton className="h-16 w-[70%] mx-auto rounded-2xl" />
          <Skeleton className="h-6 w-[50%] mx-auto rounded-xl" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto rounded-2xl" />
        </div>
      </section>

      {/* Strong Picks skeleton */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4 rounded-xl" />
          <Skeleton className="h-5 w-96 mb-16 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
            <Skeleton className="md:col-span-2 md:row-span-2 rounded-2xl" />
            <Skeleton className="md:col-span-2 rounded-2xl" />
            <Skeleton className="rounded-2xl" />
            <Skeleton className="rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Trending skeleton */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-48 mb-16 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, col) => (
              <div key={col} className="space-y-4">
                <Skeleton className="h-6 w-32 rounded-xl" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Augments skeleton */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-56 mb-16 rounded-xl" />
          <div className="flex gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-[320px] h-[220px] shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ── Main Homepage ── */

export default function HomePage() {
  const { t } = useTranslation()
  const [patch, setPatch] = useState<PatchSummary | null>(null)
  const [topChampions, setTopChampions] = useState<ChampionRank[]>([])
  const [trending, setTrending] = useState<{ up: ChampionTrend[]; down: ChampionTrend[] }>({ up: [], down: [] })
  const [augments, setAugments] = useState<AugmentRank[]>([])
  const [atlasData, setAtlasData] = useState<AtlasGraphData | null>(null)
  const [searchResults, setSearchResults] = useState<ChampionSearchResult[]>([])
  const [searchVisible, setSearchVisible] = useState(false)
  const [hasSearchQuery, setHasSearchQuery] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const dataReady = patch !== null

  useEffect(() => {
    async function load() {
      const [p, champs, tr, aug, atlas] = await Promise.all([
        mockDataService.getPatchSummary(),
        mockDataService.getTopChampions({ mode: "aram", region: "cn", limit: 8 }),
        mockDataService.getTrendingChampions({ mode: "aram", region: "cn" }),
        mockDataService.getTopAugments({ mode: "aram", limit: 5 }),
        mockDataService.getAtlasPreview({ mode: "aram" }),
      ])
      setPatch(p)
      setTopChampions(champs)
      setTrending(tr)
      setAugments(aug)
      setAtlasData(atlas)
    }
    load()
  }, [])

  // Section staggered reveal on scroll
  useGSAP(
    () => {
      if (!dataReady) return
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const dur = prefersReduced ? 0 : 0.8
      const cardDur = prefersReduced ? 0 : 0.55
      const sections = gsap.utils.toArray<HTMLElement>("[data-animate]")
      sections.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: prefersReduced ? 0 : 48,
          duration: dur,
          ease: "power2.out",
        })
      })
      const cards = gsap.utils.toArray<HTMLElement>("[data-stagger] [data-card]")
      cards.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el.closest("[data-stagger]") as HTMLElement,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: prefersReduced ? 0 : 32,
          scale: prefersReduced ? 1 : 0.96,
          duration: cardDur,
          ease: "power2.out",
        })
      })
      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill())
      }
    },
    { scope: contentRef, dependencies: [dataReady] }
  )

  async function handleSearch(query: string) {
    if (query.length < 1) {
      setSearchResults([])
      setSearchVisible(false)
      setHasSearchQuery(false)
      return
    }
    setHasSearchQuery(true)
    const results = await mockDataService.searchChampions({ query, mode: "aram" })
    setSearchResults(results)
    setSearchVisible(true)
  }

  if (!dataReady) return <HomeSkeleton />

  return (
    <div ref={contentRef}>
      <HeroSection
        patch={patch}
        onSearch={handleSearch}
        searchResults={searchResults}
        searchVisible={searchVisible}
        hasSearchQuery={hasSearchQuery}
        t={t}
      />
      <div data-animate data-stagger>
        <StrongPicksSection champions={topChampions} t={t} />
      </div>
      <div data-animate data-stagger>
        <TrendingSection trending={trending} t={t} />
      </div>
      <div data-animate data-stagger>
        <AugmentsSection augments={augments} t={t} />
      </div>
      <div data-animate>
        <AtlasPreviewSection atlasData={atlasData} t={t} />
      </div>
      <div data-animate>
        <ModeEntriesSection t={t} />
      </div>
    </div>
  )
}
