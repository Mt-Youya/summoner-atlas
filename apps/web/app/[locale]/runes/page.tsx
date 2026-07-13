import { Suspense } from "react"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { canonical } from "@/lib/site"
import { RankingView } from "@/components/ranking/ranking-view"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"

export default async function RunesPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "eyebrowRunes")}
        title={t(locale, "runesRanking")}
        description={t(locale, "runesDesc")}
      />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loading")}</p>}>
        <RankingView type="rune" api="/api/runes" />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "runesRanking")} | Summoner Atlas`,
    description: t(locale, "runesDesc"),
    alternates: { canonical: canonical(localizePath("/zh/runes", locale)) },
  }
}
