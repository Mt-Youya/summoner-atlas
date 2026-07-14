import { DATA_CONTEXT } from "@/lib/context"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"

export async function DataContextBar() {
  const locale = await getLocale()
  return (
    <section
      className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/[0.06] py-4 text-xs text-muted-foreground"
      aria-label={t(locale, "dataScope")}
    >
      <span>
        <span className="text-white/40">{t(locale, "dataScope")}</span>{" "}
        <span className="text-foreground">{t(locale, "globalSample")}</span>
      </span>
      <span>
        <span className="text-white/40">{t(locale, "mode")}</span>{" "}
        <span className="text-foreground">{t(locale, "aram")}</span>
      </span>
      <span>
        <span className="text-white/40">{t(locale, "version")}</span>{" "}
        <span className="font-mono text-foreground">{DATA_CONTEXT.patch}</span>
      </span>
      <span className="ml-auto hidden text-white/25 md:inline">{t(locale, "contextHelp")}</span>
    </section>
  )
}
