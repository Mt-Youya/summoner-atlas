import { Suspense } from "react"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { canonical } from "@/lib/site"
import { MetaView } from "./meta-view"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"

export default async function MetaPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "eyebrowMeta")}
        title={t(locale, "metaTitle")}
        description={t(locale, "metaDesc")}
      />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loading")}</p>}>
        <MetaView />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "metaTitle")} | Summoner Atlas`,
    description: t(locale, "metaDesc"),
    alternates: { canonical: canonical(localizePath("/zh/meta", locale)) },
  }
}
