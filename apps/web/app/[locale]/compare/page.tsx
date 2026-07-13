import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { ContextSelector } from "@/components/selector/context-selector"
import { getChampions, DATA_CONTEXT } from "@/lib/data"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"
import { CompareView } from "./compare-view"

export default async function ComparePage() {
  const locale = await getLocale()
  const champions = await getChampions()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "championCompare")}
        title={t(locale, "compareTitle")}
        description={t(locale, "compareDesc")}
      />
      <ContextSelector readonly context={DATA_CONTEXT} />
      <CompareView champions={champions} />
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "championCompare")} | Summoner Atlas`,
    description: t(locale, "compareDesc"),
    alternates: { canonical: canonical(localizePath("/zh/compare", locale)) },
  }
}
