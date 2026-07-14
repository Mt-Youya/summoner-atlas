import Link from "next/link"
import { getLocale } from "@/lib/i18n-server"
import { t } from "@summoner-atlas/i18n"

export default async function NotFound() {
  const locale = await getLocale()
  return (
    <main className="relative z-10 mx-auto grid min-h-[70vh] w-[min(100%-2rem,40rem)] content-center gap-6">
      <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary">
        {t(locale, "routeNotFound")}
      </span>
      <h1 className="text-[clamp(3rem,8vw,5rem)] font-black leading-[0.9] tracking-[-0.07em]">
        {t(locale, "dataNotFound")}
      </h1>
      <p className="max-w-[48ch] text-base leading-7 text-muted-foreground">
        {t(locale, "linkExpiredDesc")}
      </p>
      <Link
        className="inline-flex min-h-12 w-fit items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_-8px_var(--primary)] active:scale-[0.97]"
        href="/zh"
      >
        {t(locale, "backToHome")}
      </Link>
    </main>
  )
}
