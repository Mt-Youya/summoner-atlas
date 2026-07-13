import Link from "next/link"
import { ContextBar } from "@/components/context-bar"
import { GlobalGameSearch } from "@/components/global-game-search"
import { LanguageSwitcher } from "@/components/language-switcher"
import { DATA_CONTEXT, getAugments, getChampions, number, percent } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { localizePath, t } from "@summoner-atlas/i18n"

export const metadata = {
  title: "大乱斗版本决策",
  description: "在全球公开样本和固定版本上下文中，查询英雄、海克斯与组合结论。",
  alternates: { canonical: "/zh" },
}

export default async function ChineseHomePage() {
  const locale = await getLocale()
  const [champions, augments] = await Promise.all([getChampions(), getAugments()])
  const topChampions = champions.toSorted((a, b) => b.winRate - a.winRate).slice(0, 5)
  const topAugments = augments.toSorted((a, b) => b.winRate - a.winRate).slice(0, 4)
  const entries = [
    ...champions.map((champion) => ({
      id: champion.id,
      name: champion.name,
      aliases: [champion.alias],
      kind: "英雄" as const,
      href: `/zh/champions/${champion.id}`,
    })),
    ...augments.map((augment) => ({
      id: augment.id,
      name: augment.name,
      aliases: [],
      kind: "海克斯" as const,
      href: `/zh/augments/${augment.id}`,
    })),
  ]

  return (
    <main className="mx-auto min-h-screen w-[min(100%-2rem,1280px)]">
      <header className="grid min-h-20 grid-cols-[1fr_auto] items-center border-b border-border md:grid-cols-[1fr_auto_1fr]">
        <Link href={localizePath("/zh", locale)} className="font-mono text-xs font-bold tracking-[.13em]">
          SUMMONER <span className="text-primary">ATLAS</span>
        </Link>
        <nav className="hidden gap-7 md:flex" aria-label="主导航">
          <Link href={localizePath("/zh/champions", locale)}>{t(locale, "champions")}</Link>
          <Link href={localizePath("/zh/augments", locale)}>{t(locale, "augments")}</Link>
          <Link href={localizePath("/zh/combinations", locale)}>{t(locale, "combinations")}</Link>
          <Link href={localizePath("/zh/methodology", locale)}>{t(locale, "methodology")}</Link>
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <LanguageSwitcher />
          <Link className="text-sm" href={localizePath("/zh/profile", locale)}>
            {t(locale, "profile")}
          </Link>
        </div>
      </header>
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
      <ContextBar context={DATA_CONTEXT} />
      <section className="border-b border-border py-24" aria-labelledby="champion-summary">
        <div className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-bold tracking-[.12em] text-primary">
              {t(locale, "patchSummary")}
            </p>
            <h2
              className="text-[clamp(2.25rem,5vw,4rem)] font-black leading-[.92] tracking-[-.075em]"
              id="champion-summary"
            >
              {t(locale, "stablePicks")}
            </h2>
          </div>
          <Link
            className="inline-flex min-h-11 items-center text-sm text-primary"
            href={localizePath("/zh/champions", locale)}
          >
            {t(locale, "allChampions")}
          </Link>
        </div>
        <div className="grid border-l border-t border-border md:grid-cols-5">
          {topChampions.map((champion, index) => (
            <Link
              className="grid min-h-36 grid-cols-[50px_1fr_auto] content-center gap-3 border-b border-r border-border bg-surface p-5 hover:bg-surface-raised md:min-h-52 md:grid-cols-1 md:content-start"
              href={localizePath(`/zh/champions/${champion.id}`, locale)}
              key={champion.id}
            >
              <span className="font-mono text-xs text-muted-foreground">#{String(index + 1).padStart(2, "0")}</span>
              <h3 className="m-0 text-xl md:mt-4">{champion.name}</h3>
              <strong className="font-mono text-2xl text-positive md:col-auto">{percent(champion.winRate)}</strong>
              <p className="col-span-2 m-0 font-mono text-xs text-muted-foreground md:col-auto">
                {number(champion.matches)} · {t(locale, "highSample")}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section
        className="grid gap-12 border-b border-border py-24 md:grid-cols-[.9fr_1.1fr] md:gap-20"
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
                className="grid min-h-17 grid-cols-[1fr_auto] items-center gap-2 py-3"
                href={localizePath(`/zh/augments/${augment.id}`, locale)}
              >
                <span>{augment.name}</span>
                <strong className="font-mono text-positive">{percent(augment.winRate)}</strong>
                <small className="font-mono text-xs text-muted-foreground">{number(augment.matches)}</small>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <footer className="flex min-h-28 flex-col justify-center gap-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <span className="sm:mr-auto">
          {t(locale, "globalSample")} · {t(locale, "aram")} · {DATA_CONTEXT.patch}
        </span>
        <Link href={localizePath("/zh/methodology", locale)}>{t(locale, "dataMethod")}</Link>
        <Link href={localizePath("/zh/support", locale)}>{t(locale, "sources")}</Link>
      </footer>
    </main>
  )
}
