import { Suspense } from "react"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { ItemsRanking } from "./items-ranking"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"

export default async function ItemsPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "eyebrowItems")}
        title={t(locale, "itemsRanking")}
        description={t(locale, "itemsDesc")}
      />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loading")}</p>}>
        <ItemsRanking />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "itemsRanking")} | Summoner Atlas`,
    description: t(locale, "itemsDesc"),
    alternates: { canonical: canonical("/zh/items") },
  }
}
