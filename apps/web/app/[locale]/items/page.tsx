import { Suspense } from "react"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { DataContextBar } from "@/components/home/data-context-bar"
import { canonical } from "@/lib/site"
import { RankingView } from "@/components/ranking/ranking-view"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"

export default async function ItemsPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "eyebrowItems")}
        title={t(locale, "itemsRanking")}
        description={t(locale, "itemsDesc")}
      />
      <DataContextBar />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loading")}</p>}>
        <RankingView type="item" api="/api/items" />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "itemsRanking")} | Summoner Atlas`,
    description: t(locale, "itemsDesc"),
    alternates: { canonical: canonical(localizePath("/zh/items", locale)) },
  }
}
