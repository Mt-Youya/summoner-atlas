import Link from "next/link"
import { ContextBar } from "@/components/layout/context-bar"
import { GlobalGameSearch } from "@/components/global-game-search"
import { LanguageSwitcher } from "@/components/language-switcher"
import { TierMark } from "@/components/display/tier-mark"
import { DATA_CONTEXT, getAugments, getChampions, number, percent } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { localizePath, t, translateChampionName } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"
import { MetricValue as MetricDisplay } from "@/components/display/metric-value"

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `Summoner Atlas | ${t(locale, "homeKicker")}`,
    description: t(locale, "homeDescription"),
    alternates: { canonical: canonical(localizePath("/zh", locale)) },
  }
}

export default async function ChineseHomePage() {
  const locale = await getLocale()
  const [champions, augments] = await Promise.all([getChampions(), getAugments()])
  const topChampions = champions.toSorted((a, b) => b.winRate - a.winRate).slice(0, 8)
  const topAugments = augments.toSorted((a, b) => b.winRate - a.winRate).slice(0, 4)
  const risingChampions = champions
    .filter((c) => c.matches >= 1000)
    .toSorted((a, b) => b.winRate - a.winRate)
    .slice(0, 5)
  const entries = [
    ...champions.map((champion) => ({
      id: champion.id,
      name: champion.name,
      aliases: [champion.alias],
      kind: t(locale, "champions"),
      href: localizePath(`/zh/champions/${champion.id}`, locale),
    })),
    ...augments.map((augment) => ({
      id: augment.id,
      name: augment.name,
      aliases: [],
      kind: t(locale, "augments"),
      href: localizePath(`/zh/augments/${augment.id}`, locale),
    })),
  ]

  return (
    <main className="mx-auto min-h-screen w-[min(100%-2rem,1280px)]">
      <header className="grid min-h-20 grid-cols-[1fr_auto] items-center border-b border-border md:grid-cols-[1fr_auto_1fr]">
        <Link href={localizePath("/zh", locale)} className="font-mono text-xs font-bold tracking-[.13em]">
          SUMMONER <span className="text-primary">ATLAS</span>
        </Link>
        <nav className="hidden gap-6 md:flex" aria-label="Main navigation">
          <Link className="text-sm hover:text-primary" href={localizePath("/zh/champions", locale)}>
            {t(locale, "champions")}
          </Link>
          <Link className="text-sm hover:text-primary" href={localizePath("/zh/items", locale)}>
            {t(locale, "items")}
          </Link>
          <Link className="text-sm hover:text-primary" href={localizePath("/zh/runes", locale)}>
            {t(locale, "runes")}
          </Link>
          <Link className="text-sm hover:text-primary" href={localizePath("/zh/augments", locale)}>
            {t(locale, "augments")}
          </Link>
          <Link className="text-sm hover:text-primary" href={localizePath("/zh/meta", locale)}>
            {t(locale, "meta")}
          </Link>
          <Link className="text-sm hover:text-primary" href={localizePath("/zh/builds", locale)}>
            {t(locale, "builds")}
          </Link>
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <LanguageSwitcher />
          <Link className="text-base" href={localizePath("/zh/profile", locale)}>
            {t(locale, "profile")}
          </Link>
        </div>
      </header>

      {/* Hero — 搜索+上下文 */}
      <section className="max-w-4xl py-[clamp(5rem,13vw,10rem)]">
        <p className="mb-4 font-mono text-xs font-bold tracking-[.12em] text-primary">{t(locale, "homeKicker")}</p>
        <h1 className="text-[clamp(3.6rem,10vw,8.25rem)] font-black leading-[.82] tracking-[-.085em]">
          {t(locale, "homeTitleA")}
          <br />
          <em className="not-italic text-primary">{t(locale, "homeTitleB")}</em>
        </h1>
        <p className="my-8 max-w-[52ch] text-base leading-8 text-muted-foreground">{t(locale, "homeDescription")}</p>
        <GlobalGameSearch entries={entries} />
      </section>

      {/* 数据上下文 */}
      <ContextBar context={DATA_CONTEXT} />

      {/* 模式入口 */}
      <section className="grid gap-4 border-b border-border py-16 md:grid-cols-3" aria-labelledby="mode-entries">
        <h2 className="sr-only" id="mode-entries">
          {t(locale, "modeData")}
        </h2>
        <Link
          href={localizePath("/zh/champions", locale)}
          className="group rounded border border-border bg-surface p-6 transition-colors hover:bg-surface-raised"
        >
          <span className="font-mono text-xs tracking-[.08em] text-primary">{t(locale, "summonersRift")}</span>
          <h3 className="mt-4 text-2xl font-bold tracking-[-.03em]">{t(locale, "summonersRift")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t(locale, "summonersRiftDesc")}</p>
          <b className="mt-6 block text-xs text-primary">{t(locale, "openBuilds")}</b>
        </Link>
        <Link
          href={localizePath("/zh/augments", locale)}
          className="group rounded border border-border bg-surface p-6 transition-colors hover:bg-surface-raised"
        >
          <span className="font-mono text-xs tracking-[.08em] text-primary">{t(locale, "aram")}</span>
          <h3 className="mt-4 text-2xl font-bold tracking-[-.03em]">{t(locale, "aram")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t(locale, "aramDesc")}</p>
          <b className="mt-6 block text-xs text-primary">{t(locale, "openAugments")}</b>
        </Link>
        <div className="rounded border border-border bg-surface p-6 opacity-50">
          <span className="font-mono text-xs tracking-[.08em] text-muted-foreground">{t(locale, "arena")}</span>
          <h3 className="mt-4 text-2xl font-bold tracking-[-.03em]">{t(locale, "arena")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t(locale, "arenaDesc")}</p>
          <b className="mt-6 block text-xs text-muted-foreground">{t(locale, "pending")}</b>
        </div>
      </section>

      {/* 版本摘要 — 稳定强势 */}
      <section className="border-b border-border py-20" aria-labelledby="stable-title">
        <div className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-bold tracking-[.12em] text-primary">
              {t(locale, "patchSummary")}
            </p>
            <h2
              className="text-[clamp(2.25rem,5vw,4rem)] font-black leading-[.92] tracking-[-.075em]"
              id="stable-title"
            >
              {t(locale, "stablePicks")}
            </h2>
          </div>
          <div className="flex gap-3">
            <Link
              className="inline-flex min-h-11 items-center text-sm text-primary"
              href={localizePath("/zh/champions", locale)}
            >
              {t(locale, "allChampions")}
            </Link>
            <Link
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground"
              href={localizePath("/zh/meta", locale)}
            >
              {t(locale, "openMeta")}
            </Link>
          </div>
        </div>
        <div className="grid border-l border-t border-border md:grid-cols-4">
          {topChampions.map((champion, index) => (
            <Link
              className="group grid min-h-40 grid-cols-[50px_1fr_auto] content-center gap-3 border-b border-r border-border bg-surface p-5 transition-colors hover:bg-surface-raised md:min-h-52 md:grid-cols-1 md:content-start"
              href={localizePath(`/zh/champions/${champion.id}`, locale)}
              key={champion.id}
            >
              <span className="font-mono text-xs text-muted-foreground">#{String(index + 1).padStart(2, "0")}</span>
              <TierMark tier={index < 2 ? "S" : index < 4 ? "A" : "B"} size="sm" />
              <h3 className="m-0 text-xl md:mt-3">{translateChampionName(champion.name, locale)}</h3>
              <strong className="font-mono text-2xl text-positive md:col-auto">{percent(champion.winRate)}</strong>
              <p className="col-span-2 m-0 font-mono text-xs text-muted-foreground md:col-auto">
                {number(champion.matches)} · {t(locale, "highSample")}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 版本变化 — 上升趋势 */}
      <section className="border-b border-border py-20" aria-labelledby="trending-title">
        <div className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-bold tracking-[.12em] text-positive">{t(locale, "trendingUp")}</p>
            <h2
              className="text-[clamp(2rem,4vw,3.25rem)] font-black leading-[.92] tracking-[-.06em]"
              id="trending-title"
            >
              {t(locale, "trendingUpTitle")}
            </h2>
          </div>
          <Link
            className="inline-flex min-h-11 items-center text-sm text-primary"
            href={localizePath("/zh/meta", locale)}
          >
            {t(locale, "fullMeta")}
          </Link>
        </div>
        <div className="divide-y divide-border border-t border-border">
          {risingChampions.map((champion, index) => (
            <Link
              className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-surface md:px-3"
              href={localizePath(`/zh/champions/${champion.id}`, locale)}
              key={champion.id}
            >
              <span className="flex items-center gap-4">
                <b className="font-mono text-xs text-muted-foreground">#{String(index + 1).padStart(2, "0")}</b>
                <span className="grid">
                  <strong>{translateChampionName(champion.name, locale)}</strong>
                  <small className="text-xs text-muted-foreground">{champion.alias}</small>
                </span>
              </span>
              <span className="flex items-center gap-4">
                <MetricDisplay value={champion.winRate} type="percent" className="font-mono text-positive" />
                <MetricDisplay value={champion.matches} type="number" className="text-xs text-muted-foreground" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 海克斯精选 */}
      <section
        className="grid gap-12 border-b border-border py-20 md:grid-cols-[.9fr_1.1fr] md:gap-20"
        aria-labelledby="augment-summary"
      >
        <div>
          <p className="mb-4 font-mono text-xs font-bold tracking-[.12em] text-primary">{t(locale, "modeData")}</p>
          <h2
            className="text-[clamp(2.25rem,5vw,4rem)] font-black leading-[.92] tracking-[-.075em]"
            id="augment-summary"
          >
            {t(locale, "researchAugments")}
          </h2>
          <p className="max-w-[42ch] leading-7 text-muted-foreground">{t(locale, "augmentDescription")}</p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center text-sm text-primary"
            href={localizePath("/zh/augments", locale)}
          >
            {t(locale, "openAugments")}
          </Link>
        </div>
        <ol className="m-0 list-none border-t border-border p-0">
          {topAugments.map((augment) => (
            <li className="border-b border-border" key={augment.id}>
              <Link
                className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-surface md:px-3"
                href={localizePath(`/zh/augments/${augment.id}`, locale)}
              >
                <span className="grid">
                  <strong>{augment.name}</strong>
                  <small className="text-xs text-muted-foreground line-clamp-1">{augment.description}</small>
                </span>
                <span className="flex items-center gap-3">
                  <span className="font-mono tabular-nums text-positive">{percent(augment.winRate)}</span>
                  <span className="text-xs text-muted-foreground">{number(augment.matches)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* 更多入口 */}
      <section className="grid gap-4 border-b border-border py-16 md:grid-cols-4" aria-labelledby="more-entries">
        <h2 className="sr-only" id="more-entries">
          {t(locale, "moreEntries")}
        </h2>
        <Link
          href={localizePath("/zh/patches", locale)}
          className="rounded border border-border bg-surface p-5 transition-colors hover:bg-surface-raised"
        >
          <span className="font-mono text-xs tracking-[.08em] text-primary">{t(locale, "patches")}</span>
          <h3 className="mt-3 text-lg font-bold">{t(locale, "patches")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t(locale, "patchTimeline")}</p>
        </Link>
        <Link
          href={localizePath("/zh/builds", locale)}
          className="rounded border border-border bg-surface p-5 transition-colors hover:bg-surface-raised"
        >
          <span className="font-mono text-xs tracking-[.08em] text-primary">{t(locale, "builds")}</span>
          <h3 className="mt-3 text-lg font-bold">{t(locale, "builds")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t(locale, "championBuildResearch")}</p>
        </Link>
        <Link
          href={localizePath("/zh/combinations", locale)}
          className="rounded border border-border bg-surface p-5 transition-colors hover:bg-surface-raised"
        >
          <span className="font-mono text-xs tracking-[.08em] text-primary">{t(locale, "combinations")}</span>
          <h3 className="mt-3 text-lg font-bold">{t(locale, "combinations")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t(locale, "comboExploration")}</p>
        </Link>
        <Link
          href={localizePath("/zh/compare", locale)}
          className="rounded border border-border bg-surface p-5 transition-colors hover:bg-surface-raised"
        >
          <span className="font-mono text-xs tracking-[.08em] text-primary">{t(locale, "compare")}</span>
          <h3 className="mt-3 text-lg font-bold">{t(locale, "compareStudy")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t(locale, "multiChampCompare")}</p>
        </Link>
      </section>

      {/* 页脚 */}
      <footer className="flex min-h-28 flex-col justify-center gap-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <span className="sm:mr-auto">
          {t(locale, "globalSample")} · {t(locale, "aram")} · {DATA_CONTEXT.patch}
        </span>
        <Link href={localizePath("/zh/methodology", locale)}>{t(locale, "dataMethod")}</Link>
        <Link href={localizePath("/zh/support", locale)}>{t(locale, "sources")}</Link>
        <Link href={localizePath("/zh/about", locale)}>{t(locale, "about")}</Link>
        <Link href={localizePath("/zh/admin", locale)}>{t(locale, "admin")}</Link>
      </footer>
    </main>
  )
}
