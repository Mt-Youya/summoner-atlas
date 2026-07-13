import { PageFrame } from "@/components/layout/page-frame"
import { PageTitle } from "@/components/layout/page-title"
import { PreferencesPanel } from "@/components/preferences-panel"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"

export default async function PreferencesPage() {
  const locale = await getLocale()
  return (
    <PageFrame>
      <PageTitle
        eyebrow={t(locale, "profilePreferences")}
        title={t(locale, "displayPreferences")}
        description={t(locale, "profileDesc")}
      />
      <PreferencesPanel />
    </PageFrame>
  )
}

export async function generateMetadata() {
  const locale = await getLocale()
  return { title: `${t(locale, "preferences")} | Summoner Atlas` }
}
