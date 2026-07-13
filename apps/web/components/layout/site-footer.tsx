import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"

export async function SiteFooter() {
  const locale = await getLocale()
  return (
    <footer className="flex min-h-28 flex-col justify-center gap-2 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        {t(locale, "footerVersion")} 16.13 · {t(locale, "footerSnapshot")}
      </span>
      <span>{t(locale, "footerNotAffiliated")}</span>
    </footer>
  )
}
