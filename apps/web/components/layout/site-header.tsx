import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MobileNav } from "@/components/layout/mobile-nav"
import { getLocale } from "@/lib/i18n-server"
import { localizePath, t } from "@summoner-atlas/i18n"

export async function SiteHeader() {
  const locale = await getLocale()
  const links = [
    [t(locale, "champions"), "/zh/champions"],
    [t(locale, "augments"), "/zh/augments"],
    [t(locale, "meta"), "/zh/meta"],
  ] as const
  return (
    <header className="relative z-50">
      <div className="mx-auto flex min-h-[72px] items-center justify-between px-4">
        <Link
          href={localizePath("/zh", locale)}
          className="flex shrink-0 items-center gap-2.5 font-mono text-xs font-bold tracking-[0.08em]"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
            A
          </span>
          <span className="hidden sm:inline">
            SUMMONER <span className="text-primary">ATLAS</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1 backdrop-blur-xl md:flex"
          aria-label="Main navigation"
        >
          {links.map(([label, href]) => (
            <Link
              className="inline-flex min-h-9 items-center rounded-xl px-4 text-xs font-medium text-muted-foreground transition-all hover:bg-white/[0.06] hover:text-foreground"
              href={localizePath(href, locale)}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <Link
            className="inline-flex min-h-9 items-center rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 text-xs font-medium text-muted-foreground backdrop-blur-xl transition-all hover:border-white/[0.1] hover:text-foreground"
            href={localizePath("/zh/profile", locale)}
          >
            {t(locale, "profile")}
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  )
}
