import { Suspense } from "react"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { RunesRanking } from "./runes-ranking"
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
        <RunesRanking />
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
