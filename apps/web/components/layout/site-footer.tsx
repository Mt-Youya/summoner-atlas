import Link from "next/link"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"

export async function SiteFooter() {
  const locale = await getLocale()
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto w-[min(100%-2rem,1280px)] py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1.5">
            <span className="font-mono text-xs font-bold tracking-[0.08em]">
              SUMMONER <span className="text-primary">ATLAS</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {t(locale, "footerVersion")} · {t(locale, "footerSnapshot")}
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground" aria-label="Footer navigation">
            <Link href={localizePath("/zh/methodology", locale)} className="hover:text-foreground transition-colors">
              {t(locale, "dataMethod")}
            </Link>
            <Link href={localizePath("/zh/support", locale)} className="hover:text-foreground transition-colors">
              {t(locale, "sources")}
            </Link>
            <Link href={localizePath("/zh/about", locale)} className="hover:text-foreground transition-colors">
              {t(locale, "about")}
            </Link>
            <Link href={localizePath("/zh/admin", locale)} className="hover:text-foreground transition-colors">
              {t(locale, "admin")}
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-white/20">{t(locale, "footerNotAffiliated")}</p>
      </div>
    </footer>
  )
}
