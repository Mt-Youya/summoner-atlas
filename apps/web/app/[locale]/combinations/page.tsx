import Link from "next/link"
import Image from "next/image"
import { DataContextBar } from "@/components/home/data-context-bar"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { getChampions, number, percent } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { t, translateChampionName, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function CombinationsPage() {
  const locale = await getLocale()
  const champions = (await getChampions()).toSorted((a, b) => b.winRate - a.winRate).slice(0, 12)
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "comboResearch")}
        title={t(locale, "combinations")}
        description={t(locale, "comboResearchDesc")}
      />
      <DataContextBar />
      <section className="grid gap-3 py-12 sm:grid-cols-2 md:grid-cols-3 md:pb-28">
        {champions.map((champion) => (
          <Link
            className="group flex min-h-[180px] flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white/[0.04]"
            href={localizePath(`/zh/champions/${champion.id}`, locale)}
            key={champion.id}
          >
            {champion.imageUrl && (
              <Image
                src={champion.imageUrl}
                alt={translateChampionName(champion.name, locale)}
                width={48}
                height={48}
                className="rounded-full ring-1 ring-white/[0.08]"
              />
            )}
            <span className="font-mono text-[10px] tracking-[0.08em] text-primary">
              {t(locale, "champions")}
            </span>
            <h2 className="text-xl font-bold tracking-[-0.02em]">
              {translateChampionName(champion.name, locale)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {percent(champion.winRate)} {t(locale, "winRate")} · {number(champion.matches)} {t(locale, "games")}
            </p>
            <span className="mt-auto text-xs text-muted-foreground transition-colors group-hover:text-primary">
              {t(locale, "details")} &rarr;
            </span>
          </Link>
        ))}
      </section>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "combinations")} | Summoner Atlas`,
    description: t(locale, "comboResearchDesc"),
    alternates: { canonical: canonical(localizePath("/zh/combinations", locale)) },
  }
}
