import Link from "next/link"
import { getLocale } from "@/lib/i18n-server"
import { t, localizePath } from "@summoner-atlas/i18n"

export async function CtaSection() {
  const locale = await getLocale()
  return (
    <section className="border-t border-white/[0.06] py-24 md:py-40" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="cta-heading"
          className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.92] tracking-[-0.06em]"
        >
          {t(locale, "homeTitleA")}
          <br />
          <span className="text-primary">{t(locale, "homeTitleB")}</span>
        </h2>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={localizePath("/zh/champions", locale)}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_-8px_var(--primary)] active:scale-[0.97]"
          >
            {t(locale, "allChampions")}
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href={localizePath("/zh/augments", locale)}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-8 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-white/[0.14] hover:bg-white/[0.06] active:scale-[0.97]"
          >
            {t(locale, "openAugments")}
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <Link href={localizePath("/zh/methodology", locale)} className="hover:text-foreground transition-colors">
            {t(locale, "dataMethod")}
          </Link>
          <Link href={localizePath("/zh/about", locale)} className="hover:text-foreground transition-colors">
            {t(locale, "about")}
          </Link>
        </div>
      </div>
    </section>
  )
}
