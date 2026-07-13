import { Suspense } from "react"
import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { canonical } from "@/lib/site"
import { PatchesView } from "./patches-view"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"

export default async function PatchesPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "eyebrowPatches")}
        title={t(locale, "patchesTitle")}
        description={t(locale, "patchesDesc")}
      />
      <Suspense fallback={<p className="py-8 text-muted-foreground">{t(locale, "loading")}</p>}>
        <PatchesView />
      </Suspense>
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "patchesTitle")} | Summoner Atlas`,
    description: t(locale, "patchesDesc"),
    alternates: { canonical: canonical(localizePath("/zh/patches", locale)) },
  }
}
