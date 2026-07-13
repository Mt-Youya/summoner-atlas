import { Suspense } from "react"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { RankingExplorer } from "@/components/ranking-explorer"
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
        <RankingExplorer type="champion" />
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
