import { Suspense } from "react"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { RankingExplorer } from "@/components/ranking-explorer"
import { DATA_VERSION } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"
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
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loadingRanking")}</p>}>
        <RankingExplorer type="augment" />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "augmentRanking")} | Summoner Atlas`,
    description: t(locale, "augmentDescription"),
    alternates: { canonical: canonical("/zh/augments") },
  }
}
