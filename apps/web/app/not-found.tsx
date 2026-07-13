import Link from "next/link"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"

export default async function NotFound() {
  const locale = await getLocale()
  return (
    <main className="mx-auto grid min-h-[70vh] w-[min(100%-3rem,45rem)] content-center gap-5">
      <span className="font-mono text-[11px] tracking-widest text-primary">{t(locale, "routeNotFound")}</span>
      <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[0.9] tracking-[-0.07em]">
        {t(locale, "dataNotFound")}
      </h1>
      <p className="leading-8 text-muted-foreground">{t(locale, "linkExpiredDesc")}</p>
      <Link className="w-max border border-primary px-4 py-3 text-primary" href="/zh">
        {t(locale, "backToHome")}
      </Link>
    </main>
  )
}
