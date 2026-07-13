import { Suspense } from "react"
import { PageFrame, PageTitle } from "@/components/page-frame"
import { canonical } from "@/lib/site"
import { BuildsView } from "./builds-view"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"

export default async function BuildsPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "eyebrowBuilds")}
        title={t(locale, "buildsTitle")}
        description={t(locale, "buildsDesc")}
      />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loading")}</p>}>
        <BuildsView />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "buildsTitle")} | Summoner Atlas`,
    description: t(locale, "buildsDesc"),
    alternates: { canonical: canonical(localizePath("/zh/builds", locale)) },
  }
}
