import { Suspense } from "react"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { DataContextBar } from "@/components/home/data-context-bar"
import { RankingView } from "@/components/ranking/ranking-view"
import { DATA_VERSION } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function AugmentsPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={`${t(locale, "augmentRanking")} / ${DATA_VERSION}`}
        title={t(locale, "researchAugments")}
        description={t(locale, "augmentDescription")}
      />
      <DataContextBar />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loadingRanking")}</p>}>
        <RankingView type="augment" api="/api/augments" />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "augmentRanking")} | Summoner Atlas`,
    description: t(locale, "augmentDescription"),
    alternates: { canonical: canonical(localizePath("/zh/augments", locale)) },
  }
}
