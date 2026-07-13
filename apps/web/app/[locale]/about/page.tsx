import { PageFrame, PageTitle } from "@/components/page-frame"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"
import { canonical } from "@/lib/site"

export default async function AboutPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "aboutPage")}
        title={t(locale, "aboutTitle")}
        description={t(locale, "aboutDesc")}
      />
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return {
    title: `${t(locale, "aboutPage")} | Summoner Atlas`,
    alternates: { canonical: canonical(localizePath("/zh/about", locale)) },
  }
}
