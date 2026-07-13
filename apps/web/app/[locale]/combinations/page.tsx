import Link from "next/link"
import Image from "next/image"
import { ContextSelector } from "@/components/selector/context-selector"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { DATA_CONTEXT, getChampions, number, percent } from "@/lib/data"
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
      <ContextSelector readonly context={DATA_CONTEXT} />
      <section className="grid gap-4 py-12 md:grid-cols-3 md:pb-28">
        {champions.map((champion) => (
          <Link
            className="flex min-h-48 flex-col border border-border bg-surface p-6 hover:bg-surface-raised"
            href={localizePath(`/zh/champions/${champion.id}`, locale)}
            key={champion.id}
          >
            {champion.imageUrl && (
              <Image
                src={champion.imageUrl}
                alt={champion.name}
                width={64}
                height={64}
                className="mb-4 rounded-full"
              />
            )}
            <span className="font-mono text-xs text-primary">{t(locale, "champions")}</span>
            <h2 className="my-3 text-3xl tracking-[-.04em]">{translateChampionName(champion.name, locale)}</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {percent(champion.winRate)} {t(locale, "winRate")} · {number(champion.matches)} {t(locale, "games")}
            </p>
            <b className="mt-auto text-xs">{t(locale, "details")}</b>
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
