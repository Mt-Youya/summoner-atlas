import { Suspense } from "react"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { RankingView } from "@/components/ranking/ranking-view"
import { DATA_VERSION } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function ChampionsPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={`${t(locale, "championRanking")} / ${DATA_VERSION}`}
        title={t(locale, "stablePicks")}
        description={t(locale, "contextHelp")}
      />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loadingRanking")}</p>}>
        <RankingView type="champion" api="/api/champions" />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "championRanking")} | Summoner Atlas`,
    description: t(locale, "contextHelp"),
    alternates: { canonical: canonical(localizePath("/zh/champions", locale)) },
  }
}
