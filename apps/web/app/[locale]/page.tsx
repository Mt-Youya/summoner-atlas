import { SiteHeader } from "@/components/layout/site-header"
import { HeroClient, GlobalGameSearchClient } from "@/components/home/hero-section"
import { DataContextBar } from "@/components/home/data-context-bar"
import { BentoGrid } from "@/components/home/bento-grid"
import { ScrollShowcase } from "@/components/home/scroll-showcase"
import { CtaSection } from "@/components/home/cta-section"
import { getAugments, getChampions } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { localizePath, t } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `Summoner Atlas | ${t(locale, "homeKicker")}`,
    description: t(locale, "homeDescription"),
    alternates: { canonical: canonical(localizePath("/zh", locale)) },
  }
}

export default async function HomePage() {
  const locale = await getLocale()
  const [champions, augments] = await Promise.all([getChampions(), getAugments()])

  const topChampions = champions.toSorted((a, b) => b.winRate - a.winRate).slice(0, 8)
  const trendingChampions = champions
    .filter((c) => c.matches >= 1000)
    .toSorted((a, b) => b.winRate - a.winRate)
    .slice(0, 8)

  const bentoChampions = topChampions.map((c) => ({
    id: c.id,
    name: c.name,
    alias: c.alias,
    winRate: c.winRate,
    matches: c.matches,
    imageUrl: c.imageUrl,
  }))

  const showcaseChampions = trendingChampions.map((c) => ({
    id: c.id,
    name: c.name,
    alias: c.alias,
    winRate: c.winRate,
    matches: c.matches,
    imageUrl: c.imageUrl,
  }))

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
    <main className="relative z-10 mx-auto min-h-screen w-[min(100%-2rem,1280px)]">
      <SiteHeader />

      {/* Attention: Cinematic Hero */}
      <HeroClient
        titleA={t(locale, "homeTitleA")}
        titleB={t(locale, "homeTitleB")}
        kicker={t(locale, "homeKicker")}
        description={t(locale, "homeDescription")}
        entries={entries}
      >
        <GlobalGameSearchClient entries={entries} />
      </HeroClient>

      <DataContextBar />

      {/* Interest: Bento Grid */}
      <BentoGrid
        champions={bentoChampions}
        augmentsHref={localizePath("/zh/augments", locale)}
      />

      {/* Desire: GSAP Scroll Showcase */}
      <ScrollShowcase champions={showcaseChampions} />

      {/* Action: CTA + Footer */}
      <CtaSection />

      <footer className="flex min-h-20 flex-col justify-center gap-4 border-t border-white/[0.06] py-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <span className="sm:mr-auto">
          {t(locale, "globalSample")} · {t(locale, "aram")} · {t(locale, "footerVersion")}
        </span>
        <a
          href="https://github.com/Mt-Youya/summoner-atlas"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <span>{t(locale, "footerNotAffiliated")}</span>
      </footer>
    </main>
  )
}
